-- Add normalized URL columns to Website and Page tables
ALTER TABLE "public"."Website"
ADD COLUMN normalized_url text NOT NULL DEFAULT '';

ALTER TABLE "public"."Page"
ADD COLUMN normalized_url text NOT NULL DEFAULT '';

-- Add unique constraints to prevent duplicate normalized URLs within the same space
ALTER TABLE "public"."Website"
ADD CONSTRAINT website_normalized_url_space_unique UNIQUE (normalized_url, space_id);

ALTER TABLE "public"."Page"
ADD CONSTRAINT page_normalized_url_website_unique UNIQUE (website_id, normalized_url);

-- Add indexes for performance
CREATE INDEX website_normalized_url_space_idx ON "public"."Website" (normalized_url, space_id);
CREATE INDEX page_normalized_url_idx ON "public"."Page" (normalized_url);
