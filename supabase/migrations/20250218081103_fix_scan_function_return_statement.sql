-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.create_scan_with_website_and_page;

-- Create function with fixed RETURN statement
CREATE OR REPLACE FUNCTION public.create_scan_with_website_and_page(
  p_website_url TEXT,
  p_page_url TEXT,
  p_page_path TEXT,
  p_space_id UUID,
  p_user_id UUID
) RETURNS TABLE (
  scan_id UUID,
  scan_status TEXT,
  scan_created_at TIMESTAMPTZ
) AS $$
DECLARE
  v_website_id UUID;
  v_page_id UUID;
  v_scan_id UUID;
  v_status TEXT;
  v_created_at TIMESTAMPTZ;
  v_debug_info JSONB;
BEGIN
  -- Validate parameters
  IF p_website_url IS NULL OR p_page_url IS NULL OR p_page_path IS NULL OR p_space_id IS NULL OR p_user_id IS NULL THEN
    v_debug_info = jsonb_build_object(
      'website_url', p_website_url,
      'page_url', p_page_url,
      'page_path', p_page_path,
      'space_id', p_space_id,
      'user_id', p_user_id
    );
    RAISE EXCEPTION 'Missing required parameters: %', v_debug_info;
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
      v_debug_info = jsonb_build_object(
        'website_url', p_website_url,
        'space_id', p_space_id,
        'user_id', p_user_id
      );
      RAISE EXCEPTION 'Failed to create or find website: %', v_debug_info;
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
      v_debug_info = jsonb_build_object(
        'website_id', v_website_id,
        'page_url', p_page_url,
        'page_path', p_page_path
      );
      RAISE EXCEPTION 'Failed to create or find page: %', v_debug_info;
    END IF;
  END IF;

  -- Create scan (always unique)
  INSERT INTO public."Scan" (page_id, status, metrics)
  VALUES (v_page_id, 'pending', '{}'::jsonb)
  RETURNING id, status, created_at
  INTO v_scan_id, v_status, v_created_at;

  IF v_scan_id IS NULL THEN
    v_debug_info = jsonb_build_object(
      'page_id', v_page_id,
      'website_id', v_website_id
    );
    RAISE EXCEPTION 'Failed to create scan: %', v_debug_info;
  END IF;

  -- Log successful creation
  RAISE NOTICE 'Scan created successfully: %', jsonb_build_object(
    'scan_id', v_scan_id,
    'page_id', v_page_id,
    'website_id', v_website_id
  );

  -- Return the results using RETURN QUERY instead of RETURN NEXT
  RETURN QUERY
  VALUES (v_scan_id, v_status, v_created_at);

EXCEPTION
  WHEN OTHERS THEN
    -- Include context in error message
    v_debug_info = jsonb_build_object(
      'website_url', p_website_url,
      'page_url', p_page_url,
      'page_path', p_page_path,
      'space_id', p_space_id,
      'user_id', p_user_id,
      'website_id', v_website_id,
      'page_id', v_page_id,
      'scan_id', v_scan_id,
      'error', SQLERRM
    );
    RAISE EXCEPTION 'Failed to create scan with debug info: %', v_debug_info;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.create_scan_with_website_and_page(TEXT, TEXT, TEXT, UUID, UUID) TO authenticated, service_role;
