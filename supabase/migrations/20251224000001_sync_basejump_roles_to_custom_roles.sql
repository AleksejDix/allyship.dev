-- ============================================================================
-- Migration: Sync Basejump Roles to Custom Roles System
-- ============================================================================
-- Description: One-time sync of existing basejump.account_user data to new
--              public.account_user_roles system.
--
-- This allows both systems to run in parallel during transition.
-- ============================================================================

-- ============================================================================
-- STEP 1: Sync existing basejump owners → owner role
-- ============================================================================
INSERT INTO public.account_user_roles (account_id, user_id, role_id, granted_by, granted_at)
SELECT
  au.account_id,
  au.user_id,
  'owner', -- Map basejump 'owner' to our 'owner' role
  a.primary_owner_user_id, -- Granted by the account owner
  a.created_at
FROM basejump.account_user au
JOIN basejump.accounts a ON a.id = au.account_id
WHERE au.account_role = 'owner'::basejump.account_role
ON CONFLICT (account_id, user_id, role_id) DO NOTHING;

-- ============================================================================
-- STEP 2: Sync existing basejump members → member role
-- ============================================================================
INSERT INTO public.account_user_roles (account_id, user_id, role_id, granted_by, granted_at)
SELECT
  au.account_id,
  au.user_id,
  'member', -- Map basejump 'member' to our 'member' role
  a.primary_owner_user_id, -- Granted by the account owner
  a.created_at
FROM basejump.account_user au
JOIN basejump.accounts a ON a.id = au.account_id
WHERE au.account_role = 'member'::basejump.account_role
ON CONFLICT (account_id, user_id, role_id) DO NOTHING;

-- ============================================================================
-- STEP 3: Verify sync results
-- ============================================================================
DO $$
DECLARE
  basejump_count INTEGER;
  custom_roles_count INTEGER;
  owners_count INTEGER;
  members_count INTEGER;
BEGIN
  -- Count basejump records
  SELECT COUNT(*) INTO basejump_count FROM basejump.account_user;

  -- Count custom roles records
  SELECT COUNT(*) INTO custom_roles_count FROM public.account_user_roles;

  -- Count by role type
  SELECT COUNT(*) INTO owners_count
  FROM public.account_user_roles
  WHERE role_id = 'owner';

  SELECT COUNT(*) INTO members_count
  FROM public.account_user_roles
  WHERE role_id = 'member';

  RAISE NOTICE '
  ====================================================================
  BASEJUMP → CUSTOM ROLES SYNC COMPLETE
  ====================================================================

  Basejump account_user records:     %
  Custom account_user_roles records: %

  Breakdown:
  - Owners:                          %
  - Members:                         %

  Status: % %
  ====================================================================
  ',
  basejump_count,
  custom_roles_count,
  owners_count,
  members_count,
  CASE WHEN basejump_count = custom_roles_count THEN '✓ SYNCED' ELSE '❌ MISMATCH' END,
  CASE WHEN basejump_count != custom_roles_count
    THEN '(Expected ' || basejump_count || ' but got ' || custom_roles_count || ')'
    ELSE ''
  END;

  -- Warning if mismatch
  IF basejump_count != custom_roles_count THEN
    RAISE WARNING 'Sync mismatch detected. Investigate data inconsistencies.';
  END IF;
END $$;

-- ============================================================================
-- STEP 4: Create trigger to keep systems in sync (temporary)
-- ============================================================================
-- When a user is added to basejump.account_user, also add to custom system

CREATE OR REPLACE FUNCTION public.sync_basejump_to_custom_roles()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Add corresponding role in custom system
    INSERT INTO public.account_user_roles (account_id, user_id, role_id, granted_by)
    VALUES (
      NEW.account_id,
      NEW.user_id,
      CASE NEW.account_role::text
        WHEN 'owner' THEN 'owner'
        WHEN 'member' THEN 'member'
        ELSE 'member' -- Default fallback
      END,
      auth.uid()
    )
    ON CONFLICT (account_id, user_id, role_id) DO NOTHING;

  ELSIF TG_OP = 'UPDATE' THEN
    -- If role changed, update custom system
    IF OLD.account_role != NEW.account_role THEN
      -- Remove old role
      DELETE FROM public.account_user_roles
      WHERE account_id = OLD.account_id
        AND user_id = OLD.user_id
        AND role_id = CASE OLD.account_role::text
          WHEN 'owner' THEN 'owner'
          WHEN 'member' THEN 'member'
          ELSE 'member'
        END;

      -- Add new role
      INSERT INTO public.account_user_roles (account_id, user_id, role_id, granted_by)
      VALUES (
        NEW.account_id,
        NEW.user_id,
        CASE NEW.account_role::text
          WHEN 'owner' THEN 'owner'
          WHEN 'member' THEN 'member'
          ELSE 'member'
        END,
        auth.uid()
      )
      ON CONFLICT (account_id, user_id, role_id) DO NOTHING;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    -- Remove from custom system
    DELETE FROM public.account_user_roles
    WHERE account_id = OLD.account_id
      AND user_id = OLD.user_id
      AND role_id = CASE OLD.account_role::text
        WHEN 'owner' THEN 'owner'
        WHEN 'member' THEN 'member'
        ELSE 'member'
      END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.sync_basejump_to_custom_roles IS
  'Temporary trigger function to keep basejump.account_user and public.account_user_roles in sync during transition';

-- Create trigger
DROP TRIGGER IF EXISTS sync_account_user_to_custom_roles ON basejump.account_user;
CREATE TRIGGER sync_account_user_to_custom_roles
  AFTER INSERT OR UPDATE OR DELETE ON basejump.account_user
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_basejump_to_custom_roles();

COMMENT ON TRIGGER sync_account_user_to_custom_roles ON basejump.account_user IS
  'Temporary: keeps custom roles in sync with basejump during transition. Remove after full migration.';

-- ============================================================================
-- STEP 5: Migration complete
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '
  ====================================================================
  SYNC COMPLETE - BOTH SYSTEMS NOW RUNNING IN PARALLEL
  ====================================================================

  Both systems will stay in sync via trigger.

  You can now:
  1. Use basejump functions (old system) - still works
  2. Use public.user_has_role() functions (new system) - also works

  When ready to migrate:
  1. Update all RLS policies to use new functions
  2. Update all application code
  3. Run tests to verify everything works
  4. Remove basejump dependencies
  5. Drop sync trigger

  ====================================================================
  ';
END $$;
