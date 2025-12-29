-- ============================================================================
-- Migration: Create Custom Roles System
-- ============================================================================
-- Description: Creates standalone roles system to replace Basejump's account_role enum
--              This runs in parallel with Basejump initially, then will replace it.
--
-- Strategy:
-- 1. Create public.roles reference table
-- 2. Create public.account_user_roles junction table
-- 3. Create helper functions to replace basejump.has_role_on_account()
-- 4. Keep both systems running until migration is complete
-- ============================================================================

-- ============================================================================
-- STEP 1: Create roles reference table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.roles (
  id text PRIMARY KEY CHECK (id ~ '^[a-z_]+$'),
  name text NOT NULL,
  description text NOT NULL,
  level integer NOT NULL, -- Hierarchy level: owner=100, admin=90, manager=80, developer=70, auditor=60, member=50
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.roles IS 'Available roles for account members - replaces basejump account_role enum';
COMMENT ON COLUMN public.roles.level IS 'Hierarchy level for permission checks (higher = more permissions)';

-- Seed roles
INSERT INTO public.roles (id, name, description, level) VALUES
  ('owner', 'Owner', 'Full account ownership and control', 100),
  ('admin', 'Administrator', 'Full administrative access', 90),
  ('manager', 'Manager', 'Team and project management', 80),
  ('developer', 'Developer', 'Development and technical access', 70),
  ('auditor', 'Auditor', 'Read-only access for compliance and auditing', 60),
  ('member', 'Member', 'Basic team member access', 50)
ON CONFLICT (id) DO NOTHING;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER roles_set_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view available roles
CREATE POLICY "roles_select_authenticated" ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can modify roles
CREATE POLICY "roles_modify_service_role" ON public.roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STEP 2: Create account_user_roles junction table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.account_user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES basejump.accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id text NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,

  -- Audit trail
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),

  -- Prevent duplicate role assignments
  UNIQUE (account_id, user_id, role_id)
);

COMMENT ON TABLE public.account_user_roles IS 'Junction table: users ↔ roles ↔ accounts. Replaces basejump.account_user';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_account_user_roles_account_id ON public.account_user_roles(account_id);
CREATE INDEX IF NOT EXISTS idx_account_user_roles_user_id ON public.account_user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_account_user_roles_role_id ON public.account_user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_account_user_roles_account_user ON public.account_user_roles(account_id, user_id);

-- Enable RLS
ALTER TABLE public.account_user_roles ENABLE ROW LEVEL SECURITY;

-- Account members can view role assignments
CREATE POLICY "account_user_roles_select_members" ON public.account_user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM basejump.account_user au
      WHERE au.account_id = account_user_roles.account_id
        AND au.user_id = auth.uid()
    )
  );

-- Only owners and admins can manage roles (INSERT/UPDATE/DELETE)
-- We'll add these policies after creating the helper functions

-- ============================================================================
-- STEP 3: Create helper functions (replacements for basejump functions)
-- ============================================================================

-- Check if user has a specific role in an account
CREATE OR REPLACE FUNCTION public.user_has_role(
  p_account_id uuid,
  p_user_id uuid,
  p_role_id text
) RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.account_user_roles aur
    WHERE aur.account_id = p_account_id
      AND aur.user_id = p_user_id
      AND aur.role_id = p_role_id
  );
$$;

COMMENT ON FUNCTION public.user_has_role IS 'Check if a user has a specific role in an account';

-- Check if current user has a specific role
CREATE OR REPLACE FUNCTION public.current_user_has_role(
  p_account_id uuid,
  p_role_id text
) RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.user_has_role(p_account_id, auth.uid(), p_role_id);
$$;

COMMENT ON FUNCTION public.current_user_has_role IS 'Check if current user has a specific role in an account';

-- Check if current user has role with minimum level (e.g., at least manager level)
CREATE OR REPLACE FUNCTION public.current_user_has_role_level(
  p_account_id uuid,
  p_min_level integer
) RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.account_user_roles aur
    JOIN public.roles r ON r.id = aur.role_id
    WHERE aur.account_id = p_account_id
      AND aur.user_id = auth.uid()
      AND r.level >= p_min_level
  );
$$;

COMMENT ON FUNCTION public.current_user_has_role_level IS 'Check if current user has a role with at least the specified level';

-- Get all roles for current user in an account
CREATE OR REPLACE FUNCTION public.get_current_user_roles(
  p_account_id uuid
) RETURNS TABLE(role_id text, role_name text, role_level integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.name, r.level
  FROM public.account_user_roles aur
  JOIN public.roles r ON r.id = aur.role_id
  WHERE aur.account_id = p_account_id
    AND aur.user_id = auth.uid()
  ORDER BY r.level DESC;
$$;

COMMENT ON FUNCTION public.get_current_user_roles IS 'Get all roles for current user in an account';

-- Check if current user can manage roles (is owner or admin)
CREATE OR REPLACE FUNCTION public.current_user_can_manage_roles(
  p_account_id uuid
) RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_user_has_role(p_account_id, 'owner')
      OR public.current_user_has_role(p_account_id, 'admin');
$$;

COMMENT ON FUNCTION public.current_user_can_manage_roles IS 'Check if current user can manage roles (owner or admin)';

-- Grant a role to a user
CREATE OR REPLACE FUNCTION public.grant_role(
  p_account_id uuid,
  p_user_id uuid,
  p_role_id text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role_assignment_id uuid;
BEGIN
  -- Check if current user can manage roles
  IF NOT public.current_user_can_manage_roles(p_account_id) THEN
    RAISE EXCEPTION 'Only owners and admins can grant roles';
  END IF;

  -- Verify target user is a member of the account (check basejump for now)
  IF NOT EXISTS (
    SELECT 1
    FROM basejump.account_user au
    WHERE au.account_id = p_account_id
      AND au.user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'User is not a member of this account';
  END IF;

  -- Verify role exists
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE id = p_role_id) THEN
    RAISE EXCEPTION 'Invalid role_id: %', p_role_id;
  END IF;

  -- Insert or update role assignment
  INSERT INTO public.account_user_roles (account_id, user_id, role_id, granted_by)
  VALUES (p_account_id, p_user_id, p_role_id, auth.uid())
  ON CONFLICT (account_id, user_id, role_id) DO UPDATE
    SET granted_by = auth.uid(),
        granted_at = now()
  RETURNING id INTO v_role_assignment_id;

  RETURN v_role_assignment_id;
END;
$$;

COMMENT ON FUNCTION public.grant_role IS 'Grant a role to a user in an account (owner/admin only)';

-- Revoke a role from a user
CREATE OR REPLACE FUNCTION public.revoke_role(
  p_account_id uuid,
  p_user_id uuid,
  p_role_id text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user can manage roles
  IF NOT public.current_user_can_manage_roles(p_account_id) THEN
    RAISE EXCEPTION 'Only owners and admins can revoke roles';
  END IF;

  -- Delete the role assignment
  DELETE FROM public.account_user_roles
  WHERE account_id = p_account_id
    AND user_id = p_user_id
    AND role_id = p_role_id;
END;
$$;

COMMENT ON FUNCTION public.revoke_role IS 'Revoke a role from a user in an account (owner/admin only)';

-- ============================================================================
-- STEP 4: Add RLS policies for role management
-- ============================================================================

-- Only owners and admins can insert roles
CREATE POLICY "account_user_roles_insert_managers" ON public.account_user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.current_user_can_manage_roles(account_id));

-- Only owners and admins can update roles
CREATE POLICY "account_user_roles_update_managers" ON public.account_user_roles
  FOR UPDATE
  TO authenticated
  USING (public.current_user_can_manage_roles(account_id))
  WITH CHECK (public.current_user_can_manage_roles(account_id));

-- Only owners and admins can delete roles
CREATE POLICY "account_user_roles_delete_managers" ON public.account_user_roles
  FOR DELETE
  TO authenticated
  USING (public.current_user_can_manage_roles(account_id));

-- ============================================================================
-- STEP 5: Migration complete notice
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '
  ====================================================================
  CUSTOM ROLES SYSTEM CREATED
  ====================================================================

  Created:
  - public.roles (6 roles: owner, admin, manager, developer, auditor, member)
  - public.account_user_roles (junction table)
  - Helper functions: user_has_role, current_user_has_role, grant_role, revoke_role

  Next steps:
  1. Sync existing basejump.account_user data to new system
  2. Update RLS policies to use new functions
  3. Test all functionality
  4. Eventually deprecate basejump.account_user

  ====================================================================
  ';
END $$;
