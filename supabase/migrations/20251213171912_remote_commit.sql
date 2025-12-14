


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "basejump";


ALTER SCHEMA "basejump" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";








ALTER SCHEMA "public" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_tle";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";






CREATE TYPE "basejump"."account_role" AS ENUM (
    'owner',
    'member'
);


ALTER TYPE "basejump"."account_role" OWNER TO "postgres";


CREATE TYPE "basejump"."invitation_type" AS ENUM (
    'one_time',
    '24_hour'
);


ALTER TYPE "basejump"."invitation_type" OWNER TO "postgres";


CREATE TYPE "basejump"."subscription_status" AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid'
);


ALTER TYPE "basejump"."subscription_status" OWNER TO "postgres";


CREATE TYPE "public"."DomainTheme" AS ENUM (
    'LIGHT',
    'DARK',
    'BOTH'
);


ALTER TYPE "public"."DomainTheme" OWNER TO "postgres";


CREATE TYPE "public"."ScanStatus" AS ENUM (
    'pending',
    'completed',
    'failed',
    'queued'
);


ALTER TYPE "public"."ScanStatus" OWNER TO "postgres";


CREATE TYPE "public"."act_outcome" AS ENUM (
    'passed',
    'failed',
    'inapplicable',
    'cantTell'
);


ALTER TYPE "public"."act_outcome" OWNER TO "postgres";


CREATE TYPE "public"."act_rule_category" AS ENUM (
    'aria',
    'forms',
    'headings',
    'structure',
    'images',
    'links',
    'tables',
    'language',
    'landmarks',
    'color',
    'contrast',
    'focus',
    'keyboard',
    'buttons',
    'interactive',
    'autocomplete',
    'video',
    'audio',
    'meta',
    'iframe',
    'svg',
    'object'
);


ALTER TYPE "public"."act_rule_category" OWNER TO "postgres";


CREATE TYPE "public"."act_severity" AS ENUM (
    'critical',
    'serious',
    'moderate',
    'minor'
);


ALTER TYPE "public"."act_severity" OWNER TO "postgres";


CREATE TYPE "public"."test_execution_status" AS ENUM (
    'pending',
    'running',
    'completed',
    'failed',
    'cancelled'
);


ALTER TYPE "public"."test_execution_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."add_current_user_to_new_account"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
    if new.primary_owner_user_id = auth.uid() then
        insert into basejump.account_user (account_id, user_id, account_role)
        values (NEW.id, auth.uid(), 'owner');
    end if;
    return NEW;
end;
$$;


ALTER FUNCTION "basejump"."add_current_user_to_new_account"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."generate_token"("length" integer) RETURNS "text"
    LANGUAGE "sql"
    AS $$
select regexp_replace(replace(
                              replace(replace(replace(encode(gen_random_bytes(length)::bytea, 'base64'), '/', ''), '+',
                                              ''), '\', ''),
                              '=',
                              ''), E'[\\n\\r]+', '', 'g');
$$;


ALTER FUNCTION "basejump"."generate_token"("length" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."get_accounts_with_role"("passed_in_role" "basejump"."account_role" DEFAULT NULL::"basejump"."account_role") RETURNS SETOF "uuid"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
select account_id
from basejump.account_user wu
where wu.user_id = auth.uid()
  and (
            wu.account_role = passed_in_role
        or passed_in_role is null
    );
$$;


ALTER FUNCTION "basejump"."get_accounts_with_role"("passed_in_role" "basejump"."account_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."get_config"() RETURNS json
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result RECORD;
BEGIN
    SELECT * from basejump.config limit 1 into result;
    return row_to_json(result);
END;
$$;


ALTER FUNCTION "basejump"."get_config"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."has_role_on_account"("account_id" "uuid", "account_role" "basejump"."account_role" DEFAULT NULL::"basejump"."account_role") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
select exists(
               select 1
               from basejump.account_user wu
               where wu.user_id = auth.uid()
                 and wu.account_id = has_role_on_account.account_id
                 and (
                           wu.account_role = has_role_on_account.account_role
                       or has_role_on_account.account_role is null
                   )
           );
$$;


ALTER FUNCTION "basejump"."has_role_on_account"("account_id" "uuid", "account_role" "basejump"."account_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."is_set"("field_name" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result BOOLEAN;
BEGIN
    execute format('select %I from basejump.config limit 1', field_name) into result;
    return result;
END;
$$;


ALTER FUNCTION "basejump"."is_set"("field_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."protect_account_fields"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF current_user IN ('authenticated', 'anon') THEN
        -- these are protected fields that users are not allowed to update themselves
        -- platform admins should be VERY careful about updating them as well.
        if NEW.id <> OLD.id
            OR NEW.personal_account <> OLD.personal_account
            OR NEW.primary_owner_user_id <> OLD.primary_owner_user_id
        THEN
            RAISE EXCEPTION 'You do not have permission to update this field';
        end if;
    end if;

    RETURN NEW;
END
$$;


ALTER FUNCTION "basejump"."protect_account_fields"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."run_new_user_setup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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

    -- add them to the account_user table so they can act on it
    insert into basejump.account_user (account_id, user_id, account_role)
    values (first_account_id, NEW.id, 'owner');

    return NEW;
end;
$$;


ALTER FUNCTION "basejump"."run_new_user_setup"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."slugify_account_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    if NEW.slug is not null then
        NEW.slug = lower(regexp_replace(NEW.slug, '[^a-zA-Z0-9-]+', '-', 'g'));
    end if;

    RETURN NEW;
END
$$;


ALTER FUNCTION "basejump"."slugify_account_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."trigger_set_invitation_details"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.invited_by_user_id = auth.uid();
    NEW.account_name = (select name from basejump.accounts where id = NEW.account_id);
    RETURN NEW;
END
$$;


ALTER FUNCTION "basejump"."trigger_set_invitation_details"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."trigger_set_timestamps"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    if TG_OP = 'INSERT' then
        NEW.created_at = now();
        NEW.updated_at = now();
    else
        NEW.updated_at = now();
        NEW.created_at = OLD.created_at;
    end if;
    RETURN NEW;
END
$$;


ALTER FUNCTION "basejump"."trigger_set_timestamps"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "basejump"."trigger_set_user_tracking"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    if TG_OP = 'INSERT' then
        NEW.created_by = auth.uid();
        NEW.updated_by = auth.uid();
    else
        NEW.updated_by = auth.uid();
        NEW.created_by = OLD.created_by;
    end if;
    RETURN NEW;
END
$$;


ALTER FUNCTION "basejump"."trigger_set_user_tracking"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'basejump'
    AS $$
declare
    lookup_account_id       uuid;
    declare new_member_role basejump.account_role;
    lookup_account_slug     text;
begin
    select i.account_id, i.account_role, a.slug
    into lookup_account_id, new_member_role, lookup_account_slug
    from basejump.invitations i
             join basejump.accounts a on a.id = i.account_id
    where i.token = lookup_invitation_token
      and i.created_at > now() - interval '24 hours';

    if lookup_account_id IS NULL then
        raise exception 'Invitation not found';
    end if;

    if lookup_account_id is not null then
        -- we've validated the token is real, so grant the user access
        insert into basejump.account_user (account_id, user_id, account_role)
        values (lookup_account_id, auth.uid(), new_member_role);
        -- email types of invitations are only good for one usage
        delete from basejump.invitations where token = lookup_invitation_token and invitation_type = 'one_time';
    end if;
    return json_build_object('account_id', lookup_account_id, 'account_role', new_member_role, 'slug',
                             lookup_account_slug);
EXCEPTION
    WHEN unique_violation THEN
        raise exception 'You are already a member of this account';
end;
$$;


ALTER FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_account"("slug" "text" DEFAULT NULL::"text", "name" "text" DEFAULT NULL::"text") RETURNS json
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
DECLARE
    new_account_id uuid;
BEGIN
    insert into basejump.accounts (slug, name)
    values (create_account.slug, create_account.name)
    returning id into new_account_id;

    return public.get_account(new_account_id);
EXCEPTION
    WHEN unique_violation THEN
        raise exception 'An account with that unique ID already exists';
END;
$$;


ALTER FUNCTION "public"."create_account"("slug" "text", "name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_invitation"("account_id" "uuid", "account_role" "basejump"."account_role", "invitation_type" "basejump"."invitation_type") RETURNS json
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
declare
    new_invitation basejump.invitations;
begin
    insert into basejump.invitations (account_id, account_role, invitation_type, invited_by_user_id)
    values (account_id, account_role, invitation_type, auth.uid())
    returning * into new_invitation;

    return json_build_object('token', new_invitation.token);
end
$$;


ALTER FUNCTION "public"."create_invitation"("account_id" "uuid", "account_role" "basejump"."account_role", "invitation_type" "basejump"."invitation_type") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_account_role"("account_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
DECLARE
    response jsonb;
BEGIN

    select jsonb_build_object(
                   'account_role', wu.account_role,
                   'is_primary_owner', a.primary_owner_user_id = auth.uid(),
                   'is_personal_account', a.personal_account
               )
    into response
    from basejump.account_user wu
             join basejump.accounts a on a.id = wu.account_id
    where wu.user_id = auth.uid()
      and wu.account_id = current_user_account_role.account_id;

    -- if the user is not a member of the account, throw an error
    if response ->> 'account_role' IS NULL then
        raise exception 'Not found';
    end if;

    return response;
END
$$;


ALTER FUNCTION "public"."current_user_account_role"("account_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_invitation"("invitation_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
begin
    -- verify account owner for the invitation
    if basejump.has_role_on_account(
               (select account_id from basejump.invitations where id = delete_invitation.invitation_id), 'owner') <>
       true then
        raise exception 'Only account owners can delete invitations';
    end if;

    delete from basejump.invitations where id = delete_invitation.invitation_id;
end
$$;


ALTER FUNCTION "public"."delete_invitation"("invitation_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account"("account_id" "uuid") RETURNS json
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
BEGIN
    -- check if the user is a member of the account or a service_role user
    if current_user IN ('anon', 'authenticated') and
       (select current_user_account_role(get_account.account_id) ->> 'account_role' IS NULL) then
        raise exception 'You must be a member of an account to access it';
    end if;


    return (select json_build_object(
                           'account_id', a.id,
                           'account_role', wu.account_role,
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
            from basejump.accounts a
                     left join basejump.account_user wu on a.id = wu.account_id and wu.user_id = auth.uid()
                     join basejump.config config on true
                     left join (select bs.account_id, status
                                from basejump.billing_subscriptions bs
                                where bs.account_id = get_account.account_id
                                order by created desc
                                limit 1) bs on bs.account_id = a.id
            where a.id = get_account.account_id);
END;
$$;


ALTER FUNCTION "public"."get_account"("account_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_billing_status"("account_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'basejump'
    AS $$
DECLARE
    result      jsonb;
    role_result jsonb;
BEGIN
    select public.current_user_account_role(get_account_billing_status.account_id) into role_result;

    select jsonb_build_object(
                   'account_id', get_account_billing_status.account_id,
                   'billing_subscription_id', s.id,
                   'billing_enabled', case
                                          when a.personal_account = true then config.enable_personal_account_billing
                                          else config.enable_team_account_billing end,
                   'billing_status', s.status,
                   'billing_customer_id', c.id,
                   'billing_provider', config.billing_provider,
                   'billing_email',
                   coalesce(c.email, u.email) -- if we don't have a customer email, use the user's email as a fallback
               )
    into result
    from basejump.accounts a
             join auth.users u on u.id = a.primary_owner_user_id
             left join basejump.billing_subscriptions s on s.account_id = a.id
             left join basejump.billing_customers c on c.account_id = coalesce(s.account_id, a.id)
             join basejump.config config on true
    where a.id = get_account_billing_status.account_id
    order by s.created desc
    limit 1;

    return result || role_result;
END;
$$;


ALTER FUNCTION "public"."get_account_billing_status"("account_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_by_slug"("slug" "text") RETURNS json
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
DECLARE
    internal_account_id uuid;
BEGIN
    select a.id
    into internal_account_id
    from basejump.accounts a
    where a.slug IS NOT NULL
      and a.slug = get_account_by_slug.slug;

    return public.get_account(internal_account_id);
END;
$$;


ALTER FUNCTION "public"."get_account_by_slug"("slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_id"("slug" "text") RETURNS "uuid"
    LANGUAGE "sql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
select id
from basejump.accounts
where slug = get_account_id.slug;
$$;


ALTER FUNCTION "public"."get_account_id"("slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer DEFAULT 25, "results_offset" integer DEFAULT 0) RETURNS json
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
BEGIN
    -- only account owners can access this function
    if (select public.current_user_account_role(get_account_invitations.account_id) ->> 'account_role' <> 'owner') then
        raise exception 'Only account owners can access this function';
    end if;

    return (select json_agg(
                           json_build_object(
                                   'account_role', i.account_role,
                                   'created_at', i.created_at,
                                   'invitation_type', i.invitation_type,
                                   'invitation_id', i.id
                               )
                       )
            from basejump.invitations i
            where i.account_id = get_account_invitations.account_id
              and i.created_at > now() - interval '24 hours'
            limit coalesce(get_account_invitations.results_limit, 25) offset coalesce(get_account_invitations.results_offset, 0));
END;
$$;


ALTER FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer, "results_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer DEFAULT 50, "results_offset" integer DEFAULT 0) RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'basejump'
    AS $$
BEGIN

    -- only account owners can access this function
    if (select public.current_user_account_role(get_account_members.account_id) ->> 'account_role' <> 'owner') then
        raise exception 'Only account owners can access this function';
    end if;

    return (select json_agg(
                           json_build_object(
                                   'user_id', wu.user_id,
                                   'account_role', wu.account_role,
                                   'name', p.name,
                                   'email', u.email,
                                   'is_primary_owner', a.primary_owner_user_id = wu.user_id
                               )
                       )
            from basejump.account_user wu
                     join basejump.accounts a on a.id = wu.account_id
                     join basejump.accounts p on p.primary_owner_user_id = wu.user_id and p.personal_account = true
                     join auth.users u on u.id = wu.user_id
            where wu.account_id = get_account_members.account_id
            limit coalesce(get_account_members.results_limit, 50) offset coalesce(get_account_members.results_offset, 0));
END;
$$;


ALTER FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer, "results_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_accounts"() RETURNS json
    LANGUAGE "sql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
select coalesce(json_agg(
                        json_build_object(
                                'account_id', wu.account_id,
                                'account_role', wu.account_role,
                                'is_primary_owner', a.primary_owner_user_id = auth.uid(),
                                'name', a.name,
                                'slug', a.slug,
                                'personal_account', a.personal_account,
                                'created_at', a.created_at,
                                'updated_at', a.updated_at
                            )
                    ), '[]'::json)
from basejump.account_user wu
         join basejump.accounts a on a.id = wu.account_id
where wu.user_id = auth.uid();
$$;


ALTER FUNCTION "public"."get_accounts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_personal_account"() RETURNS json
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
BEGIN
    return public.get_account(auth.uid());
END;
$$;


ALTER FUNCTION "public"."get_personal_account"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."handle_updated_at"() IS 'Trigger: Generic updated_at timestamp updater';



CREATE OR REPLACE FUNCTION "public"."is_admin"("jwt" "jsonb" DEFAULT "auth"."jwt"()) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
    -- You can customize this logic based on your admin definition
    RETURN jwt ? 'is_admin';
END;
$$;


ALTER FUNCTION "public"."is_admin"("jwt" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'basejump'
    AS $$
declare
    name              text;
    invitation_active boolean;
begin
    select account_name,
           case when id IS NOT NULL then true else false end as active
    into name, invitation_active
    from basejump.invitations
    where token = lookup_invitation_token
      and created_at > now() - interval '24 hours'
    limit 1;
    return json_build_object('active', coalesce(invitation_active, false), 'account_name', name);
end;
$$;


ALTER FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."parse_name"("full_name" "text") RETURNS TABLE("first_name" "text", "last_name" "text")
    LANGUAGE "plpgsql" IMMUTABLE
    SET "search_path" TO ''
    AS $$
BEGIN
    IF full_name IS NULL OR full_name = '' THEN
        RETURN QUERY SELECT NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        trim(split_part(full_name, ' ', 1)),
        CASE
            WHEN position(' ' in full_name) > 0
            THEN trim(substring(full_name from position(' ' in full_name)))
            ELSE NULL
        END;
END;
$$;


ALTER FUNCTION "public"."parse_name"("full_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
BEGIN
    -- only account owners can access this function
    if basejump.has_role_on_account(remove_account_member.account_id, 'owner') <> true then
        raise exception 'Only account owners can access this function';
    end if;

    delete
    from basejump.account_user wu
    where wu.account_id = remove_account_member.account_id
      and wu.user_id = remove_account_member.user_id;
END;
$$;


ALTER FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."service_role_upsert_customer_subscription"("account_id" "uuid", "customer" "jsonb" DEFAULT NULL::"jsonb", "subscription" "jsonb" DEFAULT NULL::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
BEGIN
    -- if the customer is not null, upsert the data into billing_customers, only upsert fields that are present in the jsonb object
    if customer is not null then
        insert into basejump.billing_customers (id, account_id, email, provider)
        values (customer ->> 'id', service_role_upsert_customer_subscription.account_id, customer ->> 'billing_email',
                (customer ->> 'provider'))
        on conflict (id) do update
            set email = customer ->> 'billing_email';
    end if;

    -- if the subscription is not null, upsert the data into billing_subscriptions, only upsert fields that are present in the jsonb object
    if subscription is not null then
        insert into basejump.billing_subscriptions (id, account_id, billing_customer_id, status, metadata, price_id,
                                                    quantity, cancel_at_period_end, created, current_period_start,
                                                    current_period_end, ended_at, cancel_at, canceled_at, trial_start,
                                                    trial_end, plan_name, provider)
        values (subscription ->> 'id', service_role_upsert_customer_subscription.account_id,
                subscription ->> 'billing_customer_id', (subscription ->> 'status')::basejump.subscription_status,
                subscription -> 'metadata',
                subscription ->> 'price_id', (subscription ->> 'quantity')::int,
                (subscription ->> 'cancel_at_period_end')::boolean,
                (subscription ->> 'created')::timestamptz, (subscription ->> 'current_period_start')::timestamptz,
                (subscription ->> 'current_period_end')::timestamptz, (subscription ->> 'ended_at')::timestamptz,
                (subscription ->> 'cancel_at')::timestamptz,
                (subscription ->> 'canceled_at')::timestamptz, (subscription ->> 'trial_start')::timestamptz,
                (subscription ->> 'trial_end')::timestamptz,
                subscription ->> 'plan_name', (subscription ->> 'provider'))
        on conflict (id) do update
            set billing_customer_id  = subscription ->> 'billing_customer_id',
                status               = (subscription ->> 'status')::basejump.subscription_status,
                metadata             = subscription -> 'metadata',
                price_id             = subscription ->> 'price_id',
                quantity             = (subscription ->> 'quantity')::int,
                cancel_at_period_end = (subscription ->> 'cancel_at_period_end')::boolean,
                current_period_start = (subscription ->> 'current_period_start')::timestamptz,
                current_period_end   = (subscription ->> 'current_period_end')::timestamptz,
                ended_at             = (subscription ->> 'ended_at')::timestamptz,
                cancel_at            = (subscription ->> 'cancel_at')::timestamptz,
                canceled_at          = (subscription ->> 'canceled_at')::timestamptz,
                trial_start          = (subscription ->> 'trial_start')::timestamptz,
                trial_end            = (subscription ->> 'trial_end')::timestamptz,
                plan_name            = subscription ->> 'plan_name';
    end if;
end;
$$;


ALTER FUNCTION "public"."service_role_upsert_customer_subscription"("account_id" "uuid", "customer" "jsonb", "subscription" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text" DEFAULT NULL::"text", "name" "text" DEFAULT NULL::"text", "public_metadata" "jsonb" DEFAULT NULL::"jsonb", "replace_metadata" boolean DEFAULT false) RETURNS json
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'basejump'
    AS $$
BEGIN

    -- check if postgres role is service_role
    if current_user IN ('anon', 'authenticated') and
       not (select current_user_account_role(update_account.account_id) ->> 'account_role' = 'owner') then
        raise exception 'Only account owners can update an account';
    end if;

    update basejump.accounts accounts
    set slug            = coalesce(update_account.slug, accounts.slug),
        name            = coalesce(update_account.name, accounts.name),
        public_metadata = case
                              when update_account.public_metadata is null then accounts.public_metadata -- do nothing
                              when accounts.public_metadata IS NULL then update_account.public_metadata -- set metadata
                              when update_account.replace_metadata
                                  then update_account.public_metadata -- replace metadata
                              else accounts.public_metadata || update_account.public_metadata end -- merge metadata
    where accounts.id = update_account.account_id;

    return public.get_account(account_id);
END;
$$;


ALTER FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text", "name" "text", "public_metadata" "jsonb", "replace_metadata" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_account_user_role"("account_id" "uuid", "user_id" "uuid", "new_account_role" "basejump"."account_role", "make_primary_owner" boolean DEFAULT false) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
    is_account_owner         boolean;
    is_account_primary_owner boolean;
    changing_primary_owner   boolean;
begin
    -- check if the user is an owner, and if they are, allow them to update the role
    select basejump.has_role_on_account(update_account_user_role.account_id, 'owner') into is_account_owner;

    if not is_account_owner then
        raise exception 'You must be an owner of the account to update a users role';
    end if;

    -- check if the user being changed is the primary owner, if so its not allowed
    select primary_owner_user_id = auth.uid(), primary_owner_user_id = update_account_user_role.user_id
    into is_account_primary_owner, changing_primary_owner
    from basejump.accounts
    where id = update_account_user_role.account_id;

    if changing_primary_owner = true and is_account_primary_owner = false then
        raise exception 'You must be the primary owner of the account to change the primary owner';
    end if;

    update basejump.account_user au
    set account_role = new_account_role
    where au.account_id = update_account_user_role.account_id
      and au.user_id = update_account_user_role.user_id;

    if make_primary_owner = true then
        -- first we see if the current user is the owner, only they can do this
        if is_account_primary_owner = false then
            raise exception 'You must be the primary owner of the account to change the primary owner';
        end if;

        update basejump.accounts
        set primary_owner_user_id = update_account_user_role.user_id
        where id = update_account_user_role.account_id;
    end if;
end;
$$;


ALTER FUNCTION "public"."update_account_user_role"("account_id" "uuid", "user_id" "uuid", "new_account_role" "basejump"."account_role", "make_primary_owner" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_checks_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_checks_updated_at"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_checks_updated_at"() IS 'Trigger: Updates updated_at timestamp on checks table';



CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_updated_at_column"() IS 'Trigger: Generic updated_at timestamp updater';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "basejump"."account_user" (
    "user_id" "uuid" NOT NULL,
    "account_id" "uuid" NOT NULL,
    "account_role" "basejump"."account_role" NOT NULL
);


ALTER TABLE "basejump"."account_user" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "basejump"."accounts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "primary_owner_user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "name" "text",
    "slug" "text",
    "personal_account" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "created_by" "uuid",
    "updated_by" "uuid",
    "private_metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "public_metadata" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "basejump_accounts_slug_null_if_personal_account_true" CHECK (((("personal_account" = true) AND ("slug" IS NULL)) OR (("personal_account" = false) AND ("slug" IS NOT NULL))))
);


ALTER TABLE "basejump"."accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "basejump"."billing_customers" (
    "account_id" "uuid" NOT NULL,
    "id" "text" NOT NULL,
    "email" "text",
    "active" boolean,
    "provider" "text"
);


ALTER TABLE "basejump"."billing_customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "basejump"."billing_subscriptions" (
    "id" "text" NOT NULL,
    "account_id" "uuid" NOT NULL,
    "billing_customer_id" "text" NOT NULL,
    "status" "basejump"."subscription_status",
    "metadata" "jsonb",
    "price_id" "text",
    "plan_name" "text",
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_period_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_period_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "ended_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "cancel_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "canceled_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "provider" "text"
);


ALTER TABLE "basejump"."billing_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "basejump"."config" (
    "enable_team_accounts" boolean DEFAULT true,
    "enable_personal_account_billing" boolean DEFAULT true,
    "enable_team_account_billing" boolean DEFAULT true,
    "billing_provider" "text" DEFAULT 'stripe'::"text"
);


ALTER TABLE "basejump"."config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "basejump"."invitations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_role" "basejump"."account_role" NOT NULL,
    "account_id" "uuid" NOT NULL,
    "token" "text" DEFAULT "basejump"."generate_token"(30) NOT NULL,
    "invited_by_user_id" "uuid" NOT NULL,
    "account_name" "text",
    "updated_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "invitation_type" "basejump"."invitation_type" NOT NULL
);


ALTER TABLE "basejump"."invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Page" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "url" "text" NOT NULL,
    "website_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "path" "text" NOT NULL,
    "normalized_url" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."Page" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Scan" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "page_id" "uuid" NOT NULL,
    "status" "public"."ScanStatus" DEFAULT 'pending'::"public"."ScanStatus" NOT NULL,
    "metrics" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "screenshot_light" "text",
    "screenshot_dark" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "normalized_url" "text" DEFAULT ''::"text" NOT NULL,
    "url" "text" DEFAULT ''::"text" NOT NULL,
    "scan_type" "text" DEFAULT 'axe_core'::"text" NOT NULL,
    "scope" "text" DEFAULT 'full_page'::"text" NOT NULL,
    CONSTRAINT "scan_normalized_url_check" CHECK (("normalized_url" <> ''::"text")),
    CONSTRAINT "scan_type_check" CHECK (("scan_type" = ANY (ARRAY['axe_core'::"text", 'allystudio'::"text", 'hybrid'::"text"]))),
    CONSTRAINT "scan_url_check" CHECK (("url" <> ''::"text")),
    CONSTRAINT "scope_check" CHECK (("scope" = ANY (ARRAY['full_page'::"text", 'links'::"text", 'headings'::"text", 'forms'::"text", 'images'::"text", 'interactive'::"text", 'custom'::"text"])))
);


ALTER TABLE "public"."Scan" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Space" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_personal" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."Space" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Website" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "url" "text" NOT NULL,
    "space_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "theme" "public"."DomainTheme" DEFAULT 'LIGHT'::"public"."DomainTheme" NOT NULL,
    "user_id" "uuid",
    "normalized_url" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."Website" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."act_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rule_id" character varying(100) NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "categories" "public"."act_rule_category"[] DEFAULT '{}'::"public"."act_rule_category"[] NOT NULL,
    "input_aspects" "text"[] DEFAULT ARRAY['DOM Tree'::"text"] NOT NULL,
    "implementation_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    CONSTRAINT "act_rules_implementation_url_format" CHECK ((("implementation_url" ~ '^https?://.*'::"text") OR ("implementation_url" IS NULL))),
    CONSTRAINT "act_rules_rule_id_format" CHECK ((("rule_id")::"text" ~ '^[a-z0-9-]+$'::"text"))
);


ALTER TABLE "public"."act_rules" OWNER TO "postgres";


COMMENT ON TABLE "public"."act_rules" IS 'Reference table: ACT (Accessibility Conformance Testing) rules with WCAG mappings - read-only for authenticated users';



COMMENT ON COLUMN "public"."act_rules"."rule_id" IS 'Unique identifier matching AllyStudio extension rule IDs';



COMMENT ON COLUMN "public"."act_rules"."categories" IS 'Categories for organizing rules (images, headings, links, etc.)';



CREATE TABLE IF NOT EXISTS "public"."checks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "program_id" "uuid" NOT NULL,
    "control_id" "text" NOT NULL,
    "check_type" "text" NOT NULL,
    "integration_id" "uuid",
    "status" "text" NOT NULL,
    "last_checked_at" timestamp with time zone,
    "result_data" "jsonb" DEFAULT '{}'::"jsonb",
    "checked_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "checks_check" CHECK (((("check_type" = 'automated'::"text") AND ("integration_id" IS NOT NULL) AND ("checked_by" IS NULL)) OR (("check_type" = 'manual'::"text") AND ("integration_id" IS NULL) AND ("checked_by" IS NOT NULL)))),
    CONSTRAINT "checks_check_type_check" CHECK (("check_type" = ANY (ARRAY['automated'::"text", 'manual'::"text"]))),
    CONSTRAINT "checks_status_check" CHECK (("status" = ANY (ARRAY['pass'::"text", 'fail'::"text", 'warning'::"text", 'not_checked'::"text", 'pending'::"text"])))
);


ALTER TABLE "public"."checks" OWNER TO "postgres";


COMMENT ON TABLE "public"."checks" IS 'Unified check results: stores both manual and automated check results';



CREATE TABLE IF NOT EXISTS "public"."controls" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "id_format_valid" CHECK (("id" ~ '^[A-Z]+(-[A-Z0-9]+)+$'::"text"))
);


ALTER TABLE "public"."controls" OWNER TO "postgres";


COMMENT ON TABLE "public"."controls" IS 'Universal atomic compliance checks that can be reused across multiple frameworks';



COMMENT ON COLUMN "public"."controls"."id" IS 'Human-readable stable identifier (e.g., AX-ANIM-01 for accessibility animation control, CIS-001 for CIS control 1)';



COMMENT ON COLUMN "public"."controls"."name" IS 'Human-readable name of the control';



COMMENT ON COLUMN "public"."controls"."description" IS 'Detailed description of what this control checks for';



CREATE TABLE IF NOT EXISTS "public"."program_controls" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "program_id" "uuid" NOT NULL,
    "control_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."program_controls" OWNER TO "postgres";


COMMENT ON TABLE "public"."program_controls" IS 'Program checklist: auto-created when a program starts - one row per required control';



CREATE OR REPLACE VIEW "public"."assessments" WITH ("security_invoker"='true') AS
 SELECT "pc"."program_id",
    "pc"."control_id",
    "c"."name" AS "control_name",
    "c"."description" AS "control_description",
        CASE
            WHEN (EXISTS ( SELECT 1
               FROM "public"."checks" "chk_1"
              WHERE (("chk_1"."check_type" = 'manual'::"text") AND ("chk_1"."program_id" = "pc"."program_id") AND ("chk_1"."control_id" = "pc"."control_id")))) THEN ( SELECT "chk_1"."status"
               FROM "public"."checks" "chk_1"
              WHERE (("chk_1"."check_type" = 'manual'::"text") AND ("chk_1"."program_id" = "pc"."program_id") AND ("chk_1"."control_id" = "pc"."control_id"))
              ORDER BY "chk_1"."last_checked_at" DESC
             LIMIT 1)
            WHEN (EXISTS ( SELECT 1
               FROM "public"."checks" "chk_1"
              WHERE (("chk_1"."status" = 'fail'::"text") AND ("chk_1"."program_id" = "pc"."program_id") AND ("chk_1"."control_id" = "pc"."control_id")))) THEN 'fail'::"text"
            WHEN ((EXISTS ( SELECT 1
               FROM "public"."checks" "chk_1"
              WHERE (("chk_1"."status" = 'pass'::"text") AND ("chk_1"."program_id" = "pc"."program_id") AND ("chk_1"."control_id" = "pc"."control_id")))) AND (NOT (EXISTS ( SELECT 1
               FROM "public"."checks" "chk_1"
              WHERE (("chk_1"."status" = ANY (ARRAY['fail'::"text", 'warning'::"text"])) AND ("chk_1"."program_id" = "pc"."program_id") AND ("chk_1"."control_id" = "pc"."control_id")))))) THEN 'pass'::"text"
            WHEN (EXISTS ( SELECT 1
               FROM "public"."checks" "chk_1"
              WHERE (("chk_1"."program_id" = "pc"."program_id") AND ("chk_1"."control_id" = "pc"."control_id")))) THEN 'warning'::"text"
            ELSE 'not_started'::"text"
        END AS "status",
    "jsonb_build_object"('total_checks', "count"("chk"."id"), 'passing_checks', "count"(*) FILTER (WHERE ("chk"."status" = 'pass'::"text")), 'failing_checks', "count"(*) FILTER (WHERE ("chk"."status" = 'fail'::"text")), 'last_checked', "max"("chk"."last_checked_at")) AS "summary",
    "max"("chk"."last_checked_at") AS "last_checked_at"
   FROM (("public"."program_controls" "pc"
     JOIN "public"."controls" "c" ON (("c"."id" = "pc"."control_id")))
     LEFT JOIN "public"."checks" "chk" ON ((("chk"."program_id" = "pc"."program_id") AND ("chk"."control_id" = "pc"."control_id"))))
  GROUP BY "pc"."program_id", "pc"."control_id", "c"."name", "c"."description";


ALTER VIEW "public"."assessments" OWNER TO "postgres";


COMMENT ON VIEW "public"."assessments" IS 'Aggregated view: combines program_controls + checks to show current status. Uses security_invoker to respect RLS policies.';



CREATE TABLE IF NOT EXISTS "public"."framework_controls" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "framework_id" "text" NOT NULL,
    "control_id" "text" NOT NULL,
    "requirement_number" "text",
    "requirement_text" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."framework_controls" OWNER TO "postgres";


COMMENT ON TABLE "public"."framework_controls" IS 'Junction table mapping which controls satisfy which framework requirements (many-to-many relationship)';



COMMENT ON COLUMN "public"."framework_controls"."framework_id" IS 'Reference to the compliance framework (e.g., SOC2, GDPR, ISO27001)';



COMMENT ON COLUMN "public"."framework_controls"."control_id" IS 'Reference to the atomic control that satisfies this requirement';



COMMENT ON COLUMN "public"."framework_controls"."requirement_number" IS 'Framework-specific requirement identifier (e.g., SOC2-CC6.1, ISO-A.9.2.1)';



COMMENT ON COLUMN "public"."framework_controls"."requirement_text" IS 'Framework-specific description or interpretation of the requirement';



CREATE TABLE IF NOT EXISTS "public"."frameworks" (
    "id" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "shorthand_name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "jurisdiction" "text" NOT NULL,
    "countries_active" "text"[] DEFAULT '{}'::"text"[],
    "status" "text" NOT NULL,
    "compliance_type" "text" NOT NULL,
    "has_penalties" boolean DEFAULT false,
    "max_penalty" "text",
    "official_url" "text" NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."frameworks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."integrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "integration_type" "text" NOT NULL,
    "name" "text" NOT NULL,
    "config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "error_message" "text",
    "scan_schedule" "text",
    "last_checked_at" timestamp with time zone,
    "next_check_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "integration_type_valid" CHECK (("integration_type" = ANY (ARRAY['supabase'::"text", 'slack'::"text", 'github'::"text", 'vercel'::"text", 'netlify'::"text", 'aws'::"text", 'google_workspace'::"text", 'azure'::"text", 'cloudflare'::"text", 'website'::"text"]))),
    CONSTRAINT "status_valid" CHECK (("status" = ANY (ARRAY['active'::"text", 'error'::"text", 'paused'::"text", 'disconnected'::"text"])))
);


ALTER TABLE "public"."integrations" OWNER TO "postgres";


COMMENT ON TABLE "public"."integrations" IS 'OAuth connections and encrypted credentials for third-party services';



COMMENT ON COLUMN "public"."integrations"."account_id" IS 'References Basejump account (organization)';



COMMENT ON COLUMN "public"."integrations"."integration_type" IS 'Type: supabase, slack, github, etc';



COMMENT ON COLUMN "public"."integrations"."config" IS 'Encrypted credentials (access_token, refresh_token) and metadata';



COMMENT ON COLUMN "public"."integrations"."scan_schedule" IS 'Cron expression for automated scanning';



CREATE TABLE IF NOT EXISTS "public"."programs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "framework_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."programs" OWNER TO "postgres";


COMMENT ON TABLE "public"."programs" IS 'Certification programs: tracks which frameworks each organization/account is implementing';



ALTER TABLE ONLY "basejump"."account_user"
    ADD CONSTRAINT "account_user_pkey" PRIMARY KEY ("user_id", "account_id");



ALTER TABLE ONLY "basejump"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "basejump"."accounts"
    ADD CONSTRAINT "accounts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "basejump"."billing_customers"
    ADD CONSTRAINT "billing_customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "basejump"."billing_subscriptions"
    ADD CONSTRAINT "billing_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "basejump"."invitations"
    ADD CONSTRAINT "invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "basejump"."invitations"
    ADD CONSTRAINT "invitations_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."Website"
    ADD CONSTRAINT "Domain_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Website"
    ADD CONSTRAINT "Domain_space_id_name_key" UNIQUE ("space_id", "url");



ALTER TABLE ONLY "public"."Page"
    ADD CONSTRAINT "Page_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Page"
    ADD CONSTRAINT "Page_website_id_url_key" UNIQUE ("website_id", "url");



ALTER TABLE ONLY "public"."Scan"
    ADD CONSTRAINT "Scan_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Space"
    ADD CONSTRAINT "Space_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."act_rules"
    ADD CONSTRAINT "act_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."act_rules"
    ADD CONSTRAINT "act_rules_rule_id_key" UNIQUE ("rule_id");



ALTER TABLE ONLY "public"."checks"
    ADD CONSTRAINT "checks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."controls"
    ADD CONSTRAINT "controls_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."framework_controls"
    ADD CONSTRAINT "framework_controls_framework_id_control_id_key" UNIQUE ("framework_id", "control_id");



ALTER TABLE ONLY "public"."framework_controls"
    ADD CONSTRAINT "framework_controls_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."frameworks"
    ADD CONSTRAINT "frameworks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Page"
    ADD CONSTRAINT "page_normalized_url_website_unique" UNIQUE ("website_id", "normalized_url");



ALTER TABLE ONLY "public"."program_controls"
    ADD CONSTRAINT "program_controls_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."program_controls"
    ADD CONSTRAINT "program_controls_program_id_control_id_key" UNIQUE ("program_id", "control_id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_account_id_framework_id_key" UNIQUE ("account_id", "framework_id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Website"
    ADD CONSTRAINT "website_normalized_url_space_unique" UNIQUE ("normalized_url", "space_id");



CREATE INDEX "idx_controls_id" ON "public"."controls" USING "btree" ("id");



CREATE INDEX "idx_integrations_organization" ON "public"."integrations" USING "btree" ("account_id");



CREATE UNIQUE INDEX "idx_page_website_normalized_url" ON "public"."Page" USING "btree" ("website_id", "normalized_url") WHERE ("normalized_url" IS NOT NULL);



CREATE UNIQUE INDEX "idx_page_website_path" ON "public"."Page" USING "btree" ("website_id", "path");



CREATE UNIQUE INDEX "idx_website_url_space" ON "public"."Website" USING "btree" ("url", "space_id");



CREATE INDEX "scan_normalized_url_idx" ON "public"."Scan" USING "btree" ("normalized_url");



CREATE OR REPLACE TRIGGER "basejump_add_current_user_to_new_account" AFTER INSERT ON "basejump"."accounts" FOR EACH ROW EXECUTE FUNCTION "basejump"."add_current_user_to_new_account"();



CREATE OR REPLACE TRIGGER "basejump_protect_account_fields" BEFORE UPDATE ON "basejump"."accounts" FOR EACH ROW EXECUTE FUNCTION "basejump"."protect_account_fields"();



CREATE OR REPLACE TRIGGER "basejump_set_accounts_timestamp" BEFORE INSERT OR UPDATE ON "basejump"."accounts" FOR EACH ROW EXECUTE FUNCTION "basejump"."trigger_set_timestamps"();



CREATE OR REPLACE TRIGGER "basejump_set_accounts_user_tracking" BEFORE INSERT OR UPDATE ON "basejump"."accounts" FOR EACH ROW EXECUTE FUNCTION "basejump"."trigger_set_user_tracking"();



CREATE OR REPLACE TRIGGER "basejump_set_invitations_timestamp" BEFORE INSERT OR UPDATE ON "basejump"."invitations" FOR EACH ROW EXECUTE FUNCTION "basejump"."trigger_set_timestamps"();



CREATE OR REPLACE TRIGGER "basejump_slugify_account_slug" BEFORE INSERT OR UPDATE ON "basejump"."accounts" FOR EACH ROW EXECUTE FUNCTION "basejump"."slugify_account_slug"();



CREATE OR REPLACE TRIGGER "basejump_trigger_set_invitation_details" BEFORE INSERT ON "basejump"."invitations" FOR EACH ROW EXECUTE FUNCTION "basejump"."trigger_set_invitation_details"();



CREATE OR REPLACE TRIGGER "checks_updated_at" BEFORE UPDATE ON "public"."checks" FOR EACH ROW EXECUTE FUNCTION "public"."update_checks_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."Page" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_act_rules_updated_at" BEFORE UPDATE ON "public"."act_rules" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_controls_updated_at" BEFORE UPDATE ON "public"."controls" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_framework_controls_updated_at" BEFORE UPDATE ON "public"."framework_controls" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_frameworks_updated_at" BEFORE UPDATE ON "public"."frameworks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_integrations_updated_at" BEFORE UPDATE ON "public"."integrations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "basejump"."account_user"
    ADD CONSTRAINT "account_user_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "basejump"."accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "basejump"."account_user"
    ADD CONSTRAINT "account_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "basejump"."accounts"
    ADD CONSTRAINT "accounts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "basejump"."accounts"
    ADD CONSTRAINT "accounts_primary_owner_user_id_fkey" FOREIGN KEY ("primary_owner_user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "basejump"."accounts"
    ADD CONSTRAINT "accounts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "basejump"."billing_customers"
    ADD CONSTRAINT "billing_customers_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "basejump"."accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "basejump"."billing_subscriptions"
    ADD CONSTRAINT "billing_subscriptions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "basejump"."accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "basejump"."billing_subscriptions"
    ADD CONSTRAINT "billing_subscriptions_billing_customer_id_fkey" FOREIGN KEY ("billing_customer_id") REFERENCES "basejump"."billing_customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "basejump"."invitations"
    ADD CONSTRAINT "invitations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "basejump"."accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "basejump"."invitations"
    ADD CONSTRAINT "invitations_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."Website"
    ADD CONSTRAINT "Domain_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."Space"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Page"
    ADD CONSTRAINT "Page_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."Website"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Scan"
    ADD CONSTRAINT "Scan_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."Page"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Space"
    ADD CONSTRAINT "Space_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."Website"
    ADD CONSTRAINT "Website_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."checks"
    ADD CONSTRAINT "checks_checked_by_fkey" FOREIGN KEY ("checked_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."checks"
    ADD CONSTRAINT "checks_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "public"."controls"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checks"
    ADD CONSTRAINT "checks_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checks"
    ADD CONSTRAINT "checks_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."framework_controls"
    ADD CONSTRAINT "framework_controls_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "public"."controls"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."framework_controls"
    ADD CONSTRAINT "framework_controls_framework_id_fkey" FOREIGN KEY ("framework_id") REFERENCES "public"."frameworks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "basejump"."accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_controls"
    ADD CONSTRAINT "program_controls_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "public"."controls"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."program_controls"
    ADD CONSTRAINT "program_controls_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "basejump"."accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_framework_id_fkey" FOREIGN KEY ("framework_id") REFERENCES "public"."frameworks"("id") ON DELETE CASCADE;



CREATE POLICY "Account users can be deleted by owners except primary account o" ON "basejump"."account_user" FOR DELETE TO "authenticated" USING ((("basejump"."has_role_on_account"("account_id", 'owner'::"basejump"."account_role") = true) AND ("user_id" <> ( SELECT "accounts"."primary_owner_user_id"
   FROM "basejump"."accounts"
  WHERE ("account_user"."account_id" = "accounts"."id")))));



CREATE POLICY "Accounts are viewable by members" ON "basejump"."accounts" FOR SELECT TO "authenticated" USING (("basejump"."has_role_on_account"("id") = true));



CREATE POLICY "Accounts are viewable by primary owner" ON "basejump"."accounts" FOR SELECT TO "authenticated" USING (("primary_owner_user_id" = ( SELECT "auth"."uid"() AS "uid")));



COMMENT ON POLICY "Accounts are viewable by primary owner" ON "basejump"."accounts" IS 'Optimized RLS: uses SELECT wrapper to prevent InitPlan anti-pattern';



CREATE POLICY "Accounts can be edited by owners" ON "basejump"."accounts" FOR UPDATE TO "authenticated" USING (("basejump"."has_role_on_account"("id", 'owner'::"basejump"."account_role") = true));



CREATE POLICY "Basejump settings can be read by authenticated users" ON "basejump"."config" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Can only view own billing customer data." ON "basejump"."billing_customers" FOR SELECT USING (("basejump"."has_role_on_account"("account_id") = true));



CREATE POLICY "Can only view own billing subscription data." ON "basejump"."billing_subscriptions" FOR SELECT USING (("basejump"."has_role_on_account"("account_id") = true));



CREATE POLICY "Invitations can be created by account owners" ON "basejump"."invitations" FOR INSERT TO "authenticated" WITH CHECK ((("basejump"."is_set"('enable_team_accounts'::"text") = true) AND (( SELECT "accounts"."personal_account"
   FROM "basejump"."accounts"
  WHERE ("accounts"."id" = "invitations"."account_id")) = false) AND ("basejump"."has_role_on_account"("account_id", 'owner'::"basejump"."account_role") = true)));



CREATE POLICY "Invitations can be deleted by account owners" ON "basejump"."invitations" FOR DELETE TO "authenticated" USING (("basejump"."has_role_on_account"("account_id", 'owner'::"basejump"."account_role") = true));



CREATE POLICY "Invitations viewable by account owners" ON "basejump"."invitations" FOR SELECT TO "authenticated" USING ((("created_at" > ("now"() - '24:00:00'::interval)) AND ("basejump"."has_role_on_account"("account_id", 'owner'::"basejump"."account_role") = true)));



CREATE POLICY "Team accounts can be created by any user" ON "basejump"."accounts" FOR INSERT TO "authenticated" WITH CHECK ((("basejump"."is_set"('enable_team_accounts'::"text") = true) AND ("personal_account" = false)));



ALTER TABLE "basejump"."account_user" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "basejump"."accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "basejump"."billing_customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "basejump"."billing_subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "basejump"."config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "basejump"."invitations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users can view their own account_users" ON "basejump"."account_user" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



COMMENT ON POLICY "users can view their own account_users" ON "basejump"."account_user" IS 'Optimized RLS: uses SELECT wrapper to prevent InitPlan anti-pattern';



CREATE POLICY "users can view their teammates" ON "basejump"."account_user" FOR SELECT TO "authenticated" USING (("basejump"."has_role_on_account"("account_id") = true));



CREATE POLICY "Account owners can create programs" ON "public"."programs" FOR INSERT TO "authenticated" WITH CHECK (("basejump"."has_role_on_account"("account_id", 'owner'::"basejump"."account_role") = true));



CREATE POLICY "Account owners can delete integrations" ON "public"."integrations" FOR DELETE TO "authenticated" USING (("basejump"."has_role_on_account"("account_id", 'owner'::"basejump"."account_role") = true));



CREATE POLICY "Account owners can delete programs" ON "public"."programs" FOR DELETE TO "authenticated" USING (("basejump"."has_role_on_account"("account_id", 'owner'::"basejump"."account_role") = true));



CREATE POLICY "Account owners can update integrations" ON "public"."integrations" FOR UPDATE TO "authenticated" USING (("basejump"."has_role_on_account"("account_id", 'owner'::"basejump"."account_role") = true));



CREATE POLICY "Account owners can update programs" ON "public"."programs" FOR UPDATE TO "authenticated" USING (("basejump"."has_role_on_account"("account_id", 'owner'::"basejump"."account_role") = true));



CREATE POLICY "Anyone can view ACT rules" ON "public"."act_rules" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Anyone can view controls" ON "public"."controls" FOR SELECT USING (true);



CREATE POLICY "Anyone can view framework control mappings" ON "public"."framework_controls" FOR SELECT USING (true);



CREATE POLICY "Anyone can view frameworks" ON "public"."frameworks" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can delete frameworks" ON "public"."frameworks" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can insert frameworks" ON "public"."frameworks" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can update frameworks" ON "public"."frameworks" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Owners can update their own spaces" ON "public"."Space" FOR UPDATE TO "authenticated" USING (("owner_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("owner_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."Page" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Scan" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Service role can create spaces" ON "public"."Space" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Service role can manage ACT rules" ON "public"."act_rules" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."Space" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Space members can delete pages" ON "public"."Page" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."Website" "w"
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("w"."id" = "Page"."website_id") AND ("s"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Space owners can create websites" ON "public"."Website" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."Space"
  WHERE (("Space"."id" = "Website"."space_id") AND ("Space"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Space owners can delete websites" ON "public"."Website" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."Space"
  WHERE (("Space"."id" = "Website"."space_id") AND ("Space"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Space owners can insert pages" ON "public"."Page" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."Website" "w"
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("w"."id" = "Page"."website_id") AND ("s"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Space owners can update pages" ON "public"."Page" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."Website" "w"
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("w"."id" = "Page"."website_id") AND ("s"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Space owners can update websites" ON "public"."Website" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."Space"
  WHERE (("Space"."id" = "Website"."space_id") AND ("Space"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Space owners can view pages" ON "public"."Page" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."Website" "w"
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("w"."id" = "Page"."website_id") AND ("s"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Space owners can view websites" ON "public"."Website" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."Space"
  WHERE (("Space"."id" = "Website"."space_id") AND ("Space"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can create integrations for their accounts" ON "public"."integrations" FOR INSERT TO "authenticated" WITH CHECK (("basejump"."has_role_on_account"("account_id") = true));



CREATE POLICY "Users can create scans for pages in their spaces" ON "public"."Scan" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM (("public"."Page" "p"
     JOIN "public"."Website" "w" ON (("p"."website_id" = "w"."id")))
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("p"."id" = "Scan"."page_id") AND ("s"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can create their own spaces" ON "public"."Space" FOR INSERT TO "authenticated" WITH CHECK (("owner_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can delete their non-personal spaces" ON "public"."Space" FOR DELETE TO "authenticated" USING ((("owner_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("is_personal" = false)));



CREATE POLICY "Users can insert checks for their accounts" ON "public"."checks" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "checks"."program_id") AND ("basejump"."has_role_on_account"("p"."account_id") = true)))));



CREATE POLICY "Users can update checks for their accounts" ON "public"."checks" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "checks"."program_id") AND ("basejump"."has_role_on_account"("p"."account_id") = true)))));



CREATE POLICY "Users can view checks for their accounts" ON "public"."checks" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "checks"."program_id") AND ("basejump"."has_role_on_account"("p"."account_id") = true)))));



CREATE POLICY "Users can view integrations for their accounts" ON "public"."integrations" FOR SELECT TO "authenticated" USING (("basejump"."has_role_on_account"("account_id") = true));



COMMENT ON POLICY "Users can view integrations for their accounts" ON "public"."integrations" IS 'Optimized RLS: uses SELECT wrapper to prevent InitPlan anti-pattern';



CREATE POLICY "Users can view program_controls for their accounts" ON "public"."program_controls" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."programs" "p"
  WHERE (("p"."id" = "program_controls"."program_id") AND ("basejump"."has_role_on_account"("p"."account_id") = true)))));



CREATE POLICY "Users can view programs for their accounts" ON "public"."programs" FOR SELECT TO "authenticated" USING (("basejump"."has_role_on_account"("account_id") = true));



CREATE POLICY "Users can view scans for pages in their spaces" ON "public"."Scan" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM (("public"."Page" "p"
     JOIN "public"."Website" "w" ON (("p"."website_id" = "w"."id")))
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("p"."id" = "Scan"."page_id") AND ("s"."owner_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can view their own spaces" ON "public"."Space" FOR SELECT TO "authenticated" USING (("owner_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."Website" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."act_rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."checks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."controls" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."framework_controls" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."frameworks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."integrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."program_controls" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."programs" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Scan";



GRANT USAGE ON SCHEMA "basejump" TO "authenticated";
GRANT USAGE ON SCHEMA "basejump" TO "service_role";









REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";









REVOKE ALL ON FUNCTION "basejump"."add_current_user_to_new_account"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "basejump"."generate_token"("length" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "basejump"."generate_token"("length" integer) TO "authenticated";



REVOKE ALL ON FUNCTION "basejump"."get_accounts_with_role"("passed_in_role" "basejump"."account_role") FROM PUBLIC;
GRANT ALL ON FUNCTION "basejump"."get_accounts_with_role"("passed_in_role" "basejump"."account_role") TO "authenticated";



REVOKE ALL ON FUNCTION "basejump"."get_config"() FROM PUBLIC;
GRANT ALL ON FUNCTION "basejump"."get_config"() TO "authenticated";
GRANT ALL ON FUNCTION "basejump"."get_config"() TO "service_role";



REVOKE ALL ON FUNCTION "basejump"."has_role_on_account"("account_id" "uuid", "account_role" "basejump"."account_role") FROM PUBLIC;
GRANT ALL ON FUNCTION "basejump"."has_role_on_account"("account_id" "uuid", "account_role" "basejump"."account_role") TO "authenticated";



REVOKE ALL ON FUNCTION "basejump"."is_set"("field_name" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "basejump"."is_set"("field_name" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "basejump"."protect_account_fields"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "basejump"."run_new_user_setup"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "basejump"."slugify_account_slug"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "basejump"."trigger_set_invitation_details"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "basejump"."trigger_set_timestamps"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "basejump"."trigger_set_user_tracking"() FROM PUBLIC;












































































































































































































































































































































































































REVOKE ALL ON FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."accept_invitation"("lookup_invitation_token" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."create_account"("slug" "text", "name" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."create_account"("slug" "text", "name" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."create_account"("slug" "text", "name" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."create_invitation"("account_id" "uuid", "account_role" "basejump"."account_role", "invitation_type" "basejump"."invitation_type") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."create_invitation"("account_id" "uuid", "account_role" "basejump"."account_role", "invitation_type" "basejump"."invitation_type") TO "service_role";
GRANT ALL ON FUNCTION "public"."create_invitation"("account_id" "uuid", "account_role" "basejump"."account_role", "invitation_type" "basejump"."invitation_type") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."current_user_account_role"("account_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_account_role"("account_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."current_user_account_role"("account_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."delete_invitation"("invitation_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."delete_invitation"("invitation_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."delete_invitation"("invitation_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account"("account_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account"("account_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account"("account_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_billing_status"("account_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_billing_status"("account_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_billing_status"("account_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_by_slug"("slug" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_by_slug"("slug" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_by_slug"("slug" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_id"("slug" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_id"("slug" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_id"("slug" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer, "results_offset" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer, "results_offset" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_invitations"("account_id" "uuid", "results_limit" integer, "results_offset" integer) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer, "results_offset" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer, "results_offset" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."get_account_members"("account_id" "uuid", "results_limit" integer, "results_offset" integer) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_accounts"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_accounts"() TO "service_role";
GRANT ALL ON FUNCTION "public"."get_accounts"() TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_personal_account"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_personal_account"() TO "service_role";
GRANT ALL ON FUNCTION "public"."get_personal_account"() TO "authenticated";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"("jwt" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("jwt" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("jwt" "jsonb") TO "service_role";



REVOKE ALL ON FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."lookup_invitation"("lookup_invitation_token" "text") TO "authenticated";



GRANT ALL ON FUNCTION "public"."parse_name"("full_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."parse_name"("full_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."parse_name"("full_name" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."remove_account_member"("account_id" "uuid", "user_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."service_role_upsert_customer_subscription"("account_id" "uuid", "customer" "jsonb", "subscription" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."service_role_upsert_customer_subscription"("account_id" "uuid", "customer" "jsonb", "subscription" "jsonb") TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text", "name" "text", "public_metadata" "jsonb", "replace_metadata" boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text", "name" "text", "public_metadata" "jsonb", "replace_metadata" boolean) TO "service_role";
GRANT ALL ON FUNCTION "public"."update_account"("account_id" "uuid", "slug" "text", "name" "text", "public_metadata" "jsonb", "replace_metadata" boolean) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."update_account_user_role"("account_id" "uuid", "user_id" "uuid", "new_account_role" "basejump"."account_role", "make_primary_owner" boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_account_user_role"("account_id" "uuid", "user_id" "uuid", "new_account_role" "basejump"."account_role", "make_primary_owner" boolean) TO "service_role";
GRANT ALL ON FUNCTION "public"."update_account_user_role"("account_id" "uuid", "user_id" "uuid", "new_account_role" "basejump"."account_role", "make_primary_owner" boolean) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."update_checks_updated_at"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_checks_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";












GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "basejump"."account_user" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "basejump"."account_user" TO "service_role";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "basejump"."accounts" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "basejump"."accounts" TO "service_role";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "basejump"."billing_customers" TO "service_role";
GRANT SELECT ON TABLE "basejump"."billing_customers" TO "authenticated";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "basejump"."billing_subscriptions" TO "service_role";
GRANT SELECT ON TABLE "basejump"."billing_subscriptions" TO "authenticated";



GRANT SELECT ON TABLE "basejump"."config" TO "authenticated";
GRANT SELECT ON TABLE "basejump"."config" TO "service_role";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "basejump"."invitations" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "basejump"."invitations" TO "service_role";
























GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Page" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Page" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Page" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Scan" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Scan" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Scan" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Space" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Space" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Space" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Website" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Website" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."Website" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."act_rules" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."act_rules" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."act_rules" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."checks" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."checks" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."checks" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."controls" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."controls" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."controls" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."program_controls" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."program_controls" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."program_controls" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."assessments" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."assessments" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."assessments" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."framework_controls" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."framework_controls" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."framework_controls" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."frameworks" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."frameworks" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."frameworks" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."integrations" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."integrations" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."integrations" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."programs" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."programs" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."programs" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" REVOKE ALL ON FUNCTIONS FROM PUBLIC;




























create schema if not exists "dbdev";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION dbdev.install(package_name text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  full_url text;
begin
  full_url := 'https://api.database.dev/rest/v1/' || package_name || '/download';
  
  perform net.http_get(
    url := full_url,
    headers := jsonb_build_object('apikey', current_setting('app.settings.supabase_anon_key', true))
  );
end;
$function$
;


  create policy "Enable delete for service role"
  on "auth"."users"
  as permissive
  for delete
  to service_role
using (true);


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION basejump.run_new_user_setup();


  create policy "Enable all actions for everyone"
  on "storage"."objects"
  as permissive
  for all
  to public
using ((bucket_id = 'alt'::text))
with check ((bucket_id = 'alt'::text));



