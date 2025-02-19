-- Add path column to Page table
ALTER TABLE "public"."Page" ADD COLUMN IF NOT EXISTS "path" TEXT;

-- Update existing pages to set path from URL
UPDATE "public"."Page"
SET path = regexp_replace(
  regexp_replace(url, '^https?://[^/]+', ''), -- Remove protocol and domain
  '/$', '' -- Remove trailing slash
)
WHERE path IS NULL;

-- Make path column required
ALTER TABLE "public"."Page" ALTER COLUMN "path" SET NOT NULL;
