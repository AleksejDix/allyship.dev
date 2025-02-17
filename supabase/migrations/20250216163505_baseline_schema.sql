

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






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






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
    NEW.updated_at = now();
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
    "space_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid"
);


ALTER TABLE "public"."Domain" OWNER TO "postgres";


COMMENT ON TABLE "public"."Domain" IS 'Domains belonging to spaces';



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



ALTER TABLE ONLY "public"."Space"
    ADD CONSTRAINT "Space_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_audit_logs"
    ADD CONSTRAINT "user_audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_notifications"
    ADD CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id");



CREATE INDEX "Domain_space_id_idx" ON "public"."Domain" USING "btree" ("space_id");



CREATE INDEX "idx_membership_owner_lookup" ON "public"."Membership" USING "btree" ("space_id", "role", "status") WHERE (("role" = 'owner'::"public"."MembershipRole") AND ("status" = 'active'::"public"."MembershipStatus"));



CREATE INDEX "idx_membership_space_user" ON "public"."Membership" USING "btree" ("space_id", "user_id", "status");



CREATE INDEX "idx_membership_space_user_role" ON "public"."Membership" USING "btree" ("space_id", "user_id", "role", "status");



CREATE INDEX "idx_personal_spaces" ON "public"."Space" USING "btree" ("created_by") WHERE ("is_personal" = true);



CREATE INDEX "idx_space_role_status" ON "public"."Membership" USING "btree" ("space_id", "role", "status");



CREATE INDEX "idx_space_role_status_priority" ON "public"."Membership" USING "btree" ("space_id", "role", "status") WHERE (("role" = ANY (ARRAY['admin'::"public"."MembershipRole", 'member'::"public"."MembershipRole"])) AND ("status" = 'active'::"public"."MembershipStatus"));



CREATE OR REPLACE TRIGGER "prevent_role_removal_trigger" BEFORE DELETE OR UPDATE ON "public"."Membership" FOR EACH ROW WHEN (("old"."role" = ANY (ARRAY['owner'::"public"."MembershipRole", 'admin'::"public"."MembershipRole"]))) EXECUTE FUNCTION "public"."prevent_owner_removal"();



CREATE OR REPLACE TRIGGER "set_domain_updated_at" BEFORE UPDATE ON "public"."Domain" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



ALTER TABLE ONLY "public"."Domain"
    ADD CONSTRAINT "Domain_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Domain"
    ADD CONSTRAINT "Domain_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."Space"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Domain"
    ADD CONSTRAINT "Domain_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Membership"
    ADD CONSTRAINT "Membership_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "public"."Space"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Membership"
    ADD CONSTRAINT "Membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Space"
    ADD CONSTRAINT "Space_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."Domain" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Domain_delete_policy" ON "public"."Domain" FOR DELETE TO "authenticated" USING (("space_id" IN ( SELECT "Membership"."space_id"
   FROM "public"."Membership"
  WHERE (("Membership"."user_id" = "auth"."uid"()) AND ("Membership"."role" = ANY (ARRAY['owner'::"public"."MembershipRole", 'admin'::"public"."MembershipRole"])) AND ("Membership"."status" = 'active'::"public"."MembershipStatus")))));



CREATE POLICY "Domain_insert_policy" ON "public"."Domain" FOR INSERT TO "authenticated" WITH CHECK (("space_id" IN ( SELECT "Membership"."space_id"
   FROM "public"."Membership"
  WHERE (("Membership"."user_id" = "auth"."uid"()) AND ("Membership"."role" = ANY (ARRAY['owner'::"public"."MembershipRole", 'admin'::"public"."MembershipRole"])) AND ("Membership"."status" = 'active'::"public"."MembershipStatus")))));



CREATE POLICY "Domain_select_policy" ON "public"."Domain" FOR SELECT TO "authenticated" USING (("space_id" IN ( SELECT "Membership"."space_id"
   FROM "public"."Membership"
  WHERE (("Membership"."user_id" = "auth"."uid"()) AND ("Membership"."status" = 'active'::"public"."MembershipStatus")))));



CREATE POLICY "Domain_update_policy" ON "public"."Domain" FOR UPDATE TO "authenticated" USING (("space_id" IN ( SELECT "Membership"."space_id"
   FROM "public"."Membership"
  WHERE (("Membership"."user_id" = "auth"."uid"()) AND ("Membership"."role" = ANY (ARRAY['owner'::"public"."MembershipRole", 'admin'::"public"."MembershipRole"])) AND ("Membership"."status" = 'active'::"public"."MembershipStatus"))))) WITH CHECK (("space_id" IN ( SELECT "Membership"."space_id"
   FROM "public"."Membership"
  WHERE (("Membership"."user_id" = "auth"."uid"()) AND ("Membership"."role" = ANY (ARRAY['owner'::"public"."MembershipRole", 'admin'::"public"."MembershipRole"])) AND ("Membership"."status" = 'active'::"public"."MembershipStatus")))));



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



ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can update their own active profile" ON "public"."User" FOR UPDATE USING ((("auth"."uid"() = "id") AND ("status" = 'active'::"text")));



CREATE POLICY "Users can view active profiles" ON "public"."User" FOR SELECT USING (("status" = 'active'::"text"));



ALTER TABLE "public"."user_audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_notifications" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";








GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































































































































GRANT ALL ON FUNCTION "public"."create_personal_space"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_personal_space"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_personal_space"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_role_level"("role" "public"."MembershipRole") TO "anon";
GRANT ALL ON FUNCTION "public"."get_role_level"("role" "public"."MembershipRole") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_role_level"("role" "public"."MembershipRole") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_owner_deactivation"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_owner_deactivation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_owner_deactivation"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_user_deletion"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_user_deletion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_user_deletion"() TO "service_role";



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



GRANT ALL ON FUNCTION "public"."verify_active_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."verify_active_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_active_user"() TO "service_role";
























GRANT ALL ON TABLE "public"."Domain" TO "anon";
GRANT ALL ON TABLE "public"."Domain" TO "authenticated";
GRANT ALL ON TABLE "public"."Domain" TO "service_role";



GRANT ALL ON TABLE "public"."Membership" TO "anon";
GRANT ALL ON TABLE "public"."Membership" TO "authenticated";
GRANT ALL ON TABLE "public"."Membership" TO "service_role";



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
