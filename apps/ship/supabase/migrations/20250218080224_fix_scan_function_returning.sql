-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.create_scan_with_website_and_page;

-- Create function with proper RETURNING clauses
CREATE OR REPLACE FUNCTION public.create_scan_with_website_and_page(
  p_website_url TEXT,
  p_page_url TEXT,
  p_page_path TEXT,
  p_space_id UUID,
  p_user_id UUID
) RETURNS TABLE (
  id UUID,
  status TEXT,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  v_website_id UUID;
  v_page_id UUID;
  v_scan_id UUID;
  v_status TEXT;
  v_created_at TIMESTAMPTZ;
BEGIN
  -- Validate parameters
  IF p_website_url IS NULL OR p_page_url IS NULL OR p_page_path IS NULL OR p_space_id IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters';
  END IF;

  -- Get or create website (avoid race conditions)
  INSERT INTO public."Website" (url, space_id, user_id, theme)
  VALUES (p_website_url, p_space_id, p_user_id, 'BOTH')
  ON CONFLICT (url, space_id) DO NOTHING
  RETURNING id INTO v_website_id;

  IF v_website_id IS NULL THEN
    SELECT id INTO v_website_id
    FROM public."Website"
    WHERE url = p_website_url AND space_id = p_space_id;

    IF v_website_id IS NULL THEN
      RAISE EXCEPTION 'Failed to create or find website';
    END IF;
  END IF;

  -- Get or create page (avoid race conditions)
  INSERT INTO public."Page" (url, path, website_id)
  VALUES (p_page_url, p_page_path, v_website_id)
  ON CONFLICT (website_id, path) DO NOTHING
  RETURNING id INTO v_page_id;

  IF v_page_id IS NULL THEN
    SELECT id INTO v_page_id
    FROM public."Page"
    WHERE website_id = v_website_id AND path = p_page_path;

    IF v_page_id IS NULL THEN
      RAISE EXCEPTION 'Failed to create or find page';
    END IF;
  END IF;

  -- Create scan (always unique)
  INSERT INTO public."Scan" (page_id, status, metrics)
  VALUES (v_page_id, 'pending', '{}'::jsonb)
  RETURNING id, status, created_at
  INTO v_scan_id, v_status, v_created_at;

  IF v_scan_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create scan';
  END IF;

  -- Return the results
  RETURN QUERY
  SELECT v_scan_id, v_status, v_created_at;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create scan: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.create_scan_with_website_and_page(TEXT, TEXT, TEXT, UUID, UUID) TO authenticated, service_role;
