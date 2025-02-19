-- Remove any existing normalization functions
DROP FUNCTION IF EXISTS normalize_url CASCADE;
DROP FUNCTION IF EXISTS normalize_path CASCADE;

-- Ensure normalized_url column exists in all relevant tables
DO $$
DECLARE column_exists BOOLEAN;
BEGIN
    -- Add normalized_url to Website if missing
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'Website'
        AND column_name = 'normalized_url'
    ) INTO column_exists;
    IF NOT column_exists THEN
        ALTER TABLE "public"."Website"
        ADD COLUMN normalized_url text NOT NULL DEFAULT '';
    END IF;

    -- Add normalized_url to Page if missing
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'Page'
        AND column_name = 'normalized_url'
    ) INTO column_exists;
    IF NOT column_exists THEN
        ALTER TABLE "public"."Page"
        ADD COLUMN normalized_url text NOT NULL DEFAULT '';
    END IF;

    -- Add normalized_url to Scan if missing
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'Scan'
        AND column_name = 'normalized_url'
    ) INTO column_exists;
    IF NOT column_exists THEN
        ALTER TABLE "public"."Scan"
        ADD COLUMN normalized_url text NOT NULL DEFAULT '';
    END IF;
END $$;

-- Drop existing constraints if they exist
ALTER TABLE "public"."Website"
DROP CONSTRAINT IF EXISTS website_normalized_url_space_unique;

ALTER TABLE "public"."Page"
DROP CONSTRAINT IF EXISTS page_normalized_url_website_unique;

-- Recreate constraints
ALTER TABLE "public"."Website"
ADD CONSTRAINT website_normalized_url_space_unique UNIQUE (normalized_url, space_id);

ALTER TABLE "public"."Page"
ADD CONSTRAINT page_normalized_url_website_unique UNIQUE (website_id, normalized_url);

-- Drop existing indexes safely
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'website_normalized_url_space_idx') THEN
        DROP INDEX IF EXISTS "public".website_normalized_url_space_idx;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'page_normalized_url_idx') THEN
        DROP INDEX IF EXISTS "public".page_normalized_url_idx;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'scan_normalized_url_idx') THEN
        DROP INDEX IF EXISTS "public".scan_normalized_url_idx;
    END IF;
END $$;

-- Create optimized indexes
CREATE INDEX website_normalized_url_space_idx ON "public"."Website" (normalized_url, space_id);
CREATE INDEX page_normalized_url_idx ON "public"."Page" (normalized_url);
CREATE INDEX scan_normalized_url_idx ON "public"."Scan" (normalized_url);
