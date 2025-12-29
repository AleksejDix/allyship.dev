-- Migration: Update account functions to use custom roles system
-- This replaces basejump.account_user with public.account_user_roles

-- Drop existing functions first (required when changing signatures)
DROP FUNCTION IF EXISTS public.get_accounts();
DROP FUNCTION IF EXISTS public.get_account_members(uuid, integer, integer);
DROP FUNCTION IF EXISTS public.get_account(uuid);

-- 1. Update get_accounts() to use custom roles
CREATE OR REPLACE FUNCTION public.get_accounts()
RETURNS TABLE (
  account_id uuid,
  account_role text,
  is_primary_owner boolean,
  name text,
  slug text,
  personal_account boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    aur.account_id,
    aur.role_id AS account_role,  -- role_id is the same as the old account_role values
    a.primary_owner_user_id = auth.uid() AS is_primary_owner,
    a.name,
    a.slug,
    a.personal_account,
    a.created_at,
    a.updated_at
  FROM public.account_user_roles aur
  JOIN basejump.accounts a ON a.id = aur.account_id
  WHERE aur.user_id = auth.uid();
$$;

-- 2. Update get_account_members() to use custom roles
CREATE OR REPLACE FUNCTION public.get_account_members(
  account_id uuid,
  results_limit integer DEFAULT 50,
  results_offset integer DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- only account owners can access this function
    if (SELECT NOT current_user_has_role(get_account_members.account_id, 'owner')) then
        raise exception 'Only account owners can access this function';
    end if;

    return (
      SELECT json_agg(
        json_build_object(
          'user_id', aur.user_id,
          'account_role', aur.role_id,  -- role_id is the same as old account_role values
          'name', p.name,
          'email', u.email,
          'is_primary_owner', a.primary_owner_user_id = aur.user_id
        )
      )
      FROM public.account_user_roles aur
      JOIN basejump.accounts a ON a.id = aur.account_id
      JOIN basejump.accounts p ON p.primary_owner_user_id = aur.user_id AND p.personal_account = true
      JOIN auth.users u ON u.id = aur.user_id
      WHERE aur.account_id = get_account_members.account_id
      LIMIT coalesce(get_account_members.results_limit, 50)
      OFFSET coalesce(get_account_members.results_offset, 0)
    );
END;
$$;

-- 3. Update get_account() to use custom roles
CREATE OR REPLACE FUNCTION public.get_account(account_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- check if the user is a member of the account or a service_role user
    if current_user IN ('anon', 'authenticated') and
       NOT is_account_member(get_account.account_id) then
        raise exception 'You must be a member of an account to access it';
    end if;

    return (
      SELECT json_build_object(
        'account_id', a.id,
        'account_role', aur.role_id,  -- role_id is the same as old account_role values
        'is_primary_owner', a.primary_owner_user_id = auth.uid(),
        'name', a.name,
        'slug', a.slug,
        'personal_account', a.personal_account,
        'billing_enabled', case
                              when a.personal_account = true then
                                  config.enable_personal_account_billing
                              else
                                  config.enable_team_account_billing
                           end,
        'billing_status', bs.status,
        'created_at', a.created_at,
        'updated_at', a.updated_at,
        'metadata', a.public_metadata
      )
      FROM basejump.accounts a
      LEFT JOIN public.account_user_roles aur ON a.id = aur.account_id AND aur.user_id = auth.uid()
      JOIN basejump.config config ON true
      LEFT JOIN (
        SELECT bs.account_id, status
        FROM basejump.billing_subscriptions bs
        WHERE bs.account_id = get_account.account_id
        ORDER BY created DESC
        LIMIT 1
      ) bs ON bs.account_id = a.id
      WHERE a.id = get_account.account_id
    );
END;
$$;

-- get_account_by_slug() doesn't need changes as it just calls get_account()

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_accounts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_account_members(uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_account(uuid) TO authenticated;
