-- Drop all versions of the function if they exist
DROP FUNCTION IF EXISTS public.create_scan_with_website_and_page(TEXT, TEXT, TEXT, UUID, UUID);
DROP FUNCTION IF EXISTS public.create_scan_with_website_and_page(JSONB);
