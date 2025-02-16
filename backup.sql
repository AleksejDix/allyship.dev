

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






CREATE TYPE "public"."DomainTheme" AS ENUM (
    'LIGHT',
    'DARK',
    'BOTH'
);


ALTER TYPE "public"."DomainTheme" OWNER TO "postgres";


CREATE TYPE "public"."MembershipRole" AS ENUM (
    'owner',
    'admin',
    'member'
);


ALTER TYPE "public"."MembershipRole" OWNER TO "postgres";


COMMENT ON TYPE "public"."MembershipRole" IS 'Role of a user in a space';



CREATE TYPE "public"."MembershipStatus" AS ENUM (
    'active',
    'inactive',
    'pending',
    'banned'
);


ALTER TYPE "public"."MembershipStatus" OWNER TO "postgres";


COMMENT ON TYPE "public"."MembershipStatus" IS 'Status of a user''s membership in a space';



CREATE TYPE "public"."ScanStatus" AS ENUM (
    'pending',
    'completed',
    'failed',
    'queued'
);


ALTER TYPE "public"."ScanStatus" OWNER TO "postgres";


CREATE TYPE "public"."SubStatus" AS ENUM (
    'ACTIVE',
    'PAST_DUE',
    'CANCELED'
);


ALTER TYPE "public"."SubStatus" OWNER TO "postgres";


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
BEGIN
    INSERT INTO public."Space" (name, description, is_personal, created_by)
    VALUES (
        NEW.raw_user_meta_data->>'full_name' || '''s Personal Space',
        'Personal space for ' || NEW.raw_user_meta_data->>'full_name',
        true,
        NEW.id
    )
    RETURNING id INTO space_id;

    INSERT INTO public."Membership" (space_id, user_id, role, status)
    VALUES (space_id, NEW.id, 'owner', 'active');

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_personal_space"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_role_level"("role" "public"."MembershipRole") RETURNS integer
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
BEGIN
    RETURN CASE role
        WHEN 'owner' THEN 3
        WHEN 'admin' THEN 2
        WHEN 'member' THEN 1
        ELSE 0
    END;
END;
$$;


ALTER FUNCTION "public"."get_role_level"("role" "public"."MembershipRole") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
    INSERT INTO public."User" (
        id,
        first_name,
        last_name,
        status,
        updated_at
    )
    VALUES (
        NEW.id,
        NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
        NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
        'active',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        first_name = NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
        last_name = NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
        updated_at = NOW();

    PERFORM public.log_user_action(
        NEW.id,
        'user_created',
        jsonb_build_object('metadata', NEW.raw_user_meta_data)
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


CREATE TABLE IF NOT EXISTS "public"."Domain" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "space_id" "uuid" NOT NULL,
    "theme" "public"."DomainTheme" DEFAULT 'BOTH'::"public"."DomainTheme" NOT NULL
);


ALTER TABLE "public"."Domain" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Membership" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "space_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."MembershipRole" DEFAULT 'member'::"public"."MembershipRole" NOT NULL,
    "status" "public"."MembershipStatus" DEFAULT 'active'::"public"."MembershipStatus" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."Membership" OWNER TO "postgres";


COMMENT ON TABLE "public"."Membership" IS 'User memberships in spaces';



CREATE TABLE IF NOT EXISTS "public"."Page" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    "domain_id" "uuid" NOT NULL
);


ALTER TABLE "public"."Page" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Scan" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "url" "text" NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "status" "public"."ScanStatus" DEFAULT 'pending'::"public"."ScanStatus" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "page_id" "uuid" NOT NULL,
    "screenshot_dark" "text",
    "screenshot_light" "text",
    "metrics" "jsonb"
);


ALTER TABLE "public"."Scan" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Space" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_personal" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "deleted_at" timestamp with time zone,
    "transfer_token" "uuid",
    "transfer_token_expires_at" timestamp with time zone
);


ALTER TABLE "public"."Space" OWNER TO "postgres";


COMMENT ON TABLE "public"."Space" IS 'Spaces that users can be members of';



CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone,
    "deletion_requested_at" timestamp with time zone,
    "data_retention_period" interval DEFAULT '6 mons'::interval,
    CONSTRAINT "status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'disabled'::"text", 'deleted'::"text"])))
);


ALTER TABLE "public"."User" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "details" "jsonb",
    "ip_address" "text",
    "timestamp" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "details" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "processed_at" timestamp with time zone,
    "error" "text",
    CONSTRAINT "user_notifications_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'sent'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."user_notifications" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Domain"
    ADD CONSTRAINT "Domain_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Membership"
    ADD CONSTRAINT "Membership_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Membership"
    ADD CONSTRAINT "Membership_space_id_user_id_key" UNIQUE ("space_id", "user_id");



ALTER TABLE ONLY "public"."Page"
    ADD CONSTRAINT "Page_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Scan"
    ADD CONSTRAINT "Scan_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Space"
    ADD CONSTRAINT "Space_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_audit_logs"
    ADD CONSTRAINT "user_audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_notifications"
    ADD CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id");



CREATE INDEX "Domain_name_idx" ON "public"."Domain" USING "btree" ("name");



CREATE UNIQUE INDEX "Domain_space_id_name_key" ON "public"."Domain" USING "btree" ("space_id", "name");



CREATE UNIQUE INDEX "Page_domain_id_name_key" ON "public"."Page" USING "btree" ("domain_id", "name");



CREATE INDEX "Page_name_idx" ON "public"."Page" USING "btree" ("name");



CREATE INDEX "idx_membership_owner_lookup" ON "public"."Membership" USING "btree" ("space_id", "role", "status") WHERE (("role" = 'owner'::"public"."MembershipRole") AND ("status" = 'active'::"public"."MembershipStatus"));



CREATE INDEX "idx_membership_space_user" ON "public"."Membership" USING "btree" ("space_id", "user_id", "status");



CREATE INDEX "idx_membership_space_user_role" ON "public"."Membership" USING "btree" ("space_id", "user_id", "role", "status");



CREATE INDEX "idx_space_role_status" ON "public"."Membership" USING "btree" ("space_id", "role", "status");



CREATE INDEX "idx_space_role_status_priority" ON "public"."Membership" USING "btree" ("space_id", "role", "status") WHERE (("role" = ANY (ARRAY['admin'::"public"."MembershipRole", 'member'::"public"."MembershipRole"])) AND ("status" = 'active'::"public"."MembershipStatus"));



CREATE OR REPLACE TRIGGER "prevent_role_removal_trigger" BEFORE DELETE OR UPDATE ON "public"."Membership" FOR EACH ROW WHEN (("old"."role" = ANY (ARRAY['owner'::"public"."MembershipRole", 'admin'::"public"."MembershipRole"]))) EXECUTE FUNCTION "public"."prevent_owner_removal"();



ALTER TABLE ONLY "public"."Membership"
    ADD CONSTRAINT "Membership_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."Space"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Membership"
    ADD CONSTRAINT "Membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Page"
    ADD CONSTRAINT "Page_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."Domain"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Scan"
    ADD CONSTRAINT "Scan_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."Page"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Space"
    ADD CONSTRAINT "Space_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE "public"."Domain" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable admin select for notifications" ON "public"."user_notifications" FOR SELECT USING (("auth"."jwt"() ? 'is_admin'::"text"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."user_audit_logs" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable select for admins only" ON "public"."user_audit_logs" FOR SELECT USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Enable system insert for notifications" ON "public"."user_notifications" FOR INSERT WITH CHECK ((("auth"."jwt"() ? 'is_admin'::"text") OR ("auth"."role"() = 'service_role'::"text")));



ALTER TABLE "public"."Membership" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Membership access policy" ON "public"."Membership" FOR SELECT TO "authenticated" USING (("space_id" IN ( SELECT "Membership_1"."space_id"
   FROM "public"."Membership" "Membership_1"
  WHERE (("Membership_1"."user_id" = "auth"."uid"()) AND ("Membership_1"."status" = 'active'::"public"."MembershipStatus")))));



CREATE POLICY "Membership update policy" ON "public"."Membership" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("auth"."users" "u"
     JOIN "public"."Membership" "m" ON (("m"."user_id" = "u"."id")))
  WHERE (("m"."space_id" = "Membership"."space_id") AND ("m"."user_id" = "auth"."uid"()) AND ("m"."role" = ANY (ARRAY['owner'::"public"."MembershipRole", 'admin'::"public"."MembershipRole"])) AND ("m"."status" = 'active'::"public"."MembershipStatus") AND (("u"."raw_user_meta_data" ->> 'status'::"text") = 'active'::"text"))))) WITH CHECK (((EXISTS ( SELECT 1
   FROM ("auth"."users" "u"
     JOIN "public"."Membership" "m" ON (("m"."user_id" = "u"."id")))
  WHERE (("m"."space_id" = "Membership"."space_id") AND ("m"."user_id" = "auth"."uid"()) AND ("m"."role" = ANY (ARRAY['owner'::"public"."MembershipRole", 'admin'::"public"."MembershipRole"])) AND ("m"."status" = 'active'::"public"."MembershipStatus") AND (("u"."raw_user_meta_data" ->> 'status'::"text") = 'active'::"text")))) AND (((EXISTS ( SELECT 1
   FROM ("public"."Membership" "m2"
     JOIN "auth"."users" "u" ON (("u"."id" = "m2"."user_id")))
  WHERE (("m2"."space_id" = "Membership"."space_id") AND ("m2"."user_id" = "auth"."uid"()) AND ("m2"."role" = 'owner'::"public"."MembershipRole") AND ("m2"."status" = 'active'::"public"."MembershipStatus") AND (("u"."raw_user_meta_data" ->> 'status'::"text") = 'active'::"text")))) AND (NOT (("user_id" = "auth"."uid"()) AND ("role" = 'owner'::"public"."MembershipRole") AND ("role" <> "role")))) OR ((EXISTS ( SELECT 1
   FROM ("public"."Membership" "m2"
     JOIN "auth"."users" "u" ON (("u"."id" = "m2"."user_id")))
  WHERE (("m2"."space_id" = "Membership"."space_id") AND ("m2"."user_id" = "auth"."uid"()) AND ("m2"."role" = 'admin'::"public"."MembershipRole") AND ("m2"."status" = 'active'::"public"."MembershipStatus") AND (("u"."raw_user_meta_data" ->> 'status'::"text") = 'active'::"text")))) AND (NOT ("role" = ANY (ARRAY['owner'::"public"."MembershipRole", 'admin'::"public"."MembershipRole"]))) AND ("public"."get_role_level"("role") <= "public"."get_role_level"('member'::"public"."MembershipRole")) AND (NOT (("user_id" = "auth"."uid"()) AND ("role" = 'admin'::"public"."MembershipRole") AND ("role" <> "role")))))));



ALTER TABLE "public"."Space" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Space access policy" ON "public"."Space" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."Membership"
  WHERE (("Membership"."space_id" = "Membership"."id") AND ("Membership"."user_id" = "auth"."uid"()) AND ("Membership"."status" = 'active'::"public"."MembershipStatus")))));



ALTER TABLE "public"."user_audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_notifications" ENABLE ROW LEVEL SECURITY;




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



GRANT ALL ON FUNCTION "public"."get_role_level"("role" "public"."MembershipRole") TO "anon";
GRANT ALL ON FUNCTION "public"."get_role_level"("role" "public"."MembershipRole") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_role_level"("role" "public"."MembershipRole") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_owner_deactivation"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_owner_deactivation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_owner_deactivation"() TO "service_role";



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



GRANT ALL ON FUNCTION "public"."verify_active_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."verify_active_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_active_user"() TO "service_role";



























GRANT ALL ON TABLE "public"."Domain" TO "authenticated";
GRANT ALL ON TABLE "public"."Domain" TO "anon";
GRANT ALL ON TABLE "public"."Domain" TO "service_role";



GRANT ALL ON TABLE "public"."Membership" TO "anon";
GRANT ALL ON TABLE "public"."Membership" TO "authenticated";
GRANT ALL ON TABLE "public"."Membership" TO "service_role";



GRANT ALL ON TABLE "public"."Page" TO "authenticated";
GRANT ALL ON TABLE "public"."Page" TO "anon";
GRANT ALL ON TABLE "public"."Page" TO "service_role";



GRANT ALL ON TABLE "public"."Scan" TO "authenticated";
GRANT ALL ON TABLE "public"."Scan" TO "anon";
GRANT ALL ON TABLE "public"."Scan" TO "service_role";



GRANT ALL ON TABLE "public"."Space" TO "anon";
GRANT ALL ON TABLE "public"."Space" TO "authenticated";
GRANT ALL ON TABLE "public"."Space" TO "service_role";



GRANT ALL ON TABLE "public"."User" TO "anon";
GRANT ALL ON TABLE "public"."User" TO "authenticated";
GRANT ALL ON TABLE "public"."User" TO "service_role";



GRANT ALL ON TABLE "public"."user_audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."user_audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."user_audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."user_notifications" TO "anon";
GRANT ALL ON TABLE "public"."user_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."user_notifications" TO "service_role";



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
