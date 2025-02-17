-- Drop existing objects first
DROP TABLE IF EXISTS "public"."user_notifications" CASCADE;
DROP TABLE IF EXISTS "public"."user_audit_logs" CASCADE;
DROP TABLE IF EXISTS "public"."Page" CASCADE;
DROP TABLE IF EXISTS "public"."Scan" CASCADE;
DROP TABLE IF EXISTS "public"."Domain" CASCADE;
DROP TABLE IF EXISTS "public"."Membership" CASCADE;
DROP TABLE IF EXISTS "public"."Space" CASCADE;
DROP TABLE IF EXISTS "public"."User" CASCADE;
DROP VIEW IF EXISTS "public"."UserSpaceView" CASCADE;

DROP TYPE IF EXISTS "public"."DomainTheme" CASCADE;
DROP TYPE IF EXISTS "public"."MembershipRole" CASCADE;
DROP TYPE IF EXISTS "public"."MembershipStatus" CASCADE;
DROP TYPE IF EXISTS "public"."ScanStatus" CASCADE;
DROP TYPE IF EXISTS "public"."SubStatus" CASCADE;

-- Essential extensions only
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

-- Set up schema
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER SCHEMA "public" OWNER TO "postgres";

-- Create essential types
CREATE TYPE "public"."DomainTheme" AS ENUM ('LIGHT', 'DARK', 'BOTH');
ALTER TYPE "public"."DomainTheme" OWNER TO "postgres";

CREATE TYPE "public"."ScanStatus" AS ENUM ('pending', 'completed', 'failed', 'queued');
ALTER TYPE "public"."ScanStatus" OWNER TO "postgres";

-- Create tables
CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" uuid NOT NULL,
    "full_name" text,
    "email" text NOT NULL,
    "status" text DEFAULT 'active'::text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    "data_retention_period" interval DEFAULT '6 mons'::interval NOT NULL,
    "deletion_requested_at" timestamp with time zone,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "status_check" CHECK (("status" = ANY (ARRAY['active'::text, 'disabled'::text, 'deleted'::text])))
);

CREATE TABLE IF NOT EXISTS "public"."Space" (
    "id" uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "name" text NOT NULL,
    "created_by" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_personal" boolean DEFAULT false NOT NULL,
    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."memberships" (
    "id" uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL,
    "space_id" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "memberships_user_id_space_id_key" UNIQUE ("user_id", "space_id"),
    CONSTRAINT "memberships_space_id_fkey" FOREIGN KEY (space_id) REFERENCES "public"."Space"(id) ON DELETE CASCADE,
    CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "public"."User"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."Domain" (
    "id" uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "name" text NOT NULL,
    "space_id" uuid NOT NULL,
    "created_by" uuid,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_by" uuid,
    "theme" "public"."DomainTheme" DEFAULT 'LIGHT'::"public"."DomainTheme" NOT NULL,
    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Domain_space_id_name_key" UNIQUE ("space_id", "name"),
    CONSTRAINT "Domain_space_id_fkey" FOREIGN KEY (space_id) REFERENCES "public"."Space"(id) ON DELETE CASCADE,
    CONSTRAINT "Domain_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "auth"."users"(id) ON DELETE SET NULL,
    CONSTRAINT "Domain_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES "auth"."users"(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "public"."User" ("email");
CREATE INDEX IF NOT EXISTS "idx_spaces_created_by" ON "public"."Space" ("created_by");
CREATE INDEX IF NOT EXISTS "idx_domains_space_id" ON "public"."Domain" ("space_id");
CREATE INDEX IF NOT EXISTS "idx_memberships_user_id" ON "public"."memberships" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_memberships_space_id" ON "public"."memberships" ("space_id");

-- Create simplified view
CREATE OR REPLACE VIEW "public"."UserSpaceView" AS
SELECT
    s.*,
    m.user_id,
    u.email as user_email,
    u.full_name as user_full_name
FROM "public"."Space" s
JOIN "public"."memberships" m ON s.id = m.space_id
JOIN "public"."User" u ON m.user_id = u.id
WHERE m.deleted_at IS NULL;

-- Enable RLS
ALTER TABLE "public"."memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Space" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Domain" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own memberships"
    ON "public"."memberships"
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create memberships for their spaces"
    ON "public"."memberships"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "public"."Space"
            WHERE id = space_id
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update their own memberships"
    ON "public"."memberships"
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memberships"
    ON "public"."memberships"
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."User" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."Space" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."memberships" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."Domain" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."UserSpaceView" TO "anon", "authenticated", "service_role";
