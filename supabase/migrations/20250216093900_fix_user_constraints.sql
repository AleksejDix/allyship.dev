-- First drop the existing constraint if it exists
ALTER TABLE public."User"
DROP CONSTRAINT IF EXISTS "User_id_fkey";

-- Add the constraint back with CASCADE
ALTER TABLE public."User"
ADD CONSTRAINT "User_id_fkey"
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Ensure RLS is enabled
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Recreate the user policies
DROP POLICY IF EXISTS "Users can view active profiles" ON public."User";
DROP POLICY IF EXISTS "Users can update their own active profile" ON public."User";

CREATE POLICY "Users can view active profiles"
    ON public."User"
    FOR SELECT
    USING (status = 'active');

CREATE POLICY "Users can update their own active profile"
    ON public."User"
    FOR UPDATE
    USING (auth.uid() = id AND status = 'active');
