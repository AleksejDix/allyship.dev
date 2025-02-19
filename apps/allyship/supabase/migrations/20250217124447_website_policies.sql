-- Ensure index exists for better performance
CREATE INDEX IF NOT EXISTS idx_space_owner_id ON "public"."Space" ("owner_id");

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."Website";
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."Website";
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON "public"."Website";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."Website";

-- Create optimized RLS Policies for Website table
CREATE POLICY "Space owners can view websites"
    ON "public"."Website"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Space"
            WHERE "Space".id = "Website".space_id
            AND "Space".owner_id = auth.uid()
        )
    );

CREATE POLICY "Space owners can create websites"
    ON "public"."Website"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "public"."Space"
            WHERE "Space".id = "Website".space_id
            AND "Space".owner_id = auth.uid()
        )
    );

CREATE POLICY "Space owners can update websites"
    ON "public"."Website"
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Space"
            WHERE "Space".id = "Website".space_id
            AND "Space".owner_id = auth.uid()
        )
    );

CREATE POLICY "Space owners can delete websites"
    ON "public"."Website"
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."Space"
            WHERE "Space".id = "Website".space_id
            AND "Space".owner_id = auth.uid()
        )
    );
