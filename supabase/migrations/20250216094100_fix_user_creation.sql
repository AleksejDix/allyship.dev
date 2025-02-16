-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created_create_space ON auth.users;

-- Update the function to handle JSON metadata more safely
CREATE OR REPLACE FUNCTION public.create_personal_space()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    space_id UUID;
    user_name TEXT;
BEGIN
    -- Safely extract user name from metadata
    user_name := CASE
        WHEN NEW.raw_user_meta_data IS NULL THEN NEW.email
        WHEN NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN NEW.raw_user_meta_data->>'full_name'
        WHEN NEW.raw_user_meta_data->>'name' IS NOT NULL THEN NEW.raw_user_meta_data->>'name'
        ELSE split_part(NEW.email, '@', 1)
    END;

    -- Create personal space with safe naming
    INSERT INTO public."Space" (
        name,
        description,
        is_personal,
        created_by
    )
    VALUES (
        user_name || '''s Personal Space',
        'Personal space for ' || user_name,
        true,
        NEW.id
    )
    RETURNING id INTO space_id;

    -- Create ownership membership
    INSERT INTO public."Membership" (
        space_id,
        user_id,
        role,
        status
    )
    VALUES (
        space_id,
        NEW.id,
        'owner',
        'active'
    );

    -- Create initial user profile
    INSERT INTO public."User" (
        id,
        first_name,
        last_name,
        status,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(
            NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
            NULLIF(split_part(user_name, ' ', 1), ''),
            split_part(NEW.email, '@', 1)
        ),
        NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
        'active',
        NOW()
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't prevent user creation
        INSERT INTO public.user_audit_logs (
            user_id,
            action,
            details
        ) VALUES (
            NEW.id,
            'user_creation_error',
            jsonb_build_object(
                'error', SQLERRM,
                'email', NEW.email,
                'metadata', NEW.raw_user_meta_data
            )
        );
        RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created_create_space
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_personal_space();
