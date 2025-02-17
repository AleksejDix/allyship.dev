-- Create DomainTheme enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "DomainTheme" AS ENUM ('LIGHT', 'DARK', 'BOTH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Domain table
CREATE TABLE IF NOT EXISTS "Domain" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "space_id" UUID NOT NULL REFERENCES "Space"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "theme" "DomainTheme" DEFAULT 'LIGHT' NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "created_by" UUID REFERENCES "auth"."users"("id"),
    "updated_by" UUID REFERENCES "auth"."users"("id"),

    -- Add constraints
    CONSTRAINT "domain_name_space_unique" UNIQUE ("space_id", "name")
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "domain_space_id_idx" ON "Domain"("space_id");
CREATE INDEX IF NOT EXISTS "domain_name_idx" ON "Domain"("name");

-- Add RLS (Row Level Security) policies
ALTER TABLE "Domain" ENABLE ROW LEVEL SECURITY;

-- Policy for viewing domains
CREATE POLICY "Users can view domains in their spaces" ON "Domain"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "memberships"
            WHERE "memberships"."space_id" = "Domain"."space_id"
            AND "memberships"."user_id" = auth.uid()
            AND "memberships"."deleted_at" IS NULL
        )
    );

-- Policy for inserting domains
CREATE POLICY "Space admins can create domains" ON "Domain"
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "memberships"
            WHERE "memberships"."space_id" = "Domain"."space_id"
            AND "memberships"."user_id" = auth.uid()
            AND "memberships"."deleted_at" IS NULL
            -- Add role check when implemented
        )
    );

-- Policy for updating domains
CREATE POLICY "Space admins can update domains" ON "Domain"
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM "memberships"
            WHERE "memberships"."space_id" = "Domain"."space_id"
            AND "memberships"."user_id" = auth.uid()
            AND "memberships"."deleted_at" IS NULL
            -- Add role check when implemented
        )
    );

-- Policy for deleting domains
CREATE POLICY "Space admins can delete domains" ON "Domain"
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM "memberships"
            WHERE "memberships"."space_id" = "Domain"."space_id"
            AND "memberships"."user_id" = auth.uid()
            AND "memberships"."deleted_at" IS NULL
            -- Add role check when implemented
        )
    );

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_domain_updated_at
    BEFORE UPDATE ON "Domain"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to set created_by and updated_by
CREATE OR REPLACE FUNCTION set_user_id_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created_by = auth.uid();
        NEW.updated_by = auth.uid();
    ELSIF (TG_OP = 'UPDATE') THEN
        NEW.updated_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_domain_user_fields
    BEFORE INSERT OR UPDATE ON "Domain"
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id_fields();

-- Add comment for documentation
COMMENT ON TABLE "Domain" IS 'Stores domains/websites associated with spaces';
