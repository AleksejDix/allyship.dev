-- ============================================================================
-- Migration: Clean up Space→Account Migration Artifacts
-- ============================================================================
-- Description: Removes temporary tables, views, and functions that were used
--              during the Space→Account migration. The migration is now
--              complete with all websites using account_id.
--
-- Verified before cleanup:
-- - All 101 websites have account_id populated
-- - Application code uses account_id exclusively
-- - No code references space_account_map
-- - No views or functions depend on these artifacts
-- ============================================================================

-- Drop the helper view (unused in application)
DROP VIEW IF EXISTS public.website_accounts CASCADE;

-- Drop the helper function (only used during migration)
DROP FUNCTION IF EXISTS public.generate_unique_account_slug(TEXT, UUID);

-- Drop the temporary mapping table
DROP TABLE IF EXISTS public.space_account_map CASCADE;

-- Log cleanup completion
DO $$
BEGIN
  RAISE NOTICE '
  ====================================================================
  CLEANUP COMPLETED
  ====================================================================
  Removed migration artifacts:
  - public.space_account_map table
  - public.website_accounts view
  - public.generate_unique_account_slug function

  Migration from Space to Basejump Accounts is now complete.
  ====================================================================
  ';
END $$;
