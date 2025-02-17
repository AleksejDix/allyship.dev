-- Drop the view that might depend on created_by
DROP VIEW IF EXISTS "public"."UserSpaceView";

-- Drop existing policies that reference created_by
DROP POLICY IF EXISTS "Users can create memberships for their spaces" ON "public"."memberships";
DROP POLICY IF EXISTS "Users can create spaces" ON "public"."Space";
DROP POLICY IF EXISTS "Space owners can update their spaces" ON "public"."Space";
DROP POLICY IF EXISTS "Space owners can delete their spaces" ON "public"."Space";

-- Drop the index on created_by
DROP INDEX IF EXISTS "idx_spaces_created_by";

-- Remove created_by column
ALTER TABLE "public"."Space" DROP COLUMN IF EXISTS "created_by";

-- Recreate the view without created_by
CREATE OR REPLACE VIEW "public"."UserSpaceView" AS
SELECT
    s.id,
    s.name,
    s.created_at,
    s.updated_at,
    s.deleted_at,
    s.is_personal,
    m.user_id,
    u.email as user_email,
    u.full_name as user_full_name
FROM "public"."Space" s
JOIN "public"."memberships" m ON s.id = m.space_id
JOIN "public"."User" u ON m.user_id = u.id
WHERE m.deleted_at IS NULL;

-- Create new policies that use memberships instead
CREATE POLICY "Users can create memberships for their spaces"
    ON "public"."memberships"
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can create spaces"
    ON "public"."Space"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Space members can update their spaces"
    ON "public"."Space"
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."memberships"
            WHERE space_id = id
            AND user_id = auth.uid()
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "public"."memberships"
            WHERE space_id = id
            AND user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

CREATE POLICY "Space members can delete their spaces"
    ON "public"."Space"
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."memberships"
            WHERE space_id = id
            AND user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );
