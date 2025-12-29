-- ============================================================================
-- Migration: Fix Permissions for Custom Roles Functions
-- ============================================================================
-- Description: Grant EXECUTE permissions to authenticated users for all
--              custom roles functions
-- ============================================================================

-- Grant EXECUTE on all custom roles helper functions
GRANT EXECUTE ON FUNCTION public.is_account_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_role(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_has_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_has_role_level(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_roles(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_can_manage_roles(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_role(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_role(uuid, uuid, text) TO authenticated;

-- Revoke from PUBLIC for security (only authenticated users should access)
REVOKE EXECUTE ON FUNCTION public.is_account_member(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.user_has_role(uuid, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.current_user_has_role(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.current_user_has_role_level(uuid, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_current_user_roles(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.current_user_can_manage_roles(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.grant_role(uuid, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.revoke_role(uuid, uuid, text) FROM PUBLIC;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '
  ====================================================================
  CUSTOM ROLES FUNCTION PERMISSIONS FIXED
  ====================================================================

  Granted EXECUTE to authenticated role on:
  - is_account_member(uuid)
  - user_has_role(uuid, uuid, text)
  - current_user_has_role(uuid, text)
  - current_user_has_role_level(uuid, integer)
  - get_current_user_roles(uuid)
  - current_user_can_manage_roles(uuid)
  - grant_role(uuid, uuid, text)
  - revoke_role(uuid, uuid, text)

  Revoked from PUBLIC for security.

  ====================================================================
  ';
END $$;
