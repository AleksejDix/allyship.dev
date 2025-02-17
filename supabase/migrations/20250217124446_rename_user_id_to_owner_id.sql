-- Drop existing policies that reference user_id
DROP POLICY IF EXISTS "Enable users to view their own data only" ON "public"."Space";
DROP POLICY IF EXISTS "Owners can update their own spaces" ON "public"."Space";
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."Space";

-- Rename user_id to owner_id
ALTER TABLE "public"."Space"
RENAME COLUMN user_id TO owner_id;

-- Update foreign key constraint
ALTER TABLE "public"."Space"
DROP CONSTRAINT IF EXISTS "Space_user_id_fkey",
ADD CONSTRAINT "Space_owner_id_fkey"
    FOREIGN KEY (owner_id)
    REFERENCES auth.users(id);

-- Recreate policies with owner_id
CREATE POLICY "Enable users to view their own data only"
    ON "public"."Space"
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING ((auth.uid() = owner_id));

CREATE POLICY "Owners can update their own spaces"
    ON "public"."Space"
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING ((auth.uid() = owner_id))
    WITH CHECK ((auth.uid() = owner_id));

CREATE POLICY "Enable delete for users based on owner_id"
    ON "public"."Space"
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = owner_id));
