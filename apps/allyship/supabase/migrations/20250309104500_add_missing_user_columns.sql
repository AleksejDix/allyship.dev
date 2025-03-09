-- Migration: Add missing columns to User table
-- Description: Adds first_name, last_name and full_name columns to the existing User table

-- Add missing columns to the User table
ALTER TABLE "public"."User"
ADD COLUMN IF NOT EXISTS "first_name" text,
ADD COLUMN IF NOT EXISTS "last_name" text,
ADD COLUMN IF NOT EXISTS "full_name" text;

-- Update the handle_new_user function to properly populate these fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    parsed_first_name TEXT;
    parsed_last_name TEXT;
BEGIN
    -- Parse name from metadata with all possible fields
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

    -- Create entry in public.User table
    BEGIN
        INSERT INTO public."User" (id, email, first_name, last_name, full_name)
        VALUES (
            NEW.id,
            NEW.email,
            parsed_first_name,
            parsed_last_name,
            CASE
                WHEN parsed_first_name IS NOT NULL AND parsed_last_name IS NOT NULL
                THEN parsed_first_name || ' ' || parsed_last_name
                WHEN parsed_first_name IS NOT NULL
                THEN parsed_first_name
                ELSE split_part(NEW.email, '@', 1)
            END
        );
    EXCEPTION
        WHEN OTHERS THEN
            -- Log the error but don't prevent the user from being created
            RAISE WARNING 'Error creating user record: %', SQLERRM;
    END;

    -- Create a personal space for the new user
    BEGIN
        INSERT INTO public."Space" (name, owner_id, is_personal)
        VALUES (
            'Personal Space',
            NEW.id,
            true
        );
    EXCEPTION
        WHEN OTHERS THEN
            -- Log the error but don't prevent the user from being created
            RAISE WARNING 'Error creating personal space: %', SQLERRM;
    END;

    -- Always return NEW to allow the user creation to proceed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it's using the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
