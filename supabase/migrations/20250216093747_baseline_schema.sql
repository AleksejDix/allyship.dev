-- Drop existing types and tables if they exist
DROP TYPE IF EXISTS public."MembershipStatus" CASCADE;
DROP TYPE IF EXISTS public."MembershipRole" CASCADE;
DROP TABLE IF EXISTS public."Membership" CASCADE;
DROP TABLE IF EXISTS public."Space" CASCADE;
DROP TABLE IF EXISTS public."User" CASCADE;
DROP TABLE IF EXISTS public.user_audit_logs CASCADE;
DROP TABLE IF EXISTS public.user_notifications CASCADE;

-- Create extensions
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "pg_cron" SCHEMA extensions CASCADE;
CREATE EXTENSION IF NOT EXISTS "http" SCHEMA extensions CASCADE;

-- Grant usage on the extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Set up the search path
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Create enum types
CREATE TYPE public."MembershipStatus" AS ENUM ('active', 'inactive', 'pending', 'banned');
CREATE TYPE public."MembershipRole" AS ENUM ('owner', 'admin', 'member');

-- Create User table
CREATE TABLE public."User" (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deletion_requested_at TIMESTAMPTZ,
    data_retention_period INTERVAL DEFAULT '6 months'::INTERVAL,
    CONSTRAINT status_check CHECK (status IN ('active', 'disabled', 'deleted'))
);

-- Create Space table
CREATE TABLE public."Space" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_personal BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    transfer_token UUID,
    transfer_token_expires_at TIMESTAMPTZ
);

-- Create Membership table
CREATE TABLE public."Membership" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_id UUID NOT NULL REFERENCES public."Space"(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public."MembershipRole" NOT NULL DEFAULT 'member',
    status public."MembershipStatus" NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(space_id, user_id)
);

-- Create audit logs table
CREATE TABLE public.user_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create notification tracking table
CREATE TABLE public.user_notifications (
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

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_membership_owner_lookup
    ON public."Membership" (space_id, role, status)
    WHERE role = 'owner' AND status = 'active';

CREATE INDEX IF NOT EXISTS idx_membership_space_user
    ON public."Membership" (space_id, user_id, status);

CREATE INDEX IF NOT EXISTS idx_membership_space_user_role
    ON public."Membership" (space_id, user_id, role, status);

CREATE INDEX IF NOT EXISTS idx_space_role_status
    ON public."Membership" (space_id, role, status);

CREATE INDEX IF NOT EXISTS idx_space_role_status_priority
    ON public."Membership" (space_id, role, status)
    WHERE role IN ('admin', 'member') AND status = 'active';

-- Add comments
COMMENT ON TABLE public."Space" IS 'Spaces that users can be members of';
COMMENT ON TABLE public."Membership" IS 'User memberships in spaces';
COMMENT ON TYPE public."MembershipStatus" IS 'Status of a user''s membership in a space';
COMMENT ON TYPE public."MembershipRole" IS 'Role of a user in a space';

-- Create utility functions
CREATE OR REPLACE FUNCTION public.get_role_level(role public."MembershipRole")
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
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

-- Function to mask IP addresses
CREATE OR REPLACE FUNCTION public.mask_ip_address(ip text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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

-- Function to queue notifications
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

-- Function to create personal space
CREATE OR REPLACE FUNCTION public.create_personal_space()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to verify active user
CREATE OR REPLACE FUNCTION public.verify_active_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to prevent owner/admin removal
CREATE OR REPLACE FUNCTION public.prevent_owner_removal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to handle owner deactivation
CREATE OR REPLACE FUNCTION public.handle_owner_deactivation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create triggers
CREATE TRIGGER on_auth_user_created_create_space
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_personal_space();

CREATE TRIGGER prevent_role_removal_trigger
    BEFORE DELETE OR UPDATE ON public."Membership"
    FOR EACH ROW
    WHEN (OLD.role IN ('owner', 'admin'))
    EXECUTE FUNCTION public.prevent_owner_removal();

CREATE TRIGGER owner_deactivation_handler
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.raw_user_meta_data->>'status' = 'active' AND NEW.raw_user_meta_data->>'status' != 'active')
    EXECUTE FUNCTION public.handle_owner_deactivation();

-- Enable RLS
ALTER TABLE public."Space" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Space access policy"
    ON public."Space"
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Membership"
            WHERE space_id = id
            AND user_id = auth.uid()
            AND status = 'active'
        )
    );

CREATE POLICY "Membership access policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (
        space_id IN (
            SELECT space_id FROM "Membership"
            WHERE user_id = auth.uid()
            AND status = 'active'
        )
    );

CREATE POLICY "Membership update policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN "Membership" m ON m.user_id = u.id
            WHERE m.space_id = "Membership".space_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
            AND u.raw_user_meta_data->>'status' = 'active'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN "Membership" m ON m.user_id = u.id
            WHERE m.space_id = "Membership".space_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
            AND u.raw_user_meta_data->>'status' = 'active'
        )
        AND (
            (
                EXISTS (
                    SELECT 1 FROM "Membership" m2
                    JOIN auth.users u ON u.id = m2.user_id
                    WHERE m2.space_id = "Membership".space_id
                    AND m2.user_id = auth.uid()
                    AND m2.role = 'owner'
                    AND m2.status = 'active'
                    AND u.raw_user_meta_data->>'status' = 'active'
                )
                AND NOT (
                    "Membership".user_id = auth.uid()
                    AND "Membership".role = 'owner'
                    AND "Membership".role != role
                )
            )
            OR (
                EXISTS (
                    SELECT 1 FROM "Membership" m2
                    JOIN auth.users u ON u.id = m2.user_id
                    WHERE m2.space_id = "Membership".space_id
                    AND m2.user_id = auth.uid()
                    AND m2.role = 'admin'
                    AND m2.status = 'active'
                    AND u.raw_user_meta_data->>'status' = 'active'
                )
                AND NOT ("Membership".role IN ('owner', 'admin'))
                AND public.get_role_level(role) <= public.get_role_level('member')
                AND NOT (
                    "Membership".user_id = auth.uid()
                    AND "Membership".role = 'admin'
                    AND "Membership".role != role
                )
            )
        )
    );

CREATE POLICY "Enable insert for authenticated users only"
    ON public.user_audit_logs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select for admins only"
    ON public.user_audit_logs
    FOR SELECT
    USING (auth.role() = 'service_role');

CREATE POLICY "Enable system insert for notifications"
    ON public.user_notifications
    FOR INSERT
    WITH CHECK (auth.jwt() ? 'is_admin' OR auth.role() = 'service_role');

CREATE POLICY "Enable admin select for notifications"
    ON public.user_notifications
    FOR SELECT
    USING (auth.jwt() ? 'is_admin');
