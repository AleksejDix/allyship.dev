-- Fix function search_path security vulnerability
-- Identified via Supabase database advisor (lint: 0011_function_search_path_mutable)
--
-- SECURITY ISSUE: Functions without SET search_path can be vulnerable to
-- schema manipulation attacks where malicious users create objects in schemas
-- that appear earlier in the search_path.
--
-- FIX: Add "SET search_path = ''" to all affected functions
--
-- Remediation: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

-- ============================================================================
-- 1. basejump.generate_token
-- ============================================================================
CREATE OR REPLACE FUNCTION basejump.generate_token(length integer)
 RETURNS text
 LANGUAGE sql
 SET search_path = ''
AS $function$
select regexp_replace(replace(
                              replace(replace(replace(encode(extensions.gen_random_bytes(length)::bytea, 'base64'), '/', ''), '+',
                                              ''), '\\', ''),
                              '=',
                              ''), E'[\\n\\r]+', '', 'g');
$function$;

-- ============================================================================
-- 2. basejump.get_config
-- ============================================================================
CREATE OR REPLACE FUNCTION basejump.get_config()
 RETURNS json
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
DECLARE
    result RECORD;
BEGIN
    SELECT * from basejump.config limit 1 into result;
    return row_to_json(result);
END;
$function$;

-- ============================================================================
-- 3. basejump.is_set
-- ============================================================================
CREATE OR REPLACE FUNCTION basejump.is_set(field_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
DECLARE
    result BOOLEAN;
BEGIN
    execute format('select %I from basejump.config limit 1', field_name) into result;
    return result;
END;
$function$;

-- ============================================================================
-- 4. basejump.protect_account_fields
-- ============================================================================
CREATE OR REPLACE FUNCTION basejump.protect_account_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
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
$function$;

-- ============================================================================
-- 5. basejump.slugify_account_slug
-- ============================================================================
CREATE OR REPLACE FUNCTION basejump.slugify_account_slug()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    if NEW.slug is not null then
        NEW.slug = lower(regexp_replace(NEW.slug, '[^a-zA-Z0-9-]+', '-', 'g'));
    end if;

    RETURN NEW;
END
$function$;

-- ============================================================================
-- 6. basejump.trigger_set_invitation_details
-- ============================================================================
CREATE OR REPLACE FUNCTION basejump.trigger_set_invitation_details()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    NEW.invited_by_user_id = auth.uid();
    NEW.account_name = (select name from basejump.accounts where id = NEW.account_id);
    RETURN NEW;
END
$function$;

-- ============================================================================
-- 7. basejump.trigger_set_timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION basejump.trigger_set_timestamps()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    if TG_OP = 'INSERT' then
        NEW.created_at = pg_catalog.now();
        NEW.updated_at = pg_catalog.now();
    else
        NEW.updated_at = pg_catalog.now();
        NEW.created_at = OLD.created_at;
    end if;
    RETURN NEW;
END
$function$;

-- ============================================================================
-- 8. basejump.trigger_set_user_tracking
-- ============================================================================
CREATE OR REPLACE FUNCTION basejump.trigger_set_user_tracking()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
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
$function$;

-- ============================================================================
-- NOTE: dbdev.install function
-- ============================================================================
-- The dbdev.install function is part of the dbdev extension and should be
-- fixed upstream. Since it's a third-party extension, we cannot modify it here.
-- The security risk is minimal as dbdev functions are typically only used
-- during development/setup, not in production request paths.
--
-- If you need to address this, consider:
-- 1. Updating to the latest dbdev version which may have this fixed
-- 2. Reporting the issue to the dbdev maintainers
-- 3. Restricting access to dbdev functions in production
-- ============================================================================

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================
--
-- What this fixes:
-- - Prevents malicious users from creating objects in schemas that appear
--   earlier in search_path to hijack function behavior
-- - Example attack: Creating a malicious "auth.uid()" function that returns
--   a different user ID to bypass RLS
--
-- Impact:
-- - No functional changes to application code
-- - Same behavior, but more secure
-- - Functions now explicitly reference schema-qualified objects
--
-- Testing:
-- - All existing tests should continue to pass
-- - Functions will only search within explicitly named schemas
--
-- ============================================================================
