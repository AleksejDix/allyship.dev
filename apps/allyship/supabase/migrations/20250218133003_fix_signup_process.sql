-- Migration: fix_signup_process
-- Description: Adds automatic personal space creation for new users and updates Space RLS policies

-- Create function to handle personal space creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public."Space" (name, owner_id, is_personal)
    VALUES (
        'Personal Space',  -- Default name
        NEW.id,           -- User ID
        true              -- Mark as personal space
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create personal space for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public."Space";
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public."Space";

-- Create more permissive policies
CREATE POLICY "Users can view their own spaces"
    ON public."Space"
    FOR SELECT
    TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Service role can create spaces"
    ON public."Space"
    FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "Users can create their own spaces"
    ON public."Space"
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

-- Create personal spaces for existing users who don't have one
INSERT INTO public."Space" (name, owner_id, is_personal)
SELECT
    'Personal Space',
    auth.users.id,
    true
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public."Space"
    WHERE owner_id = auth.users.id
    AND is_personal = true
);
