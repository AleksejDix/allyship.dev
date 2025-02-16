-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created_create_space ON auth.users;

-- Create helper function for name parsing
CREATE OR REPLACE FUNCTION public.parse_name(full_name TEXT)
RETURNS TABLE(first_name TEXT, last_name TEXT)
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    IF full_name IS NULL OR full_name = '' THEN
        RETURN QUERY SELECT NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        trim(split_part(full_name, ' ', 1)),
        CASE
            WHEN position(' ' in full_name) > 0
            THEN trim(substring(full_name from position(' ' in full_name)))
            ELSE NULL
        END;
END;
$$;

-- Update the function to handle name parsing better
CREATE OR REPLACE FUNCTION public.create_personal_space()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    space_id UUID;
    user_name TEXT;
    parsed_first_name TEXT;
    parsed_last_name TEXT;
BEGIN
    -- First try to get name from metadata
    SELECT
        COALESCE(
            NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
            NULLIF(NEW.raw_user_meta_data->>'given_name', ''),
            (SELECT first_name FROM public.parse_name(NEW.raw_user_meta_data->>'full_name')),
            (SELECT first_name FROM public.parse_name(NEW.raw_user_meta_data->>'name')),
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(
            NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
            NULLIF(NEW.raw_user_meta_data->>'family_name', ''),
            (SELECT last_name FROM public.parse_name(NEW.raw_user_meta_data->>'full_name')),
            (SELECT last_name FROM public.parse_name(NEW.raw_user_meta_data->>'name'))
        )
    INTO parsed_first_name, parsed_last_name;

    -- Get display name for space
    user_name := CASE
        WHEN parsed_first_name IS NOT NULL AND parsed_last_name IS NOT NULL
        THEN parsed_first_name || ' ' || parsed_last_name
        WHEN parsed_first_name IS NOT NULL
        THEN parsed_first_name
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
        parsed_first_name,
        parsed_last_name,
        'active',
        NOW()
    );

    -- Log successful creation
    INSERT INTO public.user_audit_logs (
        user_id,
        action,
        details
    ) VALUES (
        NEW.id,
        'user_profile_created',
        jsonb_build_object(
            'email', NEW.email,
            'first_name', parsed_first_name,
            'last_name', parsed_last_name,
            'metadata', NEW.raw_user_meta_data
        )
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
