-- Add url column to Scan table
ALTER TABLE "public"."Scan"
ADD COLUMN url text NOT NULL DEFAULT '';

-- Update existing scans to copy the page URL
UPDATE "public"."Scan" s
SET url = p.url
FROM "public"."Page" p
WHERE s.page_id = p.id
  AND (s.url IS NULL OR s.url = '');

-- Add constraint to ensure URL is not empty
ALTER TABLE "public"."Scan"
ADD CONSTRAINT scan_url_check CHECK (url <> '');

-- Update the trigger to handle both url and normalized_url
CREATE OR REPLACE FUNCTION public.set_scan_normalized_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Get both URL and normalized_url from the associated page
  SELECT url, normalized_url
  INTO NEW.url, NEW.normalized_url
  FROM "public"."Page"
  WHERE id = NEW.page_id;

  -- If no page found or no URLs, raise an error
  IF NEW.url IS NULL OR NEW.url = '' OR NEW.normalized_url IS NULL OR NEW.normalized_url = '' THEN
    RAISE EXCEPTION 'Cannot create scan: associated page must have valid URLs';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
