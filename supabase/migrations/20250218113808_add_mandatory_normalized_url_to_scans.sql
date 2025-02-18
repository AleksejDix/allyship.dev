-- First ensure all existing scans have a normalized_url by copying from their pages
UPDATE "public"."Scan" s
SET normalized_url = p.normalized_url
FROM "public"."Page" p
WHERE s.page_id = p.id
  AND (s.normalized_url IS NULL OR s.normalized_url = '');

-- Make normalized_url mandatory and add constraints
ALTER TABLE "public"."Scan"
ALTER COLUMN normalized_url SET NOT NULL,
ALTER COLUMN normalized_url SET DEFAULT '',
ADD CONSTRAINT scan_normalized_url_check CHECK (normalized_url <> '');

-- Add index for performance
CREATE INDEX IF NOT EXISTS scan_normalized_url_idx ON "public"."Scan" (normalized_url);

-- Add trigger to automatically set normalized_url from page
CREATE OR REPLACE FUNCTION public.set_scan_normalized_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the normalized_url from the associated page
  SELECT normalized_url INTO NEW.normalized_url
  FROM "public"."Page"
  WHERE id = NEW.page_id;

  -- If no page found or no normalized_url, raise an error
  IF NEW.normalized_url IS NULL OR NEW.normalized_url = '' THEN
    RAISE EXCEPTION 'Cannot create scan: associated page must have a normalized_url';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run before insert
CREATE TRIGGER set_scan_normalized_url_trigger
  BEFORE INSERT ON "public"."Scan"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_scan_normalized_url();
