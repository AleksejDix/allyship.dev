-- Phase 5: Drop Basejump Roles Sync
-- Now that all functions and RLS policies use public.account_user_roles,
-- we no longer need to sync with basejump.account_user

-- Drop the trigger that syncs basejump.account_user to custom roles
DROP TRIGGER IF EXISTS sync_account_user_to_custom_roles ON basejump.account_user;

-- Drop the sync function
DROP FUNCTION IF EXISTS public.sync_basejump_to_custom_roles();

-- Note: We keep basejump.account_user table for now (Phase 6 will migrate basejump.accounts)
-- But we no longer rely on it for role information
