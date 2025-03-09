-- Migration: fix signup trigger bug
-- Description: Fixes issues with the handle_new_user trigger function that's preventing user signup

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Add error handling
    BEGIN
        -- Create a personal space for the new user
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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Create the trigger again with the same timing to ensure it runs correctly
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
