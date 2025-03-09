create extension if not exists "http" with schema "extensions";

create extension if not exists "wrappers" with schema "extensions";


drop trigger if exists "set_updated_at" on "public"."Memberships";

drop trigger if exists "set_updated_at" on "public"."Space";

drop trigger if exists "set_updated_at" on "public"."Website";

drop function if exists "public"."is_valid_user"();

alter table "public"."Page" add column "deleted_at" timestamp with time zone;

alter table "public"."Memberships" add constraint "Memberships_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."Memberships" validate constraint "Memberships_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cleanup_disabled_accounts()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs(retention_period interval DEFAULT '6 mons'::interval)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.create_personal_space()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_owner_deactivation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_user_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_user_hard_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_user_metadata_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_user_soft_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin(jwt jsonb DEFAULT auth.jwt())
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- You can customize this logic based on your admin definition
    RETURN jwt ? 'is_admin';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_user_action(user_id uuid, action text, details jsonb DEFAULT NULL::jsonb, ip_address text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.user_audit_logs (user_id, action, details, ip_address)
    VALUES (
        user_id,
        action,
        details,
        public.mask_ip_address(ip_address)
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_owner_removal()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.queue_user_notification(user_id uuid, notification_type text, details jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.reactivate_user(user_id uuid, admin_id uuid, reason text DEFAULT 'admin_requested'::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.request_gdpr_deletion(user_id uuid, requester_id uuid DEFAULT NULL::uuid, reason text DEFAULT 'user_requested'::text, admin_override boolean DEFAULT false)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.verify_active_user()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users u
        JOIN "Membership" m ON m.user_id = u.id
        WHERE u.id = auth.uid()
        AND u.raw_user_meta_data->>'status' = 'active'
        AND m.status = 'active'
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Add error handling
    BEGIN
        -- Create a personal space for the new user
        INSERT INTO public."Space" (name, owner_id, is_personal)
        VALUES (
            'Personal Space',
            NEW.id,
            true
        );
    EXCEPTION
        WHEN OTHERS THEN
            -- Log the error but don't prevent the user from being created
            RAISE WARNING 'Error creating personal space: %', SQLERRM;
    END;

    -- Always return NEW to allow the user creation to proceed
    RETURN NEW;
END;
$function$
;

create policy "Space members can delete their spaces"
on "public"."Space"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM "Memberships"
  WHERE (("Memberships".space_id = "Memberships".id) AND ("Memberships".user_id = auth.uid()) AND ("Memberships".deleted_at IS NULL)))));


create policy "Space members can update their spaces"
on "public"."Space"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM "Memberships"
  WHERE (("Memberships".space_id = "Memberships".id) AND ("Memberships".user_id = auth.uid()) AND ("Memberships".deleted_at IS NULL)))))
with check ((EXISTS ( SELECT 1
   FROM "Memberships"
  WHERE (("Memberships".space_id = "Memberships".id) AND ("Memberships".user_id = auth.uid()) AND ("Memberships".deleted_at IS NULL)))));


create policy "Users can create spaces"
on "public"."Space"
as permissive
for insert
to authenticated
with check (true);



