-- Enable necessary extensions
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

-- Create essential types
CREATE TYPE "public"."DomainTheme" AS ENUM ('LIGHT', 'DARK', 'BOTH');
ALTER TYPE "public"."DomainTheme" OWNER TO "postgres";

CREATE TYPE "public"."ScanStatus" AS ENUM ('pending', 'completed', 'failed', 'queued');
ALTER TYPE "public"."ScanStatus" OWNER TO "postgres";

-- Create tables
CREATE TABLE IF NOT EXISTS "public"."Space" (
    "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "url" text NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "deleted_at" timestamp with time zone,
    "is_personal" boolean NOT NULL DEFAULT false,
    CONSTRAINT "Space_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Space_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id")
);

CREATE TABLE IF NOT EXISTS "public"."Memberships" (
    "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "user_id" uuid NOT NULL,
    "space_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "deleted_at" timestamp with time zone,
    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "memberships_user_id_space_id_key" UNIQUE ("user_id", "space_id"),
    CONSTRAINT "memberships_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."Space"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."Website" (
    "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "url" text NOT NULL,
    "space_id" uuid NOT NULL,
    "user_id" uuid,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "theme" "public"."DomainTheme" NOT NULL DEFAULT 'LIGHT',
    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Domain_space_id_name_key" UNIQUE ("space_id", "url"),
    CONSTRAINT "Domain_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."Space"("id") ON DELETE CASCADE,
    CONSTRAINT "Website_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id")
);

-- Create indexes
CREATE INDEX "idx_memberships_space_id" ON "public"."Memberships" USING btree ("space_id");
CREATE INDEX "idx_memberships_user_id" ON "public"."Memberships" USING btree ("user_id");
CREATE INDEX "idx_domains_space_id" ON "public"."Website" USING btree ("space_id");

-- Enable RLS
ALTER TABLE "public"."Space" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Website" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Space
CREATE POLICY "Enable users to view their own data only"
    ON "public"."Space"
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING ((auth.uid() = user_id));

CREATE POLICY "Enable insert for authenticated users only"
    ON "public"."Space"
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Owners can update their own spaces"
    ON "public"."Space"
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING ((auth.uid() = user_id))
    WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Enable delete for users based on user_id"
    ON "public"."Space"
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = user_id));

-- RLS Policies for Memberships
CREATE POLICY "Users can view their own memberships"
    ON "public"."Memberships"
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING ((auth.uid() = user_id));

CREATE POLICY "Users can create memberships for their spaces"
    ON "public"."Memberships"
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "Users can update their own memberships"
    ON "public"."Memberships"
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING ((auth.uid() = user_id))
    WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can delete their own memberships"
    ON "public"."Memberships"
    AS PERMISSIVE
    FOR DELETE
    TO authenticated
    USING ((auth.uid() = user_id));

-- Utility Functions
CREATE OR REPLACE FUNCTION public.mask_ip_address(ip text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF ip IS NULL THEN
        RETURN NULL;
    END IF;
    IF ip ~ '^(\d{1,3}\.){3}\d{1,3}$' THEN
        RETURN regexp_replace(ip, '\d+$', 'XXX');
    END IF;
    IF ip ~ ':' THEN
        RETURN regexp_replace(ip, ':[^:]+$', ':XXXX');
    END IF;
    RETURN regexp_replace(ip, '[^.]+$', 'XXX');
END;
$$;

CREATE OR REPLACE FUNCTION public.parse_name(full_name text)
RETURNS TABLE(first_name text, last_name text)
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    IF full_name IS NULL OR full_name = '' THEN
        RETURN QUERY SELECT NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        trim(split_part(full_name, ' ', 1)),
        CASE
            WHEN position(' ' in full_name) > 0
            THEN trim(substring(full_name from position(' ' in full_name)))
            ELSE NULL
        END;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Create updated_at triggers
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON "public"."Space"
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON "public"."Memberships"
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON "public"."Website"
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Space permissions
GRANT ALL ON TABLE public."Space" TO anon, authenticated, service_role;

-- Memberships permissions
GRANT ALL ON TABLE public."Memberships" TO anon, authenticated, service_role;

-- Website permissions
GRANT ALL ON TABLE public."Website" TO anon, authenticated, service_role;
