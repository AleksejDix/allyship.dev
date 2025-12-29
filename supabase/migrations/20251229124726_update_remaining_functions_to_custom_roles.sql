-- Update remaining functions to use custom roles system
-- This completes the migration away from basejump.account_user.account_role

-- 1. Update current_user_account_role() to read from custom roles
CREATE OR REPLACE FUNCTION public.current_user_account_role(account_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, basejump'
AS $$
DECLARE
    response jsonb;
BEGIN
    select jsonb_build_object(
                   'account_role', aur.role_id,
                   'is_primary_owner', a.primary_owner_user_id = auth.uid(),
                   'is_personal_account', a.personal_account
               )
    into response
    from public.account_user_roles aur
             join basejump.accounts a on a.id = aur.account_id
    where aur.user_id = auth.uid()
      and aur.account_id = current_user_account_role.account_id;

    -- if the user is not a member of the account, throw an error
    if response ->> 'account_role' IS NULL then
        raise exception 'Not found';
    end if;

    return response;
END
$$;

-- 2. Update grant_role() to check membership via custom roles
CREATE OR REPLACE FUNCTION public.grant_role(
  p_account_id uuid,
  p_user_id uuid,
  p_role_id text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, basejump'
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

-- 3. Update accept_invitation() to populate custom roles
CREATE OR REPLACE FUNCTION public.accept_invitation(lookup_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, basejump'
AS $$
declare
  lookup_account_id uuid;
  new_member_role text;
  lookup_account_slug text;
  security_record record;
  user_email text;
begin
  select email into user_email from auth.users where id = auth.uid();

  select * into security_record
  from public.invitations
  where basejump_invitation_token = lookup_token
    and invited_email = user_email
    and expires_at > now()
    and accepted_by_user_id is null;

  if security_record is null then
    raise exception 'Invitation not found, expired, or not for this email address';
  end if;

  select i.account_id, i.account_role, a.slug
  into lookup_account_id, new_member_role, lookup_account_slug
  from basejump.invitations i
  join basejump.accounts a on a.id = i.account_id
  where i.token = lookup_token
    and i.created_at > now() - interval '24 hours';

  if lookup_account_id is null then
    raise exception 'Invitation not found';
  end if;

  -- Insert into basejump.account_user (for backward compatibility)
  insert into basejump.account_user (account_id, user_id, account_role)
  values (lookup_account_id, auth.uid(), new_member_role::basejump.account_role);

  -- Insert into custom roles system
  insert into public.account_user_roles (account_id, user_id, role_id, granted_by)
  values (lookup_account_id, auth.uid(), new_member_role, lookup_account_id);

  delete from basejump.invitations
  where token = lookup_token
    and invitation_type = 'one_time';

  update public.invitations
  set accepted_by_user_id = auth.uid(),
      accepted_at = now(),
      acceptance_ip = inet_client_addr(),
      updated_at = now()
  where id = security_record.id;

  return json_build_object(
    'account_id', lookup_account_id,
    'account_role', new_member_role,
    'slug', lookup_account_slug,
    'accepted_at', now(),
    'accepted_by_email', user_email
  );
EXCEPTION
  WHEN unique_violation THEN
    raise exception 'You are already a member of this account';
end;
$$;

-- 4. Update accept_secure_invitation() to populate custom roles
CREATE OR REPLACE FUNCTION public.accept_secure_invitation(lookup_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, basejump'
AS $$
declare
  security_record record;
  account_record record;
  user_email text;
begin
  select email into user_email from auth.users where id = auth.uid();

  -- Validate invitation exists and user can accept it
  select * into security_record
  from public.invitations
  where basejump_invitation_token = lookup_token
    and invited_email = user_email
    and expires_at > now()
    and accepted_by_user_id is null
    and created_at > now() - interval '24 hours';

  if security_record is null then
    raise exception 'Invitation not found, expired, or not for this email address';
  end if;

  -- Get account information
  select * into account_record
  from basejump.accounts
  where id = security_record.account_id;

  if account_record is null then
    raise exception 'Account not found';
  end if;

  -- Add user to basejump.account_user (for backward compatibility)
  insert into basejump.account_user (account_id, user_id, account_role)
  values (
    security_record.account_id,
    auth.uid(),
    security_record.account_role::basejump.account_role
  );

  -- Add user to custom roles system
  insert into public.account_user_roles (account_id, user_id, role_id, granted_by)
  values (
    security_record.account_id,
    auth.uid(),
    security_record.account_role,
    security_record.account_id
  );

  -- Update security record as accepted
  update public.invitations
  set accepted_by_user_id = auth.uid(),
      accepted_at = now(),
      acceptance_ip = inet_client_addr(),
      updated_at = now()
  where id = security_record.id;

  return json_build_object(
    'account_id', security_record.account_id,
    'account_role', security_record.account_role,
    'slug', account_record.slug,
    'account_name', account_record.name,
    'accepted_at', now(),
    'accepted_by_email', user_email
  );
EXCEPTION
  WHEN unique_violation THEN
    raise exception 'You are already a member of this account';
end;
$$;

-- 5. Update remove_account_member() to remove from custom roles
CREATE OR REPLACE FUNCTION public.remove_account_member(
  account_id uuid,
  user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, basejump'
AS $$
BEGIN
    -- only account owners can access this function
    if NOT public.current_user_has_role(remove_account_member.account_id, 'owner') then
        raise exception 'Only account owners can access this function';
    end if;

    -- Remove from custom roles
    delete from public.account_user_roles aur
    where aur.account_id = remove_account_member.account_id
      and aur.user_id = remove_account_member.user_id;

    -- Remove from basejump.account_user (for backward compatibility)
    delete from basejump.account_user wu
    where wu.account_id = remove_account_member.account_id
      and wu.user_id = remove_account_member.user_id;
END;
$$;

-- 6. Update update_account_user_role() to update custom roles
CREATE OR REPLACE FUNCTION public.update_account_user_role(
  account_id uuid,
  user_id uuid,
  new_account_role text,
  make_primary_owner boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, basejump'
AS $$
declare
    is_account_owner         boolean;
    is_account_primary_owner boolean;
    changing_primary_owner   boolean;
begin
    -- check if the user is an owner
    select public.current_user_has_role(update_account_user_role.account_id, 'owner') into is_account_owner;

    if not is_account_owner then
        raise exception 'You must be an owner of the account to update a users role';
    end if;

    -- check if the user being changed is the primary owner
    select primary_owner_user_id = auth.uid(), primary_owner_user_id = update_account_user_role.user_id
    into is_account_primary_owner, changing_primary_owner
    from basejump.accounts
    where id = update_account_user_role.account_id;

    if changing_primary_owner = true and is_account_primary_owner = false then
        raise exception 'You must be the primary owner of the account to change the primary owner';
    end if;

    -- Update custom roles (remove old role, add new one)
    delete from public.account_user_roles aur
    where aur.account_id = update_account_user_role.account_id
      and aur.user_id = update_account_user_role.user_id;

    insert into public.account_user_roles (account_id, user_id, role_id, granted_by)
    values (
      update_account_user_role.account_id,
      update_account_user_role.user_id,
      new_account_role,
      auth.uid()
    );

    -- Update basejump.account_user (for backward compatibility)
    update basejump.account_user au
    set account_role = new_account_role::basejump.account_role
    where au.account_id = update_account_user_role.account_id
      and au.user_id = update_account_user_role.user_id;

    if make_primary_owner = true then
        if is_account_primary_owner = false then
            raise exception 'You must be the primary owner of the account to change the primary owner';
        end if;

        update basejump.accounts
        set primary_owner_user_id = update_account_user_role.user_id
        where id = update_account_user_role.account_id;
    end if;
end;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.current_user_account_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_role(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_invitation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_secure_invitation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_account_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_account_user_role(uuid, uuid, text, boolean) TO authenticated;
