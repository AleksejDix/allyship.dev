

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


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";








ALTER SCHEMA "public" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgmq" WITH SCHEMA "pgmq";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";






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


CREATE OR REPLACE FUNCTION "public"."cleanup_disabled_accounts"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    cleaned_user RECORD;
    tables_cleaned JSONB;
BEGIN
    -- First, clean up old audit logs
    PERFORM public.cleanup_old_audit_logs();

    FOR cleaned_user IN
        SELECT id, deleted_at, data_retention_period, status, email
        FROM public."User" u
        JOIN auth.users au ON u.id = au.id
        WHERE (
            (status = 'disabled' AND deleted_at + data_retention_period < NOW() AND deletion_requested_at IS NULL)
            OR
            (status = 'deleted' AND deletion_requested_at + '30 days'::INTERVAL < NOW())
        )
    LOOP
        -- Initialize tracking of cleaned tables
        tables_cleaned := jsonb_build_object();

        -- Clean up related data from all relevant tables
        IF cleaned_user.status = 'deleted' THEN
            DELETE FROM public.user_audit_logs WHERE user_id = cleaned_user.id;
            tables_cleaned := tables_cleaned || jsonb_build_object('user_audit_logs', true);
        END IF;

        -- Queue notification for account deletion
        PERFORM public.queue_user_notification(
            cleaned_user.id,
            CASE
                WHEN cleaned_user.status = 'deleted' THEN 'gdpr_deletion_completed'
                ELSE 'account_expired'
            END,
            jsonb_build_object(
                'email', cleaned_user.email,
                'reason', CASE
                    WHEN cleaned_user.status = 'deleted' THEN 'gdpr_request_completed'
                    ELSE 'retention_period_expired'
                END
            )
        );

        -- Log the cleanup
        PERFORM public.log_user_action(
            cleaned_user.id,
            'auto_deleted',
            jsonb_build_object(
                'reason', CASE
                    WHEN cleaned_user.status = 'deleted' THEN 'gdpr_request_completed'
                    ELSE 'retention_period_expired'
                END,
                'deleted_at', cleaned_user.deleted_at,
                'retention_period', cleaned_user.data_retention_period,
                'tables_cleaned', tables_cleaned,
                'notification_queued', true
            )
        );

        -- Final deletion from auth.users
        DELETE FROM auth.users WHERE id = cleaned_user.id;
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."cleanup_disabled_accounts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_old_audit_logs"("retention_period" interval DEFAULT '6 mons'::interval) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM public.user_audit_logs
        WHERE timestamp < NOW() - retention_period
        AND user_id NOT IN (
            -- Keep logs for users in deletion cooling-off period
            SELECT id FROM public."User"
            WHERE status = 'deleted'
            AND deletion_requested_at + '30 days'::INTERVAL > NOW()
        )
        RETURNING *
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;

    -- Log the cleanup action
    IF deleted_count > 0 THEN
        INSERT INTO public.user_audit_logs (
            user_id,
            action,
            details
        ) VALUES (
            auth.uid(),
            'audit_logs_cleaned',
            jsonb_build_object(
                'deleted_count', deleted_count,
                'retention_period', retention_period
            )
        );
    END IF;

    RETURN deleted_count;
END;
$$;


ALTER FUNCTION "public"."cleanup_old_audit_logs"("retention_period" interval) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_personal_space"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    space_id UUID;
    user_name TEXT;
    parsed_first_name TEXT;
    parsed_last_name TEXT;
BEGIN
    -- First try to get name from metadata with all possible fields
    SELECT
        COALESCE(
            NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
            NULLIF(NEW.raw_user_meta_data->>'given_name', ''),
            (SELECT first_name FROM public.parse_name(NEW.raw_user_meta_data->>'full_name')),
            (SELECT first_name FROM public.parse_name(NEW.raw_user_meta_data->>'name')),
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(
            NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
            NULLIF(NEW.raw_user_meta_data->>'family_name', ''),
            (SELECT last_name FROM public.parse_name(NEW.raw_user_meta_data->>'full_name')),
            (SELECT last_name FROM public.parse_name(NEW.raw_user_meta_data->>'name'))
        )
    INTO parsed_first_name, parsed_last_name;

    -- Create initial user profile first
    INSERT INTO public."User" (
        id,
        first_name,
        last_name,
        status,
        updated_at
    )
    VALUES (
        NEW.id,
        parsed_first_name,
        parsed_last_name,
        'active',
        NOW()
    );

    -- Get display name for space
    user_name := CASE
        WHEN parsed_first_name IS NOT NULL AND parsed_last_name IS NOT NULL
        THEN parsed_first_name || ' ' || parsed_last_name
        WHEN parsed_first_name IS NOT NULL
        THEN parsed_first_name
        ELSE split_part(NEW.email, '@', 1)
    END;

    -- Create personal space
    INSERT INTO public."Space" (
        name,
        description,
        is_personal,
        created_by,
        created_at,
        updated_at
    )
    VALUES (
        user_name || '''s Personal Space',
        'Personal space for ' || user_name,
        true,
        NEW.id,
        NOW(),
        NOW()
    )
    RETURNING id INTO space_id;

    -- Create ownership membership
    INSERT INTO public."Membership" (
        space_id,
        user_id,
        role,
        status,
        created_at,
        updated_at
    )
    VALUES (
        space_id,
        NEW.id,
        'owner',
        'active',
        NOW(),
        NOW()
    );

    -- Log successful creation
    INSERT INTO public.user_audit_logs (
        user_id,
        action,
        details
    ) VALUES (
        NEW.id,
        'user_and_space_created',
        jsonb_build_object(
            'email', NEW.email,
            'first_name', parsed_first_name,
            'last_name', parsed_last_name,
            'space_id', space_id,
            'space_name', user_name || '''s Personal Space',
            'metadata', NEW.raw_user_meta_data
        )
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't prevent user creation
        INSERT INTO public.user_audit_logs (
            user_id,
            action,
            details
        ) VALUES (
            NEW.id,
            'user_creation_error',
            jsonb_build_object(
                'error', SQLERRM,
                'email', NEW.email,
                'metadata', NEW.raw_user_meta_data
            )
        );
        RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_personal_space"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public."Space" (name, owner_id, is_personal)
    VALUES (
        'Personal Space',  -- Default name
        NEW.id,           -- User ID
        true              -- Mark as personal space
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_owner_deactivation"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    next_owner UUID;
    space_id UUID;
    space_name TEXT;
BEGIN
    FOR space_id, space_name IN
        SELECT m.space_id, s.name
        FROM "Membership" m
        JOIN "Space" s ON s.id = m.space_id
        WHERE m.user_id = OLD.id
        AND m.role = 'owner'
        AND m.status = 'active'
    LOOP
        SELECT user_id INTO next_owner
        FROM (
            SELECT user_id, 1 as priority
            FROM "Membership"
            WHERE space_id = space_id
            AND user_id != OLD.id
            AND role = 'admin'
            AND status = 'active'
            UNION ALL
            SELECT user_id, 2 as priority
            FROM "Membership"
            WHERE space_id = space_id
            AND user_id != OLD.id
            AND role = 'member'
            AND status = 'active'
        ) ranked_members
        ORDER BY priority
        LIMIT 1;

        IF next_owner IS NULL THEN
            RAISE EXCEPTION 'Cannot deactivate account: You are the last owner of space "%"', space_name;
        END IF;

        UPDATE "Membership"
        SET
            role = 'owner',
            updated_at = clock_timestamp()
        WHERE space_id = space_id
        AND user_id = next_owner;

        UPDATE "Membership"
        SET
            role = 'admin',
            updated_at = clock_timestamp()
        WHERE space_id = space_id
        AND user_id = OLD.id;

        PERFORM public.log_user_action(
            OLD.id,
            'ownership_auto_transferred',
            jsonb_build_object(
                'space_id', space_id,
                'space_name', space_name,
                'new_owner_id', next_owner,
                'new_owner_previous_role', (
                    SELECT role
                    FROM "Membership"
                    WHERE space_id = space_id
                    AND user_id = next_owner
                ),
                'reason', 'account_deactivation',
                'transfer_time', clock_timestamp()
            )
        );

        PERFORM public.queue_user_notification(
            next_owner,
            'ownership_received_auto',
            jsonb_build_object(
                'space_id', space_id,
                'space_name', space_name,
                'previous_owner_id', OLD.id,
                'reason', 'previous_owner_deactivated',
                'transfer_time', clock_timestamp(),
                'previous_role', (
                    SELECT role
                    FROM "Membership"
                    WHERE space_id = space_id
                    AND user_id = next_owner
                )
            )
        );
    END LOOP;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_owner_deactivation"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_user_deletion"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Handle space ownership transfers before deletion
    WITH owned_spaces AS (
        SELECT m.space_id, s.name as space_name
        FROM public."Membership" m
        JOIN public."Space" s ON s.id = m.space_id
        WHERE m.user_id = OLD.id
        AND m.role = 'owner'
        AND m.status = 'active'
        AND NOT s.is_personal -- Skip personal spaces as they'll be deleted
    ),
    next_owners AS (
        SELECT DISTINCT ON (m.space_id)
            m.space_id,
            m.user_id as next_owner_id,
            m.role as previous_role
        FROM public."Membership" m
        JOIN owned_spaces os ON os.space_id = m.space_id
        WHERE m.user_id != OLD.id
        AND m.status = 'active'
        ORDER BY m.space_id,
            CASE m.role
                WHEN 'admin' THEN 1
                WHEN 'member' THEN 2
                ELSE 3
            END
    )
    UPDATE public."Membership" m
    SET role = 'owner',
        updated_at = NOW()
    FROM next_owners no
    WHERE m.space_id = no.space_id
    AND m.user_id = no.next_owner_id;

    -- Mark user as deleted in User table
    UPDATE public."User"
    SET status = 'deleted',
        deleted_at = NOW(),
        updated_at = NOW()
    WHERE id = OLD.id;

    -- Log the deletion
    INSERT INTO public.user_audit_logs (
        user_id,
        action,
        details
    ) VALUES (
        OLD.id,
        'user_deleted',
        jsonb_build_object(
            'deleted_at', NOW(),
            'deleted_by', COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'),
            'email', OLD.email,
            'metadata', OLD.raw_user_meta_data
        )
    );

    RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."handle_user_deletion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_user_hard_deletion"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
    related_data_exists BOOLEAN;
BEGIN
    -- Only proceed with hard deletion if explicitly requested
    IF EXISTS (
        SELECT 1 FROM public."User"
        WHERE id = OLD.id AND deletion_requested_at IS NOT NULL
    ) THEN
        -- Check for any related data that needs to be cleaned up
        -- Add more checks here as needed for other tables
        SELECT EXISTS (
            SELECT 1 FROM public.user_audit_logs WHERE user_id = OLD.id
        ) INTO related_data_exists;

        -- Log the deletion request
        PERFORM public.log_user_action(
            OLD.id,
            'user_deleted',
            jsonb_build_object(
                'type', 'hard_delete',
                'reason', 'gdpr_request',
                'has_related_data', related_data_exists
            )
        );

        -- Delete from public.User first (due to foreign key constraint)
        DELETE FROM public."User" WHERE id = OLD.id;

        -- Delete audit logs for this user (GDPR requirement)
        DELETE FROM public.user_audit_logs WHERE user_id = OLD.id;

        -- Note: The DELETE FROM auth.users is handled by the original DELETE trigger
        -- that called this function, so we don't need to delete from auth.users here
    ELSE
        -- Default to soft deletion if not explicitly requested
        PERFORM public.handle_user_soft_deletion();
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."handle_user_hard_deletion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_user_metadata_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
    UPDATE public."User"
    SET
        first_name = NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
        last_name = NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
        updated_at = NOW()
    WHERE id = NEW.id;

    PERFORM public.log_user_action(
        NEW.id,
        'profile_updated',
        jsonb_build_object(
            'old_data', OLD.raw_user_meta_data,
            'new_data', NEW.raw_user_meta_data
        )
    );

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_user_metadata_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_user_soft_deletion"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
    UPDATE public."User"
    SET
        status = 'disabled',
        updated_at = NOW(),
        deleted_at = NOW()
    WHERE id = OLD.id;

    PERFORM public.log_user_action(
        OLD.id,
        'user_disabled',
        jsonb_build_object('reason', 'user_requested')
    );

    RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."handle_user_soft_deletion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"("jwt" "jsonb" DEFAULT "auth"."jwt"()) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- You can customize this logic based on your admin definition
    RETURN jwt ? 'is_admin';
END;
$$;


ALTER FUNCTION "public"."is_admin"("jwt" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_user_action"("user_id" "uuid", "action" "text", "details" "jsonb" DEFAULT NULL::"jsonb", "ip_address" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.user_audit_logs (user_id, action, details, ip_address)
    VALUES (
        user_id,
        action,
        details,
        public.mask_ip_address(ip_address)
    );
END;
$$;


ALTER FUNCTION "public"."log_user_action"("user_id" "uuid", "action" "text", "details" "jsonb", "ip_address" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mask_ip_address"("ip" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
    IF ip IS NULL THEN
        RETURN NULL;
    END IF;
    IF ip ~ '^(\d{1,3}\.){3}\d{1,3}$' THEN
        RETURN regexp_replace(ip, '\d+$', 'XXX');
    END IF;
    IF ip ~ ':' THEN
        RETURN regexp_replace(ip, ':[^:]+$', ':XXXX');
    END IF;
    RETURN regexp_replace(ip, '[^.]+$', 'XXX');
END;
$_$;


ALTER FUNCTION "public"."mask_ip_address"("ip" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."parse_name"("full_name" "text") RETURNS TABLE("first_name" "text", "last_name" "text")
    LANGUAGE "plpgsql" IMMUTABLE
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


CREATE OR REPLACE FUNCTION "public"."prevent_owner_removal"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    IF OLD.role = 'owner' AND (TG_OP = 'DELETE' OR NEW.role != 'owner') THEN
        IF NOT EXISTS (
            SELECT 1 FROM "Membership"
            WHERE space_id = OLD.space_id
            AND role = 'owner'
            AND status = 'active'
            AND user_id != OLD.user_id
        ) THEN
            RAISE EXCEPTION 'Cannot remove or downgrade the last owner of the space';
        END IF;
    END IF;

    IF OLD.role = 'admin' AND (TG_OP = 'DELETE' OR NEW.role != 'admin') THEN
        IF NOT EXISTS (
            SELECT 1 FROM "Membership"
            WHERE space_id = OLD.space_id
            AND role IN ('owner', 'admin')
            AND status = 'active'
            AND user_id != OLD.user_id
        ) THEN
            RAISE EXCEPTION 'Cannot remove the last admin of the space';
        END IF;
    END IF;

    RETURN CASE TG_OP
        WHEN 'DELETE' THEN OLD
        ELSE NEW
    END;
END;
$$;


ALTER FUNCTION "public"."prevent_owner_removal"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."queue_user_notification"("user_id" "uuid", "notification_type" "text", "details" "jsonb" DEFAULT NULL::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.user_notifications (
        user_id,
        type,
        details
    ) VALUES (
        user_id,
        notification_type,
        details
    )
    RETURNING id INTO notification_id;

    RETURN notification_id;
END;
$$;


ALTER FUNCTION "public"."queue_user_notification"("user_id" "uuid", "notification_type" "text", "details" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reactivate_user"("user_id" "uuid", "admin_id" "uuid", "reason" "text" DEFAULT 'admin_requested'::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    user_status TEXT;
    user_email TEXT;
BEGIN
    -- Verify admin privileges
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Admin privileges required for user reactivation';
    END IF;

    -- Get current user status and email
    SELECT u.status, au.email
    INTO user_status, user_email
    FROM public."User" u
    JOIN auth.users au ON u.id = au.id
    WHERE u.id = user_id;

    -- Only allow reactivation of disabled accounts
    IF user_status != 'disabled' THEN
        RAISE EXCEPTION 'Only disabled accounts can be reactivated. Current status: %', user_status;
    END IF;

    -- Reactivate the user
    UPDATE public."User"
    SET
        status = 'active',
        updated_at = NOW(),
        deleted_at = NULL
    WHERE id = user_id;

    -- Queue notification
    PERFORM public.queue_user_notification(
        user_id,
        'account_reactivated',
        jsonb_build_object(
            'email', user_email,
            'reason', reason,
            'reactivated_by', admin_id
        )
    );

    -- Log the reactivation
    PERFORM public.log_user_action(
        user_id,
        'account_reactivated',
        jsonb_build_object(
            'reason', reason,
            'reactivated_by', admin_id,
            'previous_status', user_status,
            'notification_queued', true
        )
    );
END;
$$;


ALTER FUNCTION "public"."reactivate_user"("user_id" "uuid", "admin_id" "uuid", "reason" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."request_gdpr_deletion"("user_id" "uuid", "requester_id" "uuid" DEFAULT NULL::"uuid", "reason" "text" DEFAULT 'user_requested'::"text", "admin_override" boolean DEFAULT false) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    requester_is_admin BOOLEAN;
BEGIN
    -- Check if requester is admin when admin_override is true
    IF admin_override THEN
        SELECT public.is_admin() INTO requester_is_admin;
        IF NOT requester_is_admin THEN
            RAISE EXCEPTION 'Admin privileges required for override';
        END IF;
    END IF;

    -- Verify the requester has permission
    IF requester_id IS NOT NULL AND requester_id != user_id AND NOT admin_override THEN
        RAISE EXCEPTION 'Only the user themselves or an admin can request deletion';
    END IF;

    -- Check if user exists and is not already deleted
    IF NOT EXISTS (
        SELECT 1 FROM public."User"
        WHERE id = user_id AND status != 'deleted'
    ) THEN
        RAISE EXCEPTION 'User not found or already deleted';
    END IF;

    -- Mark user for deletion
    UPDATE public."User"
    SET
        deletion_requested_at = NOW(),
        updated_at = NOW(),
        status = 'deleted', -- Immediately mark as deleted to prevent access
        data_retention_period = '30 days'::INTERVAL -- Set retention for GDPR deletion
    WHERE id = user_id;

    -- Log the deletion request with detailed context
    PERFORM public.log_user_action(
        user_id,
        'deletion_requested',
        jsonb_build_object(
            'type', 'gdpr_request',
            'reason', reason,
            'requested_by', COALESCE(requester_id, user_id),
            'admin_override', admin_override,
            'requester_is_admin', requester_is_admin
        )
    );
END;
$$;


ALTER FUNCTION "public"."request_gdpr_deletion"("user_id" "uuid", "requester_id" "uuid", "reason" "text", "admin_override" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_scan_normalized_url"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Get both URL and normalized_url from the associated page
  SELECT url, normalized_url
  INTO NEW.url, NEW.normalized_url
  FROM "public"."Page"
  WHERE id = NEW.page_id;

  -- If no page found or no URLs, raise an error
  IF NEW.url IS NULL OR NEW.url = '' OR NEW.normalized_url IS NULL OR NEW.normalized_url = '' THEN
    RAISE EXCEPTION 'Cannot create scan: associated page must have valid URLs';
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_scan_normalized_url"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_active_user"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users u
        JOIN "Membership" m ON m.user_id = u.id
        WHERE u.id = auth.uid()
        AND u.raw_user_meta_data->>'status' = 'active'
        AND m.status = 'active'
    );
END;
$$;


ALTER FUNCTION "public"."verify_active_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Memberships" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "space_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."Memberships" OWNER TO "postgres";


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
    CONSTRAINT "scan_normalized_url_check" CHECK (("normalized_url" <> ''::"text")),
    CONSTRAINT "scan_url_check" CHECK (("url" <> ''::"text"))
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



ALTER TABLE ONLY "public"."Memberships"
    ADD CONSTRAINT "memberships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Memberships"
    ADD CONSTRAINT "memberships_user_id_space_id_key" UNIQUE ("user_id", "space_id");



ALTER TABLE ONLY "public"."Page"
    ADD CONSTRAINT "page_normalized_url_website_unique" UNIQUE ("website_id", "normalized_url");



ALTER TABLE ONLY "public"."Website"
    ADD CONSTRAINT "website_normalized_url_space_unique" UNIQUE ("normalized_url", "space_id");



CREATE INDEX "idx_domains_space_id" ON "public"."Website" USING "btree" ("space_id");



CREATE INDEX "idx_memberships_space_id" ON "public"."Memberships" USING "btree" ("space_id");



CREATE INDEX "idx_memberships_user_id" ON "public"."Memberships" USING "btree" ("user_id");



CREATE UNIQUE INDEX "idx_page_website_path" ON "public"."Page" USING "btree" ("website_id", "path");



CREATE INDEX "idx_pages_url" ON "public"."Page" USING "btree" ("url");



CREATE INDEX "idx_pages_website_id" ON "public"."Page" USING "btree" ("website_id");



CREATE INDEX "idx_scans_created_at" ON "public"."Scan" USING "brin" ("created_at");



CREATE INDEX "idx_scans_page_status" ON "public"."Scan" USING "btree" ("page_id", "status");



CREATE INDEX "idx_space_owner_id" ON "public"."Space" USING "btree" ("owner_id");



CREATE UNIQUE INDEX "idx_website_url_space" ON "public"."Website" USING "btree" ("url", "space_id");



CREATE INDEX "page_normalized_url_idx" ON "public"."Page" USING "btree" ("normalized_url");



CREATE INDEX "scan_normalized_url_idx" ON "public"."Scan" USING "btree" ("normalized_url");



CREATE INDEX "website_normalized_url_space_idx" ON "public"."Website" USING "btree" ("normalized_url", "space_id");



CREATE OR REPLACE TRIGGER "set_scan_normalized_url_trigger" BEFORE INSERT ON "public"."Scan" FOR EACH ROW EXECUTE FUNCTION "public"."set_scan_normalized_url"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."Page" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



ALTER TABLE ONLY "public"."Website"
    ADD CONSTRAINT "Domain_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."Space"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Memberships"
    ADD CONSTRAINT "Memberships_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."Page"
    ADD CONSTRAINT "Page_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."Website"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Scan"
    ADD CONSTRAINT "Scan_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."Page"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Space"
    ADD CONSTRAINT "Space_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."Website"
    ADD CONSTRAINT "Website_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."Memberships"
    ADD CONSTRAINT "memberships_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."Space"("id") ON DELETE CASCADE;



CREATE POLICY "Enable delete for users based on owner_id" ON "public"."Space" FOR DELETE USING (("auth"."uid"() = "owner_id"));



ALTER TABLE "public"."Memberships" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Owners can update their own spaces" ON "public"."Space" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "owner_id")) WITH CHECK (("auth"."uid"() = "owner_id"));



ALTER TABLE "public"."Page" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Scan" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Service role can create spaces" ON "public"."Space" FOR INSERT TO "service_role" WITH CHECK (true);



ALTER TABLE "public"."Space" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Space members can delete their spaces" ON "public"."Space" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."Memberships"
  WHERE (("Memberships"."space_id" = "Memberships"."id") AND ("Memberships"."user_id" = "auth"."uid"()) AND ("Memberships"."deleted_at" IS NULL)))));



CREATE POLICY "Space members can update their spaces" ON "public"."Space" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."Memberships"
  WHERE (("Memberships"."space_id" = "Memberships"."id") AND ("Memberships"."user_id" = "auth"."uid"()) AND ("Memberships"."deleted_at" IS NULL))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."Memberships"
  WHERE (("Memberships"."space_id" = "Memberships"."id") AND ("Memberships"."user_id" = "auth"."uid"()) AND ("Memberships"."deleted_at" IS NULL)))));



CREATE POLICY "Space owners can create websites" ON "public"."Website" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."Space"
  WHERE (("Space"."id" = "Website"."space_id") AND ("Space"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Space owners can delete pages" ON "public"."Page" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."Website" "w"
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("w"."id" = "Page"."website_id") AND ("s"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Space owners can delete websites" ON "public"."Website" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."Space"
  WHERE (("Space"."id" = "Website"."space_id") AND ("Space"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Space owners can insert pages" ON "public"."Page" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."Website" "w"
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("w"."id" = "Page"."website_id") AND ("s"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Space owners can update pages" ON "public"."Page" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."Website" "w"
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("w"."id" = "Page"."website_id") AND ("s"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Space owners can update websites" ON "public"."Website" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."Space"
  WHERE (("Space"."id" = "Website"."space_id") AND ("Space"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Space owners can view pages" ON "public"."Page" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."Website" "w"
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("w"."id" = "Page"."website_id") AND ("s"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Space owners can view websites" ON "public"."Website" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."Space"
  WHERE (("Space"."id" = "Website"."space_id") AND ("Space"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can create memberships for their spaces" ON "public"."Memberships" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can create scans for pages in their spaces" ON "public"."Scan" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM (("public"."Page" "p"
     JOIN "public"."Website" "w" ON (("p"."website_id" = "w"."id")))
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("p"."id" = "Scan"."page_id") AND ("s"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can create spaces" ON "public"."Space" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Users can create their own spaces" ON "public"."Space" FOR INSERT TO "authenticated" WITH CHECK (("owner_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own memberships" ON "public"."Memberships" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own memberships" ON "public"."Memberships" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view scans for pages in their spaces" ON "public"."Scan" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM (("public"."Page" "p"
     JOIN "public"."Website" "w" ON (("p"."website_id" = "w"."id")))
     JOIN "public"."Space" "s" ON (("w"."space_id" = "s"."id")))
  WHERE (("p"."id" = "Scan"."page_id") AND ("s"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own memberships" ON "public"."Memberships" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own spaces" ON "public"."Space" FOR SELECT TO "authenticated" USING (("owner_id" = "auth"."uid"()));



ALTER TABLE "public"."Website" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


CREATE PUBLICATION "supabase_realtime_messages_publication" WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION "supabase_realtime_messages_publication" OWNER TO "supabase_admin";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Scan";









REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";















































































































































































































































































































































































































GRANT ALL ON FUNCTION "public"."cleanup_disabled_accounts"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_disabled_accounts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_disabled_accounts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_audit_logs"("retention_period" interval) TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_old_audit_logs"("retention_period" interval) TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_old_audit_logs"("retention_period" interval) TO "service_role";



GRANT ALL ON FUNCTION "public"."create_personal_space"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_personal_space"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_personal_space"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_owner_deactivation"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_owner_deactivation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_owner_deactivation"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_user_deletion"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_user_deletion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_user_deletion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_user_hard_deletion"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_user_hard_deletion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_user_hard_deletion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_user_metadata_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_user_metadata_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_user_metadata_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_user_soft_deletion"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_user_soft_deletion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_user_soft_deletion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"("jwt" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("jwt" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("jwt" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_user_action"("user_id" "uuid", "action" "text", "details" "jsonb", "ip_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."log_user_action"("user_id" "uuid", "action" "text", "details" "jsonb", "ip_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_user_action"("user_id" "uuid", "action" "text", "details" "jsonb", "ip_address" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."mask_ip_address"("ip" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."mask_ip_address"("ip" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mask_ip_address"("ip" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."parse_name"("full_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."parse_name"("full_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."parse_name"("full_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."prevent_owner_removal"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_owner_removal"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_owner_removal"() TO "service_role";



GRANT ALL ON FUNCTION "public"."queue_user_notification"("user_id" "uuid", "notification_type" "text", "details" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."queue_user_notification"("user_id" "uuid", "notification_type" "text", "details" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."queue_user_notification"("user_id" "uuid", "notification_type" "text", "details" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."reactivate_user"("user_id" "uuid", "admin_id" "uuid", "reason" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."reactivate_user"("user_id" "uuid", "admin_id" "uuid", "reason" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."reactivate_user"("user_id" "uuid", "admin_id" "uuid", "reason" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."request_gdpr_deletion"("user_id" "uuid", "requester_id" "uuid", "reason" "text", "admin_override" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."request_gdpr_deletion"("user_id" "uuid", "requester_id" "uuid", "reason" "text", "admin_override" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."request_gdpr_deletion"("user_id" "uuid", "requester_id" "uuid", "reason" "text", "admin_override" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_scan_normalized_url"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_scan_normalized_url"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_scan_normalized_url"() TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_active_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."verify_active_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_active_user"() TO "service_role";






























GRANT ALL ON TABLE "public"."Memberships" TO "anon";
GRANT ALL ON TABLE "public"."Memberships" TO "authenticated";
GRANT ALL ON TABLE "public"."Memberships" TO "service_role";



GRANT ALL ON TABLE "public"."Page" TO "anon";
GRANT ALL ON TABLE "public"."Page" TO "authenticated";
GRANT ALL ON TABLE "public"."Page" TO "service_role";



GRANT ALL ON TABLE "public"."Scan" TO "anon";
GRANT ALL ON TABLE "public"."Scan" TO "authenticated";
GRANT ALL ON TABLE "public"."Scan" TO "service_role";



GRANT ALL ON TABLE "public"."Space" TO "anon";
GRANT ALL ON TABLE "public"."Space" TO "authenticated";
GRANT ALL ON TABLE "public"."Space" TO "service_role";



GRANT ALL ON TABLE "public"."Website" TO "anon";
GRANT ALL ON TABLE "public"."Website" TO "authenticated";
GRANT ALL ON TABLE "public"."Website" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";



























RESET ALL;
