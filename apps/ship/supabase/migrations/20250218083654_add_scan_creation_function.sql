-- Add unique indexes for website and page lookups
CREATE UNIQUE INDEX IF NOT EXISTS "idx_website_url_space" ON "public"."Website" ("url", "space_id");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_page_website_path" ON "public"."Page" ("website_id", "path");

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.create_scan_with_website_and_page;

-- Create function to handle scan creation with website and page
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
  -- Start transaction
  BEGIN
    -- Get or create website (avoid race conditions)
    INSERT INTO public.website (url, space_id, user_id, theme)
    VALUES (p_website_url, p_space_id, p_user_id, 'BOTH')
    ON CONFLICT (url, space_id) DO NOTHING
    RETURNING id INTO v_website_id;

    IF v_website_id IS NULL THEN
      SELECT id INTO v_website_id
      FROM public.website
      WHERE url = p_website_url AND space_id = p_space_id;

      IF v_website_id IS NULL THEN
        RAISE EXCEPTION 'Failed to create or find website';
      END IF;
    END IF;

    -- Get or create page (avoid race conditions)
    INSERT INTO public.page (url, path, website_id)
    VALUES (p_page_url, p_page_path, v_website_id)
    ON CONFLICT (website_id, path) DO NOTHING
    RETURNING id INTO v_page_id;

    IF v_page_id IS NULL THEN
      SELECT id INTO v_page_id
      FROM public.page
      WHERE website_id = v_website_id AND path = p_page_path;

      IF v_page_id IS NULL THEN
        RAISE EXCEPTION 'Failed to create or find page';
      END IF;
    END IF;

    -- Create scan (always unique)
    INSERT INTO public.scan (page_id, status, metrics)
    VALUES (v_page_id, 'pending', '{}')
    RETURNING id, status, created_at
    INTO v_scan_id, v_status, v_created_at;

    IF v_scan_id IS NULL THEN
      RAISE EXCEPTION 'Failed to create scan';
    END IF;

    -- Return the results
    RETURN QUERY
    SELECT v_scan_id, v_status, v_created_at;

    -- Commit transaction
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback on any error
      ROLLBACK;
      RAISE EXCEPTION 'Failed to create scan: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.create_scan_with_website_and_page TO authenticated, service_role;
