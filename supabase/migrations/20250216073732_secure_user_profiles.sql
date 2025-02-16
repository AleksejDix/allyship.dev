-- Create the User table first
CREATE TABLE IF NOT EXISTS "public"."User" (
    id UUID PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deletion_requested_at TIMESTAMPTZ,
    data_retention_period INTERVAL DEFAULT '6 months'::INTERVAL,
    CONSTRAINT status_check CHECK (status IN ('active', 'disabled', 'deleted'))
);

-- Add status column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_schema = 'public'
                  AND table_name = 'User'
                  AND column_name = 'status') THEN
        ALTER TABLE "public"."User" ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
        ALTER TABLE "public"."User" ADD CONSTRAINT status_check CHECK (status IN ('active', 'disabled', 'deleted'));
    END IF;
END $$;

-- Add other columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_schema = 'public'
                  AND table_name = 'User'
                  AND column_name = 'updated_at') THEN
        ALTER TABLE "public"."User" ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_schema = 'public'
                  AND table_name = 'User'
                  AND column_name = 'deleted_at') THEN
        ALTER TABLE "public"."User" ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_schema = 'public'
                  AND table_name = 'User'
                  AND column_name = 'deletion_requested_at') THEN
        ALTER TABLE "public"."User" ADD COLUMN deletion_requested_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_schema = 'public'
                  AND table_name = 'User'
                  AND column_name = 'data_retention_period') THEN
        ALTER TABLE "public"."User" ADD COLUMN data_retention_period INTERVAL DEFAULT '6 months'::INTERVAL;
    END IF;
END $$;

-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.user_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS to audit logs
ALTER TABLE public.user_audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_audit_logs;
DROP POLICY IF EXISTS "Enable select for admins only" ON public.user_audit_logs;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
    ON public.user_audit_logs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select for admins only"
    ON public.user_audit_logs
    FOR SELECT
    USING (auth.role() = 'service_role');

-- Modify User table to properly reference auth.users
ALTER TABLE "public"."User"
    ADD CONSTRAINT "User_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE NO ACTION;

-- Enable Row Level Security
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view active profiles" ON "public"."User";
DROP POLICY IF EXISTS "Users can update their own active profile" ON "public"."User";
DROP POLICY IF EXISTS "Admins can view all non-deleted profiles" ON "public"."User";

-- Create new policies
CREATE POLICY "Users can view active profiles"
    ON "public"."User"
    FOR SELECT
    USING (status = 'active');

CREATE POLICY "Users can update their own active profile"
    ON "public"."User"
    FOR UPDATE
    USING (auth.uid() = id AND status = 'active');

-- Function to mask IP addresses for GDPR compliance
CREATE OR REPLACE FUNCTION public.mask_ip_address(ip text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Return NULL if IP is NULL
    IF ip IS NULL THEN
        RETURN NULL;
    END IF;

    -- For IPv4
    IF ip ~ '^(\d{1,3}\.){3}\d{1,3}$' THEN
        RETURN regexp_replace(ip, '\d+$', 'XXX');
    END IF;

    -- For IPv6
    IF ip ~ ':' THEN
        RETURN regexp_replace(ip, ':[^:]+$', ':XXXX');
    END IF;

    -- For unknown formats, mask last part
    RETURN regexp_replace(ip, '[^.]+$', 'XXX');
END;
$$;

-- Function to log user actions
CREATE OR REPLACE FUNCTION public.log_user_action(
    user_id UUID,
    action TEXT,
    details JSONB DEFAULT NULL,
    ip_address TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Updated function to handle new user creation with logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to handle soft deletion (standard deactivation)
CREATE OR REPLACE FUNCTION public.handle_user_soft_deletion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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

-- Function to handle hard deletion (GDPR right to be forgotten)
CREATE OR REPLACE FUNCTION public.handle_user_hard_deletion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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

-- Create triggers for user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
    BEFORE DELETE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_hard_deletion();

-- Function to handle user metadata updates with logging
CREATE OR REPLACE FUNCTION public.handle_user_metadata_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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

DROP TRIGGER IF EXISTS on_auth_user_metadata_updated ON auth.users;
CREATE TRIGGER on_auth_user_metadata_updated
    AFTER UPDATE OF raw_user_meta_data ON auth.users
    FOR EACH ROW
    WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
    EXECUTE FUNCTION public.handle_user_metadata_update();

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(jwt jsonb DEFAULT auth.jwt())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- You can customize this logic based on your admin definition
    RETURN jwt ? 'is_admin';
END;
$$;

-- Enhanced GDPR deletion request function with admin override
CREATE OR REPLACE FUNCTION public.request_gdpr_deletion(
    user_id UUID,
    requester_id UUID DEFAULT NULL,
    reason TEXT DEFAULT 'user_requested',
    admin_override BOOLEAN DEFAULT FALSE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to clean up old audit logs
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs(
    retention_period INTERVAL DEFAULT '6 months'::INTERVAL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Add notification tracking table
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    error TEXT,
    CONSTRAINT user_notifications_status_check
        CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Add RLS to notifications
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Only allow system to insert, admins to view
CREATE POLICY "Enable system insert for notifications"
    ON public.user_notifications
    FOR INSERT
    WITH CHECK (auth.jwt() ? 'is_admin' OR auth.role() = 'service_role');

CREATE POLICY "Enable admin select for notifications"
    ON public.user_notifications
    FOR SELECT
    USING (auth.jwt() ? 'is_admin');

-- Function to queue a notification
CREATE OR REPLACE FUNCTION public.queue_user_notification(
    user_id UUID,
    notification_type TEXT,
    details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Enhanced cleanup function with notification support
CREATE OR REPLACE FUNCTION public.cleanup_disabled_accounts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Enhanced reactivation function with notification
CREATE OR REPLACE FUNCTION public.reactivate_user(
    user_id UUID,
    admin_id UUID,
    reason TEXT DEFAULT 'admin_requested'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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
