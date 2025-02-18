-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.create_scan_with_website_and_page;

-- Create simplified function that just creates three entries
CREATE OR REPLACE FUNCTION public.create_scan_with_website_and_page(
  p_website_url TEXT,
  p_page_url TEXT,
  p_page_path TEXT,
  p_space_id UUID,
  p_user_id UUID
) RETURNS TABLE (
  scan_id UUID,
  scan_status public."ScanStatus",
  scan_created_at TIMESTAMPTZ
) AS $$
DECLARE
  v_website_id UUID;
  v_page_id UUID;
  v_scan_id UUID;
  v_status public."ScanStatus";
  v_created_at TIMESTAMPTZ;
BEGIN
  -- 1. Create website
  INSERT INTO public."Website" (url, space_id, user_id, theme)
  VALUES (p_website_url, p_space_id, p_user_id, 'BOTH')
  ON CONFLICT (url, space_id) DO UPDATE
  SET updated_at = NOW()
  RETURNING id INTO v_website_id;

  -- 2. Create page
  INSERT INTO public."Page" (url, path, website_id)
  VALUES (p_page_url, p_page_path, v_website_id)
  ON CONFLICT (website_id, path) DO UPDATE
  SET updated_at = NOW()
  RETURNING id INTO v_page_id;

  -- 3. Create scan
  INSERT INTO public."Scan" (page_id, status, metrics)
  VALUES (v_page_id, 'pending'::public."ScanStatus", '{}'::jsonb)
  RETURNING id, status, created_at
  INTO v_scan_id, v_status, v_created_at;

  -- Return the scan details
  RETURN QUERY
  SELECT v_scan_id, v_status, v_created_at;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.create_scan_with_website_and_page(TEXT, TEXT, TEXT, UUID, UUID) TO authenticated, service_role;
