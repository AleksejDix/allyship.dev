-- Drop existing policies to update them
DROP POLICY IF EXISTS "Membership delete policy" ON public."Membership";
DROP POLICY IF EXISTS "Membership update policy" ON public."Membership";

-- Update delete policy to prevent admins from removing owners
CREATE POLICY "Membership delete policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR DELETE
    TO authenticated
    USING (
        -- Allow owners to remove any member (except themselves)
        (
            EXISTS (
                SELECT 1 FROM "Membership" m2
                WHERE m2.space_id = space_id
                AND m2.user_id = auth.uid()
                AND m2.role = 'owner'
                AND m2.status = 'active'
            )
            AND NOT (role = 'owner' AND user_id = auth.uid())
        )
        -- Allow admins to remove only non-owners
        OR (
            EXISTS (
                SELECT 1 FROM "Membership" m2
                WHERE m2.space_id = space_id
                AND m2.user_id = auth.uid()
                AND m2.role = 'admin'
                AND m2.status = 'active'
            )
            AND NOT (role = 'owner')
        )
    );

-- Update policy to prevent role escalation
CREATE POLICY "Membership update policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Membership" m2
            WHERE m2.space_id = space_id
            AND m2.user_id = auth.uid()
            AND m2.role IN ('owner', 'admin')
            AND m2.status = 'active'
        )
    )
    WITH CHECK (
        -- Owners can modify any role
        (
            EXISTS (
                SELECT 1 FROM "Membership" m2
                WHERE m2.space_id = space_id
                AND m2.user_id = auth.uid()
                AND m2.role = 'owner'
                AND m2.status = 'active'
            )
        )
        -- Admins can only manage non-owners and cannot escalate to owner
        OR (
            EXISTS (
                SELECT 1 FROM "Membership" m2
                WHERE m2.space_id = space_id
                AND m2.user_id = auth.uid()
                AND m2.role = 'admin'
                AND m2.status = 'active'
            )
            AND NOT (NEW.role = 'owner')
            AND NOT (
                OLD.role = 'owner'  -- Cannot modify owner roles
                OR NEW.role > OLD.role  -- Cannot escalate roles beyond their own
            )
        )
    );

-- Add function to log membership changes
CREATE OR REPLACE FUNCTION public.log_membership_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    action_user_id UUID;
    action_type TEXT;
    action_details JSONB;
BEGIN
    -- Get the user performing the action
    action_user_id := auth.uid();

    -- Handle different operation types
    IF TG_OP = 'DELETE' THEN
        action_type := 'membership_removed';
        action_details := jsonb_build_object(
            'space_id', OLD.space_id,
            'role', OLD.role,
            'status', OLD.status,
            'removed_by', action_user_id,
            'membership_duration', age(NOW(), OLD.created_at)
        );

        -- Log for both the member and the remover
        PERFORM public.log_user_action(
            OLD.user_id,
            action_type,
            action_details
        );

        IF action_user_id != OLD.user_id THEN
            PERFORM public.log_user_action(
                action_user_id,
                'removed_member',
                action_details
            );
        END IF;

        RETURN OLD;
    END IF;

    -- Handle updates
    IF TG_OP = 'UPDATE' THEN
        -- Determine the type of update
        IF NEW.role != OLD.role THEN
            action_type := 'role_updated';
            action_details := jsonb_build_object(
                'space_id', NEW.space_id,
                'old_role', OLD.role,
                'new_role', NEW.role,
                'updated_by', action_user_id
            );
        ELSIF NEW.status != OLD.status THEN
            action_type := 'status_updated';
            action_details := jsonb_build_object(
                'space_id', NEW.space_id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'updated_by', action_user_id
            );
        ELSE
            action_type := 'membership_updated';
            action_details := jsonb_build_object(
                'space_id', NEW.space_id,
                'updated_by', action_user_id,
                'changes', jsonb_build_object(
                    'role', CASE WHEN NEW.role != OLD.role
                               THEN jsonb_build_object('old', OLD.role, 'new', NEW.role)
                               ELSE NULL END,
                    'status', CASE WHEN NEW.status != OLD.status
                                 THEN jsonb_build_object('old', OLD.status, 'new', NEW.status)
                                 ELSE NULL END
                )
            );
        END IF;

        -- Log for both the member and the updater
        PERFORM public.log_user_action(
            NEW.user_id,
            action_type,
            action_details
        );

        IF action_user_id != NEW.user_id THEN
            PERFORM public.log_user_action(
                action_user_id,
                'updated_member',
                action_details
            );
        END IF;

        -- Queue notification for role changes
        IF NEW.role != OLD.role THEN
            PERFORM public.queue_user_notification(
                NEW.user_id,
                'role_changed',
                jsonb_build_object(
                    'space_id', NEW.space_id,
                    'old_role', OLD.role,
                    'new_role', NEW.role,
                    'changed_by', action_user_id
                )
            );
        END IF;

        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$;

-- Attach trigger to Membership table
DROP TRIGGER IF EXISTS membership_log_trigger ON public."Membership";
CREATE TRIGGER membership_log_trigger
    AFTER UPDATE OR DELETE ON public."Membership"
    FOR EACH ROW
    EXECUTE FUNCTION public.log_membership_changes();

-- Add indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_membership_space
    ON public."Membership" (space_id)
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_membership_user
    ON public."Membership" (user_id)
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_membership_role
    ON public."Membership" (space_id, role)
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_membership_lookup
    ON public."Membership" (space_id, user_id)
    WHERE status = 'active';

-- Add function to get role hierarchy
CREATE OR REPLACE FUNCTION public.get_role_level(role public.MembershipRole)
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

-- Add function to check if user can modify role
CREATE OR REPLACE FUNCTION public.can_modify_role(
    space_id UUID,
    target_role public.MembershipRole
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role public.MembershipRole;
BEGIN
    -- Get the current user's role in the space
    SELECT role INTO user_role
    FROM "Membership"
    WHERE space_id = can_modify_role.space_id
    AND user_id = auth.uid()
    AND status = 'active';

    -- Only allow modifying roles lower than your own
    RETURN public.get_role_level(user_role) > public.get_role_level(target_role);
END;
$$;
