-- Drop account_role column from basejump.account_user
-- We no longer need it since all role data is in public.account_user_roles

-- 1. Update accept_invitation() to not write account_role
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

  -- Insert into basejump.account_user (for membership tracking only)
  insert into basejump.account_user (account_id, user_id)
  values (lookup_account_id, auth.uid())
  ON CONFLICT (account_id, user_id) DO NOTHING;

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

-- 2. Update accept_secure_invitation() to not write account_role
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

  -- Add user to basejump.account_user (for membership tracking only)
  insert into basejump.account_user (account_id, user_id)
  values (
    security_record.account_id,
    auth.uid()
  )
  ON CONFLICT (account_id, user_id) DO NOTHING;

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

-- 3. Update update_account_user_role() to not write account_role
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

    -- basejump.account_user no longer stores role, only membership
    -- No need to update anything there

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

-- 4. Update basejump.run_new_user_setup() to not write account_role and populate custom roles
CREATE OR REPLACE FUNCTION basejump.run_new_user_setup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'basejump, public'
AS $$
declare
    first_account_id    uuid;
    generated_user_name text;
begin

    -- first we setup the user profile
    -- TODO: see if we can get the user's name from the auth.users table once we learn how oauth works
    if new.email IS NOT NULL then
        generated_user_name := split_part(new.email, '@', 1);
    end if;
    -- create the new users's personal account
    insert into basejump.accounts (name, primary_owner_user_id, personal_account, id)
    values (generated_user_name, NEW.id, true, NEW.id)
    returning id into first_account_id;

    -- add them to the account_user table for membership tracking
    insert into basejump.account_user (account_id, user_id)
    values (first_account_id, NEW.id);

    -- add them to custom roles as owner
    insert into public.account_user_roles (account_id, user_id, role_id, granted_by)
    values (first_account_id, NEW.id, 'owner', NEW.id);

    return NEW;
end;
$$;

-- 5. Update basejump.has_role_on_account() to use custom roles
CREATE OR REPLACE FUNCTION basejump.has_role_on_account(account_id uuid, account_role basejump.account_role DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'basejump, public'
AS $$
  select exists(
    select 1
    from public.account_user_roles aur
    where aur.user_id = auth.uid()
      and aur.account_id = has_role_on_account.account_id
      and (
        aur.role_id = has_role_on_account.account_role::text
        or has_role_on_account.account_role is null
      )
  );
$$;

-- 6. Drop the account_role column from basejump.account_user
ALTER TABLE basejump.account_user DROP COLUMN IF EXISTS account_role;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.accept_invitation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_secure_invitation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_account_user_role(uuid, uuid, text, boolean) TO authenticated;
