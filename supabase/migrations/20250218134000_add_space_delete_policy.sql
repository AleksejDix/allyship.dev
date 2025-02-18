-- Migration: add_space_delete_policy
-- Description: Adds policy to prevent deletion of personal spaces

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Users can delete their own spaces" ON public."Space";

-- Create new policy that prevents deletion of personal spaces
CREATE POLICY "Users can delete their non-personal spaces"
    ON public."Space"
    FOR DELETE
    TO authenticated
    USING (
        owner_id = auth.uid()
        AND is_personal = false
    );
