-- ============================================================================
-- Migration: Spaces to Basejump Accounts
-- ============================================================================
-- Description: Migrates existing Space table data to basejump.accounts
--              while maintaining backward compatibility.
--
-- Safety features:
-- - Idempotent (can be run multiple times safely)
-- - Uses explicit mapping table for traceability
-- - Soft FK constraint (SET NULL) during transition period
-- - Pre and post data quality checks
-- - Re-runnable without creating duplicates
-- ============================================================================

-- Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- STEP 1: Create mapping table for space_id → account_id
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.space_account_map (
  space_id uuid PRIMARY KEY REFERENCES public."Space"(id) ON DELETE CASCADE,
  account_id uuid UNIQUE NOT NULL,
  migrated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.space_account_map IS
  'Mapping table tracking which Space was migrated to which basejump account. Used during transition period.';

-- ============================================================================
-- STEP 2: Create helper function for unique slug generation
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_unique_account_slug(base_name TEXT, space_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges to query basejump.accounts
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug from name (lowercase, replace non-alphanumeric with hyphens)
  base_slug := lower(regexp_replace(base_name, '[^a-zA-Z0-9]+', '-', 'g'));

  -- Clean up multiple consecutive hyphens
  base_slug := regexp_replace(base_slug, '-{2,}', '-', 'g');

  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);

  -- If slug is empty or null, use a default based on space_id
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'space-' || substring(space_id::text from 1 for 8);
  END IF;

  -- Try the base slug first
  final_slug := base_slug;

  -- If slug already exists, append numbers starting from -1
  WHILE EXISTS (SELECT 1 FROM basejump.accounts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$;

-- ============================================================================
-- STEP 3: Pre-migration data quality checks
-- ============================================================================
DO $$
DECLARE
  spaces_count INTEGER;
  active_spaces_count INTEGER;
  websites_without_space INTEGER;
  orphaned_websites INTEGER;
BEGIN
  SELECT COUNT(*) INTO spaces_count FROM public."Space";
  SELECT COUNT(*) INTO active_spaces_count FROM public."Space" WHERE deleted_at IS NULL;
  SELECT COUNT(*) INTO websites_without_space FROM public."Website" WHERE space_id IS NULL;

  SELECT COUNT(*) INTO orphaned_websites
  FROM public."Website" w
  WHERE NOT EXISTS (SELECT 1 FROM public."Space" s WHERE s.id = w.space_id);

  RAISE NOTICE '
  ====================================================================
  PRE-MIGRATION DATA QUALITY CHECK
  ====================================================================
  Total Spaces:                  %
  Active Spaces (not deleted):   %
  Websites without space_id:     %
  Orphaned Websites:             %
  ====================================================================
  ', spaces_count, active_spaces_count, websites_without_space, orphaned_websites;

  IF orphaned_websites > 0 THEN
    RAISE WARNING 'Found % orphaned websites. These will NOT be migrated.', orphaned_websites;
  END IF;
END $$;

-- ============================================================================
-- STEP 4: Add account_id column to Website table (before migration)
-- ============================================================================
ALTER TABLE public."Website"
  ADD COLUMN IF NOT EXISTS account_id UUID;

-- Add foreign key with SET NULL (safe during transition)
-- This can be changed to CASCADE later once app is fully migrated
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_website_account_id'
      AND table_schema = 'public'
      AND table_name = 'Website'
  ) THEN
    ALTER TABLE public."Website"
      ADD CONSTRAINT fk_website_account_id
      FOREIGN KEY (account_id)
      REFERENCES basejump.accounts(id)
      ON DELETE SET NULL; -- Safe during transition; change to CASCADE later
  END IF;
END $$;

-- ============================================================================
-- STEP 5: Migrate Spaces to Basejump Accounts (IDEMPOTENT)
-- ============================================================================
DO $$
DECLARE
  space_record RECORD;
  new_slug TEXT;
  new_account_id UUID;
  existing_account_id UUID;
  migrated_count INTEGER := 0;
  skipped_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting Space → Account migration...';

  -- Iterate through all non-deleted spaces
  FOR space_record IN
    SELECT
      id,
      name,
      owner_id,
      created_at,
      updated_at,
      is_personal
    FROM public."Space"
    WHERE deleted_at IS NULL
    ORDER BY created_at ASC -- Process oldest first
  LOOP
    -- Check if this space was already migrated
    SELECT account_id INTO existing_account_id
    FROM public.space_account_map
    WHERE space_id = space_record.id;

    IF existing_account_id IS NOT NULL THEN
      -- Already migrated, skip
      skipped_count := skipped_count + 1;
      RAISE NOTICE '[SKIP] Space % (%) already migrated to account %',
        space_record.name,
        space_record.id,
        existing_account_id;
      CONTINUE;
    END IF;

    -- Generate unique slug (only for team accounts)
    -- Personal accounts must have NULL slug per basejump constraint
    IF space_record.is_personal THEN
      new_slug := NULL;
    ELSE
      new_slug := public.generate_unique_account_slug(space_record.name, space_record.id);
    END IF;

    -- Insert into basejump.accounts
    -- Explicitly set all fields to bypass auth.uid() default
    INSERT INTO basejump.accounts (
      id,
      primary_owner_user_id,
      name,
      slug,
      personal_account,
      created_at,
      updated_at,
      created_by,
      updated_by,
      private_metadata,
      public_metadata
    ) VALUES (
      gen_random_uuid(),
      space_record.owner_id,
      space_record.name,
      new_slug, -- NULL for personal accounts, unique slug for team accounts
      space_record.is_personal,
      space_record.created_at,
      space_record.updated_at,
      space_record.owner_id,
      space_record.owner_id,
      jsonb_build_object(
        'migrated_from_space_id', space_record.id::text,
        'migration_date', now(),
        'migration_version', '1.0'
      ),
      '{}'::jsonb
    )
    RETURNING id INTO new_account_id;

    -- Manually add owner to account_user (basejump trigger might not fire in DO block)
    INSERT INTO basejump.account_user (account_id, user_id, account_role)
    VALUES (new_account_id, space_record.owner_id, 'owner'::basejump.account_role)
    ON CONFLICT (user_id, account_id) DO NOTHING; -- In case trigger already added it

    -- Record mapping
    INSERT INTO public.space_account_map (space_id, account_id)
    VALUES (space_record.id, new_account_id);

    migrated_count := migrated_count + 1;

    RAISE NOTICE '[MIGRATED] Space "%" (%) → Account % (slug: %)',
      space_record.name,
      space_record.id,
      new_account_id,
      new_slug;
  END LOOP;

  RAISE NOTICE '
  Migration complete:
  - Migrated:  % spaces
  - Skipped:   % spaces (already migrated)
  ', migrated_count, skipped_count;
END $$;

-- ============================================================================
-- STEP 6: Populate Website.account_id based on mapping
-- ============================================================================
UPDATE public."Website" w
SET account_id = m.account_id
FROM public.space_account_map m
WHERE w.space_id = m.space_id
  AND w.account_id IS NULL; -- Only update if not already set

-- ============================================================================
-- STEP 7: Add indexes for performance
-- ============================================================================
-- Index on Website.account_id for FK lookups
CREATE INDEX IF NOT EXISTS idx_website_account_id
  ON public."Website"(account_id)
  WHERE account_id IS NOT NULL;

-- Expression index for reverse lookup (account → space)
CREATE INDEX IF NOT EXISTS idx_accounts_migrated_from_space_id
  ON basejump.accounts ((private_metadata->>'migrated_from_space_id'))
  WHERE private_metadata ? 'migrated_from_space_id';

-- Index on mapping table
CREATE INDEX IF NOT EXISTS idx_space_account_map_account_id
  ON public.space_account_map(account_id);

-- ============================================================================
-- STEP 8: Create helper view for transition period
-- ============================================================================
CREATE OR REPLACE VIEW public.website_accounts AS
SELECT
  w.id,
  w.url,
  w.normalized_url,
  w.theme,
  w.created_at,
  w.updated_at,
  -- Account info
  w.account_id,
  a.name as account_name,
  a.slug as account_slug,
  a.personal_account,
  a.primary_owner_user_id as account_owner_id,
  -- Legacy space info
  w.space_id,
  s.name as space_name,
  s.owner_id as space_owner_id,
  s.is_personal as space_is_personal
FROM public."Website" w
LEFT JOIN basejump.accounts a ON a.id = w.account_id
LEFT JOIN public."Space" s ON s.id = w.space_id;

COMMENT ON VIEW public.website_accounts IS
  'Helper view showing websites with both account and space information during migration transition period.
   Use this for debugging and verifying migration correctness.';

-- Grant read access to authenticated users
GRANT SELECT ON public.website_accounts TO authenticated;

-- ============================================================================
-- STEP 9: Post-migration data quality checks
-- ============================================================================
DO $$
DECLARE
  total_accounts INTEGER;
  personal_accounts INTEGER;
  team_accounts INTEGER;
  total_websites INTEGER;
  mapped_websites INTEGER;
  unmapped_websites INTEGER;
  duplicate_mappings INTEGER;
  accounts_without_owner INTEGER;
BEGIN
  -- Count accounts
  SELECT COUNT(*) INTO total_accounts
  FROM basejump.accounts
  WHERE private_metadata ? 'migrated_from_space_id';

  SELECT COUNT(*) INTO personal_accounts
  FROM basejump.accounts
  WHERE private_metadata ? 'migrated_from_space_id'
    AND personal_account = true;

  SELECT COUNT(*) INTO team_accounts
  FROM basejump.accounts
  WHERE private_metadata ? 'migrated_from_space_id'
    AND personal_account = false;

  -- Count websites
  SELECT COUNT(*) INTO total_websites FROM public."Website";
  SELECT COUNT(*) INTO mapped_websites FROM public."Website" WHERE account_id IS NOT NULL;
  unmapped_websites := total_websites - mapped_websites;

  -- Check for duplicate mappings (should be 0)
  SELECT COUNT(*) INTO duplicate_mappings
  FROM (
    SELECT private_metadata->>'migrated_from_space_id', COUNT(*)
    FROM basejump.accounts
    WHERE private_metadata ? 'migrated_from_space_id'
    GROUP BY 1
    HAVING COUNT(*) > 1
  ) duplicates;

  -- Check for accounts without owner in account_user
  SELECT COUNT(*) INTO accounts_without_owner
  FROM basejump.accounts a
  WHERE private_metadata ? 'migrated_from_space_id'
    AND NOT EXISTS (
      SELECT 1 FROM basejump.account_user au
      WHERE au.account_id = a.id
        AND au.user_id = a.primary_owner_user_id
        AND au.account_role = 'owner'::basejump.account_role
    );

  RAISE NOTICE '
  ====================================================================
  POST-MIGRATION DATA QUALITY CHECK
  ====================================================================
  ACCOUNTS CREATED:
    Total:                       %
    Personal:                    %
    Team:                        %

  WEBSITES:
    Total:                       %
    Mapped to accounts:          %
    Unmapped (orphaned):         %

  DATA INTEGRITY:
    Duplicate mappings:          %  %
    Accounts without owner:      %  %
  ====================================================================
  ',
  total_accounts,
  personal_accounts,
  team_accounts,
  total_websites,
  mapped_websites,
  unmapped_websites,
  duplicate_mappings, CASE WHEN duplicate_mappings > 0 THEN '❌ ERROR' ELSE '✓' END,
  accounts_without_owner, CASE WHEN accounts_without_owner > 0 THEN '❌ ERROR' ELSE '✓' END;

  -- Raise errors if data integrity issues found
  IF duplicate_mappings > 0 THEN
    RAISE EXCEPTION 'MIGRATION ERROR: Found % duplicate space→account mappings', duplicate_mappings;
  END IF;

  IF accounts_without_owner > 0 THEN
    RAISE EXCEPTION 'MIGRATION ERROR: Found % accounts without owner in account_user', accounts_without_owner;
  END IF;

  IF unmapped_websites > 0 THEN
    RAISE WARNING 'Warning: % websites are not mapped to accounts (likely orphaned data)', unmapped_websites;
  END IF;
END $$;

-- ============================================================================
-- STEP 10: Add helpful comments for future reference
-- ============================================================================
COMMENT ON COLUMN public."Website".account_id IS
  'References basejump account (organization). Maps to legacy space_id via space_account_map table during transition.';

COMMENT ON COLUMN public."Website".space_id IS
  'DEPRECATED: Legacy reference to Space table. Use account_id instead. Kept for backward compatibility during migration.';

-- ============================================================================
-- STEP 11: Print migration summary and next steps
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '
  ====================================================================
  MIGRATION COMPLETED SUCCESSFULLY
  ====================================================================

  NEXT STEPS:

  1. Update application code to use account_id instead of space_id

  2. Add new RLS policies for Website table using account_id:
     - Allow account members to view/edit websites in their accounts
     - Currently still using Space-based policies

  3. Once app is fully migrated and tested:
     - Change FK constraint from SET NULL to CASCADE
     - Remove space_id column from Website table
     - Deprecate Space table
     - Drop space_account_map table

  4. Monitor for any issues in application logs

  ====================================================================
  ';
END $$;

-- ============================================================================
-- Optional: Clean up helper function (uncomment to remove after migration)
-- ============================================================================
-- DROP FUNCTION IF EXISTS public.generate_unique_account_slug(TEXT, UUID);
