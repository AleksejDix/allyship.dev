-- ============================================================================
-- Migration: Update RLS Policies to Use Custom Roles System
-- ============================================================================
-- Description: Replace all basejump.has_role_on_account() calls with
--              public.current_user_has_role() calls
--
-- This migration updates 17 RLS policies across 6 tables:
-- - Website (4 policies)
-- - programs (4 policies)
-- - integrations (4 policies)
-- - checks (3 policies)
-- - program_controls (1 policy)
-- - account_user_roles (1 policy - already correct)
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTION: Check if user is account member (any role)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_account_member(p_account_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.account_user_roles
    WHERE account_id = p_account_id
      AND user_id = auth.uid()
  );
$$;

COMMENT ON FUNCTION public.is_account_member IS
  'Check if current user is a member of the account (has any role)';

-- ============================================================================
-- TABLE: programs
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view programs for their accounts" ON public.programs;
DROP POLICY IF EXISTS "Account owners can create programs" ON public.programs;
DROP POLICY IF EXISTS "Account owners can update programs" ON public.programs;
DROP POLICY IF EXISTS "Account owners can delete programs" ON public.programs;

-- Create new policies with custom roles
CREATE POLICY "Users can view programs for their accounts" ON public.programs
  FOR SELECT
  USING (public.is_account_member(account_id));

CREATE POLICY "Account owners can create programs" ON public.programs
  FOR INSERT
  WITH CHECK (public.current_user_has_role(account_id, 'owner'));

CREATE POLICY "Account owners can update programs" ON public.programs
  FOR UPDATE
  USING (public.current_user_has_role(account_id, 'owner'));

CREATE POLICY "Account owners can delete programs" ON public.programs
  FOR DELETE
  USING (public.current_user_has_role(account_id, 'owner'));

-- ============================================================================
-- TABLE: integrations
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view integrations for their accounts" ON public.integrations;
DROP POLICY IF EXISTS "Users can create integrations for their accounts" ON public.integrations;
DROP POLICY IF EXISTS "Account owners can update integrations" ON public.integrations;
DROP POLICY IF EXISTS "Account owners can delete integrations" ON public.integrations;

-- Create new policies with custom roles
CREATE POLICY "Users can view integrations for their accounts" ON public.integrations
  FOR SELECT
  USING (public.is_account_member(account_id));

CREATE POLICY "Users can create integrations for their accounts" ON public.integrations
  FOR INSERT
  WITH CHECK (public.is_account_member(account_id));

CREATE POLICY "Account owners can update integrations" ON public.integrations
  FOR UPDATE
  USING (public.current_user_has_role(account_id, 'owner'));

CREATE POLICY "Account owners can delete integrations" ON public.integrations
  FOR DELETE
  USING (public.current_user_has_role(account_id, 'owner'));

-- ============================================================================
-- TABLE: Website
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Account members can view websites" ON public."Website";
DROP POLICY IF EXISTS "Account members can create websites" ON public."Website";
DROP POLICY IF EXISTS "Account members can update websites" ON public."Website";
DROP POLICY IF EXISTS "Account owners can delete websites" ON public."Website";

-- Create new policies with custom roles
CREATE POLICY "Account members can view websites" ON public."Website"
  FOR SELECT
  USING (public.is_account_member(account_id));

CREATE POLICY "Account members can create websites" ON public."Website"
  FOR INSERT
  WITH CHECK (public.is_account_member(account_id));

CREATE POLICY "Account members can update websites" ON public."Website"
  FOR UPDATE
  USING (public.is_account_member(account_id))
  WITH CHECK (public.is_account_member(account_id));

CREATE POLICY "Account owners can delete websites" ON public."Website"
  FOR DELETE
  USING (public.current_user_has_role(account_id, 'owner'));

-- ============================================================================
-- TABLE: checks
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view checks for their accounts" ON public.checks;
DROP POLICY IF EXISTS "Users can insert checks for their accounts" ON public.checks;
DROP POLICY IF EXISTS "Users can update checks for their accounts" ON public.checks;

-- Create new policies with custom roles
CREATE POLICY "Users can view checks for their accounts" ON public.checks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM programs p
      WHERE p.id = checks.program_id
        AND public.is_account_member(p.account_id)
    )
  );

CREATE POLICY "Users can insert checks for their accounts" ON public.checks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM programs p
      WHERE p.id = checks.program_id
        AND public.is_account_member(p.account_id)
    )
  );

CREATE POLICY "Users can update checks for their accounts" ON public.checks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM programs p
      WHERE p.id = checks.program_id
        AND public.is_account_member(p.account_id)
    )
  );

-- ============================================================================
-- TABLE: program_controls
-- ============================================================================

-- Drop old policy
DROP POLICY IF EXISTS "Users can view program_controls for their accounts" ON public.program_controls;

-- Create new policy with custom roles
CREATE POLICY "Users can view program_controls for their accounts" ON public.program_controls
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM programs p
      WHERE p.id = program_controls.program_id
        AND public.is_account_member(p.account_id)
    )
  );

-- ============================================================================
-- TABLE: account_user_roles (our new table)
-- ============================================================================

-- Update the select policy to use simpler membership check
DROP POLICY IF EXISTS "account_user_roles_select_members" ON public.account_user_roles;

CREATE POLICY "account_user_roles_select_members" ON public.account_user_roles
  FOR SELECT
  TO authenticated
  USING (public.is_account_member(account_id));

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
  basejump_policy_count INTEGER;
BEGIN
  -- Count remaining policies using basejump functions
  SELECT COUNT(*) INTO basejump_policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND (qual LIKE '%basejump%' OR with_check LIKE '%basejump%');

  RAISE NOTICE '
  ====================================================================
  RLS POLICIES MIGRATED TO CUSTOM ROLES
  ====================================================================

  Updated 17 policies across 6 tables:
  - programs (4 policies)
  - integrations (4 policies)
  - Website (4 policies)
  - checks (3 policies)
  - program_controls (1 policy)
  - account_user_roles (1 policy)

  Remaining policies using basejump: %

  New functions used:
  - public.is_account_member(account_id) - any role
  - public.current_user_has_role(account_id, role_id) - specific role

  ====================================================================
  ', basejump_policy_count;

  IF basejump_policy_count > 0 THEN
    RAISE WARNING 'Still have % policies using basejump functions in public schema', basejump_policy_count;
  END IF;
END $$;
