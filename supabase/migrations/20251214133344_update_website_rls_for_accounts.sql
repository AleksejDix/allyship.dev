-- ============================================================================
-- Migration: Update Website RLS Policies for Basejump Accounts
-- ============================================================================
-- Description: Replaces Space-based RLS policies with account-based policies
--              that check membership via basejump.account_user
--
-- Changes:
-- - Drops old "Space owners can..." policies
-- - Creates new "Account members can..." policies
-- - Uses basejump.has_role_on_account() for permission checks
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop old Space-based RLS policies
-- ============================================================================
DROP POLICY IF EXISTS "Space owners can view websites" ON public."Website";
DROP POLICY IF EXISTS "Space owners can create websites" ON public."Website";
DROP POLICY IF EXISTS "Space owners can update websites" ON public."Website";
DROP POLICY IF EXISTS "Space owners can delete websites" ON public."Website";

-- ============================================================================
-- STEP 2: Create new account-based RLS policies
-- ============================================================================

-- SELECT: Account members can view websites in their accounts
CREATE POLICY "Account members can view websites"
  ON public."Website"
  FOR SELECT
  TO authenticated
  USING (
    -- Check if user is a member of the account
    basejump.has_role_on_account(account_id) = true
  );

-- INSERT: Account members can create websites in their accounts
CREATE POLICY "Account members can create websites"
  ON public."Website"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Check if user is a member of the account they're trying to create in
    basejump.has_role_on_account(account_id) = true
  );

-- UPDATE: Account members can update websites in their accounts
CREATE POLICY "Account members can update websites"
  ON public."Website"
  FOR UPDATE
  TO authenticated
  USING (
    -- User must be a member of the account
    basejump.has_role_on_account(account_id) = true
  )
  WITH CHECK (
    -- If they're changing account_id, they must be a member of the new account too
    basejump.has_role_on_account(account_id) = true
  );

-- DELETE: Account owners can delete websites in their accounts
-- Note: Using 'owner' role here for more restrictive deletion
CREATE POLICY "Account owners can delete websites"
  ON public."Website"
  FOR DELETE
  TO authenticated
  USING (
    -- Only owners can delete
    basejump.has_role_on_account(account_id, 'owner'::basejump.account_role) = true
  );

-- ============================================================================
-- STEP 3: Add comments for documentation
-- ============================================================================
COMMENT ON POLICY "Account members can view websites" ON public."Website" IS
  'Allows any member of an account to view websites belonging to that account. Uses basejump.has_role_on_account() to check membership.';

COMMENT ON POLICY "Account members can create websites" ON public."Website" IS
  'Allows any member of an account to create websites in that account.';

COMMENT ON POLICY "Account members can update websites" ON public."Website" IS
  'Allows any member of an account to update websites in that account.';

COMMENT ON POLICY "Account owners can delete websites" ON public."Website" IS
  'Allows only account owners (not regular members) to delete websites. This is more restrictive than other operations.';

-- ============================================================================
-- STEP 4: Verify policies are working
-- ============================================================================
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  -- Count new policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'Website'
    AND policyname LIKE 'Account %';

  IF policy_count = 4 THEN
    RAISE NOTICE '✓ Successfully created 4 new account-based RLS policies for Website table';
  ELSE
    RAISE WARNING 'Expected 4 policies, but found %. Please review.', policy_count;
  END IF;

  -- Verify old policies are gone
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'Website'
    AND policyname LIKE 'Space %';

  IF policy_count = 0 THEN
    RAISE NOTICE '✓ Successfully removed all old Space-based policies';
  ELSE
    RAISE WARNING 'Found % old Space-based policies still remaining', policy_count;
  END IF;
END $$;

-- ============================================================================
-- STEP 5: Print migration summary
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '
  ====================================================================
  WEBSITE RLS POLICIES UPDATED
  ====================================================================

  OLD POLICIES (removed):
  - Space owners can view websites
  - Space owners can create websites
  - Space owners can update websites
  - Space owners can delete websites

  NEW POLICIES (created):
  - Account members can view websites
  - Account members can create websites
  - Account members can update websites
  - Account owners can delete websites (owner role required)

  NOTES:
  - All policies use basejump.has_role_on_account() for checks
  - Delete policy is more restrictive (requires owner role)
  - Members can view, create, and update
  - Only owners can delete

  ====================================================================
  ';
END $$;
