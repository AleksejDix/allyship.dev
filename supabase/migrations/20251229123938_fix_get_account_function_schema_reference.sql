-- Fix: Add explicit schema references for custom role functions
-- When search_path = '', all function calls need explicit schema prefix

-- Fix get_account_members() - add public. prefix to current_user_has_role
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
    if (SELECT NOT public.current_user_has_role(get_account_members.account_id, 'owner')) then
        raise exception 'Only account owners can access this function';
    end if;

    return (
      SELECT json_agg(
        json_build_object(
          'user_id', aur.user_id,
          'account_role', aur.role_id,
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

-- Fix get_account() - add public. prefix to is_account_member
CREATE OR REPLACE FUNCTION public.get_account(account_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- check if the user is a member of the account or a service_role user
    if current_user IN ('anon', 'authenticated') and
       NOT public.is_account_member(get_account.account_id) then
        raise exception 'You must be a member of an account to access it';
    end if;

    return (
      SELECT json_build_object(
        'account_id', a.id,
        'account_role', aur.role_id,
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
