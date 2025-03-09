-- Migration: Add missing User table
-- Description: Creates the User table that's being referenced by existing functions

-- Create the User table that's being referenced by various functions
CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
    "email" text,
    "first_name" text,
    "last_name" text,
    "full_name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "deleted_at" timestamp with time zone,
    "status" text DEFAULT 'active'::text NOT NULL,
    "data_retention_period" interval DEFAULT '1 year'::interval,
    "deletion_requested_at" timestamp with time zone
);

-- Enable RLS
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;

-- Create policies for User table
CREATE POLICY "Users can view their own user data"
    ON "public"."User"
    FOR SELECT
    TO authenticated
    USING ((auth.uid() = id));

CREATE POLICY "Users can update their own user data"
    ON "public"."User"
    FOR UPDATE
    TO authenticated
    USING ((auth.uid() = id))
    WITH CHECK ((auth.uid() = id));

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON "public"."User"
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON TABLE public."User" TO anon, authenticated, service_role;

-- Create or modify the handle_new_user trigger to populate the User table
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

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
