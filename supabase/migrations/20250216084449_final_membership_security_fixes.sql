-- Drop existing policies to update them
DROP POLICY IF EXISTS "Membership update policy" ON public."Membership";
DROP POLICY IF EXISTS "Membership delete policy" ON public."Membership";

-- Update policy to prevent owner modifications by admins and restrict role downgrades
CREATE POLICY "Membership update policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (
        -- Admins & Owners can modify memberships
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
            -- Prevent owners from demoting themselves
            AND NOT (
                OLD.user_id = auth.uid()
                AND OLD.role = 'owner'
                AND NEW.role != 'owner'
            )
        )
        -- Admins can only modify non-owners and cannot escalate beyond their level
        OR (
            EXISTS (
                SELECT 1 FROM "Membership" m2
                WHERE m2.space_id = space_id
                AND m2.user_id = auth.uid()
                AND m2.role = 'admin'
                AND m2.status = 'active'
            )
            AND NOT (OLD.role = 'owner')  -- Prevent admins from modifying owners
            AND public.get_role_level(NEW.role) <= public.get_role_level('admin')  -- Prevent role escalation
        )
    );

-- Update delete policy to prevent owner self-removal
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
            AND NOT (role = 'owner')  -- Prevent removing owners
            AND user_id != auth.uid()  -- Prevent self-removal
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
            AND NOT (role = 'owner')  -- Prevent admins from removing owners
            AND user_id != auth.uid()  -- Prevent self-removal
        )
    );

-- Add function to log denied membership actions
CREATE OR REPLACE FUNCTION public.log_denied_membership_action()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    action_user_id UUID;
    action_type TEXT;
    denial_reason TEXT;
BEGIN
    action_user_id := auth.uid();

    -- Determine the type of denied action
    IF TG_OP = 'DELETE' THEN
        action_type := 'membership_deletion_denied';

        -- Determine reason for denial
        IF OLD.role = 'owner' THEN
            denial_reason := 'Cannot remove owner';
        ELSIF OLD.user_id = action_user_id THEN
            denial_reason := 'Cannot remove self';
        ELSE
            denial_reason := 'Insufficient permissions';
        END IF;
    ELSE
        action_type := 'membership_update_denied';

        -- Determine reason for denial
        IF OLD.role = 'owner' AND NEW.role != 'owner' THEN
            denial_reason := 'Cannot demote owner';
        ELSIF public.get_role_level(NEW.role) > public.get_role_level(OLD.role) THEN
            denial_reason := 'Cannot escalate role beyond own level';
        ELSE
            denial_reason := 'Insufficient permissions';
        END IF;
    END IF;

    -- Log the denied action
    PERFORM public.log_user_action(
        action_user_id,
        action_type,
        jsonb_build_object(
            'space_id', OLD.space_id,
            'target_user_id', OLD.user_id,
            'attempted_action', TG_OP,
            'reason', denial_reason,
            'details', CASE
                WHEN TG_OP = 'UPDATE' THEN jsonb_build_object(
                    'current_role', OLD.role,
                    'attempted_role', NEW.role
                )
                ELSE NULL
            END
        )
    );

    -- Queue notification for serious attempts
    IF OLD.role = 'owner' OR NEW.role = 'owner' THEN
        PERFORM public.queue_user_notification(
            -- Notify space owner
            (
                SELECT user_id
                FROM "Membership"
                WHERE space_id = OLD.space_id
                AND role = 'owner'
                AND status = 'active'
                LIMIT 1
            ),
            'unauthorized_owner_modification_attempt',
            jsonb_build_object(
                'space_id', OLD.space_id,
                'attempted_by', action_user_id,
                'action', TG_OP,
                'reason', denial_reason
            )
        );
    END IF;

    RETURN NULL;
END;
$$;

-- Create trigger for denied actions
DROP TRIGGER IF EXISTS membership_denied_action_trigger ON public."Membership";
CREATE TRIGGER membership_denied_action_trigger
    AFTER UPDATE OR DELETE ON public."Membership"
    FOR EACH ROW
    WHEN (
        -- For updates: when trying to modify owner or escalate role
        (TG_OP = 'UPDATE' AND (
            OLD.role = 'owner'
            OR public.get_role_level(NEW.role) > public.get_role_level(OLD.role)
        ))
        -- For deletes: when trying to remove owner or self
        OR (TG_OP = 'DELETE' AND (
            OLD.role = 'owner'
            OR OLD.user_id = auth.uid()
        ))
    )
    EXECUTE FUNCTION public.log_denied_membership_action();

-- Add optimized composite indexes
CREATE INDEX IF NOT EXISTS idx_membership_space_role_status
    ON public."Membership" (space_id, role, status);

CREATE INDEX IF NOT EXISTS idx_membership_user_role_status
    ON public."Membership" (user_id, role, status);

CREATE INDEX IF NOT EXISTS idx_membership_role_status
    ON public."Membership" (role, status)
    WHERE role = 'owner';  -- Optimize owner lookups

-- Add function to safely transfer ownership
CREATE OR REPLACE FUNCTION public.transfer_space_ownership(
    space_id UUID,
    new_owner_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_owner_id UUID;
BEGIN
    -- Verify the current user is the space owner
    SELECT user_id INTO current_owner_id
    FROM "Membership"
    WHERE space_id = transfer_space_ownership.space_id
    AND role = 'owner'
    AND status = 'active';

    IF current_owner_id != auth.uid() THEN
        RAISE EXCEPTION 'Only the current owner can transfer ownership';
    END IF;

    -- Verify the new owner is an active member
    IF NOT EXISTS (
        SELECT 1 FROM "Membership"
        WHERE space_id = transfer_space_ownership.space_id
        AND user_id = new_owner_id
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'New owner must be an active member of the space';
    END IF;

    -- Begin ownership transfer
    UPDATE "Membership"
    SET role = 'admin'
    WHERE space_id = transfer_space_ownership.space_id
    AND user_id = current_owner_id;

    UPDATE "Membership"
    SET role = 'owner'
    WHERE space_id = transfer_space_ownership.space_id
    AND user_id = new_owner_id;

    -- Log the transfer
    PERFORM public.log_user_action(
        current_owner_id,
        'ownership_transferred',
        jsonb_build_object(
            'space_id', space_id,
            'new_owner_id', new_owner_id
        )
    );

    -- Notify the new owner
    PERFORM public.queue_user_notification(
        new_owner_id,
        'ownership_received',
        jsonb_build_object(
            'space_id', space_id,
            'previous_owner_id', current_owner_id
        )
    );

    RETURN true;
END;
$$;
