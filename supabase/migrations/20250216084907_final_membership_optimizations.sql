-- Drop existing policies to update them
DROP POLICY IF EXISTS "Membership update policy" ON public."Membership";

-- Update policy to prevent admin demotion and role escalation
CREATE POLICY "Membership update policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (
        -- Verify both users are active
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN "Membership" m ON m.user_id = u.id
            WHERE m.space_id = space_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
            AND u.status = 'active'
        )
    )
    WITH CHECK (
        -- Verify both users are active
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN "Membership" m ON m.user_id = u.id
            WHERE m.space_id = space_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
            AND u.status = 'active'
        )
        AND (
            -- Owners can modify any role except self-demotion
            (
                EXISTS (
                    SELECT 1 FROM "Membership" m2
                    JOIN auth.users u ON u.id = m2.user_id
                    WHERE m2.space_id = space_id
                    AND m2.user_id = auth.uid()
                    AND m2.role = 'owner'
                    AND m2.status = 'active'
                    AND u.status = 'active'
                )
                -- Prevent owners from demoting themselves
                AND NOT (
                    OLD.user_id = auth.uid()
                    AND OLD.role = 'owner'
                    AND NEW.role != 'owner'
                )
            )
            -- Admins can only modify non-admins and non-owners
            OR (
                EXISTS (
                    SELECT 1 FROM "Membership" m2
                    JOIN auth.users u ON u.id = m2.user_id
                    WHERE m2.space_id = space_id
                    AND m2.user_id = auth.uid()
                    AND m2.role = 'admin'
                    AND m2.status = 'active'
                    AND u.status = 'active'
                )
                AND NOT (OLD.role IN ('owner', 'admin'))  -- Prevent modifying owners and admins
                AND public.get_role_level(NEW.role) <= public.get_role_level('member')  -- Can only set to member role
                -- Prevent admin self-demotion
                AND NOT (
                    OLD.user_id = auth.uid()
                    AND OLD.role = 'admin'
                    AND NEW.role != 'admin'
                )
            )
        )
    );

-- Add optimized index for owner lookups
CREATE INDEX IF NOT EXISTS idx_membership_owner_lookup
    ON public."Membership" (space_id, role, status)
    WHERE role = 'owner' AND status = 'active';

-- Add composite index for faster membership lookups
CREATE INDEX IF NOT EXISTS idx_membership_space_user
    ON public."Membership" (space_id, user_id, status);

-- Add composite index for all space-related queries
CREATE INDEX IF NOT EXISTS idx_membership_space_user_role
    ON public."Membership" (space_id, user_id, role, status);

-- Add optimized index for role-based queries
CREATE INDEX IF NOT EXISTS idx_space_role_status
    ON public."Membership" (space_id, role, status);

-- Add optimized index for role-based priority lookups
CREATE INDEX IF NOT EXISTS idx_space_role_status_priority
    ON public."Membership" (space_id, role, status)
    WHERE role IN ('admin', 'member') AND status = 'active';

-- Update function to log unauthorized access attempts
CREATE OR REPLACE FUNCTION public.log_denied_membership_action()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    action_user_id UUID;
    action_type TEXT;
    denial_reason TEXT;
    user_role public.MembershipRole;
    space_name TEXT;
BEGIN
    -- Verify active user session
    IF NOT public.verify_active_user() THEN
        RAISE EXCEPTION 'Invalid user session';
    END IF;

    action_user_id := auth.uid();

    -- Get space name for better logging
    SELECT s.name INTO space_name
    FROM "Space" s
    WHERE s.id = OLD.space_id;

    -- Get the user's role with safe default
    SELECT COALESCE(m.role, 'member') INTO user_role
    FROM "Membership" m
    WHERE m.space_id = OLD.space_id
    AND m.user_id = action_user_id
    AND m.status = 'active';

    -- Determine the type of denied action
    IF TG_OP = 'DELETE' THEN
        action_type := 'membership_deletion_denied';

        -- Determine reason for denial
        IF OLD.role = 'owner' THEN
            denial_reason := 'Cannot remove owner';
        ELSIF OLD.user_id = action_user_id THEN
            denial_reason := 'Cannot remove self';
        ELSIF user_role IS NULL THEN
            denial_reason := 'Unauthorized: Not a member of the space';
        ELSIF user_role = 'member' THEN
            denial_reason := 'Unauthorized: Regular members cannot remove others';
        ELSE
            denial_reason := 'Insufficient permissions';
        END IF;
    ELSE
        action_type := 'membership_update_denied';

        -- Determine reason for denial
        IF OLD.role = 'owner' AND NEW.role != 'owner' THEN
            denial_reason := 'Cannot demote owner';
        ELSIF OLD.role = 'admin' AND user_role = 'admin' THEN
            denial_reason := 'Admins cannot modify other admins';
        ELSIF public.get_role_level(NEW.role) > public.get_role_level(user_role) THEN
            denial_reason := 'Cannot escalate role beyond own level';
        ELSIF user_role IS NULL THEN
            denial_reason := 'Unauthorized: Not a member of the space';
        ELSIF user_role = 'member' THEN
            denial_reason := 'Unauthorized: Regular members cannot modify roles';
        ELSE
            denial_reason := 'Insufficient permissions';
        END IF;
    END IF;

    -- Log the denied action with detailed context including space name
    PERFORM public.log_user_action(
        action_user_id,
        action_type,
        jsonb_build_object(
            'space_id', OLD.space_id,
            'space_name', space_name,
            'target_user_id', OLD.user_id,
            'attempted_action', TG_OP,
            'reason', denial_reason,
            'user_role', user_role,
            'timestamp', clock_timestamp(),
            'details', CASE
                WHEN TG_OP = 'UPDATE' THEN jsonb_build_object(
                    'current_role', OLD.role,
                    'attempted_role', NEW.role,
                    'target_status', OLD.status,
                    'space_name', space_name
                )
                ELSE jsonb_build_object(
                    'target_role', OLD.role,
                    'target_status', OLD.status,
                    'space_name', space_name
                )
            END
        )
    );

    -- Queue notification for serious attempts with space name
    IF (OLD.role = 'owner' OR NEW.role = 'owner' OR user_role IS NULL) THEN
        PERFORM public.queue_user_notification(
            (
                SELECT user_id
                FROM "Membership"
                WHERE space_id = OLD.space_id
                AND role = 'owner'
                AND status = 'active'
                LIMIT 1
            ),
            'unauthorized_membership_modification_attempt',
            jsonb_build_object(
                'space_id', OLD.space_id,
                'space_name', space_name,
                'attempted_by', action_user_id,
                'action', TG_OP,
                'reason', denial_reason,
                'severity', CASE
                    WHEN user_role IS NULL THEN 'high'
                    WHEN OLD.role = 'owner' THEN 'critical'
                    ELSE 'medium'
                END
            )
        );
    END IF;

    RETURN NULL;
END;
$$;

-- Update prevent_owner_removal to also protect against admin depletion
CREATE OR REPLACE FUNCTION public.prevent_owner_removal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check owner removal/downgrade
    IF OLD.role = 'owner' AND (TG_OP = 'DELETE' OR NEW.role != 'owner') THEN
        -- Prevent removing or downgrading the last owner
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

    -- Check admin removal/downgrade
    IF OLD.role = 'admin' AND (TG_OP = 'DELETE' OR NEW.role != 'admin') THEN
        -- Ensure at least one other admin exists
        IF NOT EXISTS (
            SELECT 1 FROM "Membership"
            WHERE space_id = OLD.space_id
            AND role IN ('owner', 'admin')  -- Include owners in the count since they have admin privileges
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

-- Update trigger to also catch admin removals
DROP TRIGGER IF EXISTS prevent_owner_removal_trigger ON public."Membership";
CREATE TRIGGER prevent_role_removal_trigger  -- Renamed to reflect broader purpose
    BEFORE DELETE OR UPDATE ON public."Membership"
    FOR EACH ROW
    WHEN (
        -- Trigger for both owner and admin role changes
        (OLD.role IN ('owner', 'admin'))
    )
    EXECUTE FUNCTION public.prevent_owner_removal();

-- Update ownership transfer function to prevent self-transfer
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
    space_name TEXT;
BEGIN
    -- Verify active user session
    IF NOT public.verify_active_user() THEN
        RAISE EXCEPTION 'Invalid user session';
    END IF;

    -- Verify the current user is the space owner
    SELECT user_id INTO current_owner_id
    FROM "Membership"
    WHERE space_id = transfer_space_ownership.space_id
    AND role = 'owner'
    AND status = 'active';

    -- Prevent self-transfer
    IF new_owner_id = auth.uid() THEN
        RAISE EXCEPTION 'You are already the owner of this space';
    END IF;

    -- Get space name for notifications
    SELECT name INTO space_name
    FROM "Space"
    WHERE id = space_id;

    -- Verify the new owner is both an active member and has an active account
    IF NOT EXISTS (
        SELECT 1 FROM "Membership" m
        JOIN auth.users u ON u.id = m.user_id
        WHERE m.space_id = transfer_space_ownership.space_id
        AND m.user_id = new_owner_id
        AND m.status = 'active'
        AND u.status = 'active'
    ) THEN
        RAISE EXCEPTION 'New owner must be an active member of the space and have an active account';
    END IF;

    -- Begin ownership transfer
    UPDATE "Membership"
    SET
        role = 'admin',
        updated_at = NOW()
    WHERE space_id = transfer_space_ownership.space_id
    AND user_id = current_owner_id;

    UPDATE "Membership"
    SET
        role = 'owner',
        updated_at = NOW()
    WHERE space_id = transfer_space_ownership.space_id
    AND user_id = new_owner_id;

    -- Log the transfer with detailed context
    PERFORM public.log_user_action(
        current_owner_id,
        'ownership_transferred',
        jsonb_build_object(
            'space_id', space_id,
            'space_name', space_name,
            'new_owner_id', new_owner_id,
            'previous_owner_id', current_owner_id,
            'transfer_time', clock_timestamp()
        )
    );

    -- Notify both parties
    -- Notify the new owner
    PERFORM public.queue_user_notification(
        new_owner_id,
        'ownership_received',
        jsonb_build_object(
            'space_id', space_id,
            'space_name', space_name,
            'previous_owner_id', current_owner_id,
            'transfer_time', clock_timestamp()
        )
    );

    -- Notify the previous owner
    PERFORM public.queue_user_notification(
        current_owner_id,
        'ownership_transferred_confirmation',
        jsonb_build_object(
            'space_id', space_id,
            'space_name', space_name,
            'new_owner_id', new_owner_id,
            'transfer_time', clock_timestamp()
        )
    );

    RETURN true;
END;
$$;

-- Add function to check if a user can be promoted to a role
CREATE OR REPLACE FUNCTION public.can_be_promoted_to_role(
    space_id UUID,
    user_id UUID,
    target_role public.MembershipRole
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role public.MembershipRole;
    target_user_role public.MembershipRole;
BEGIN
    -- Secure role check via explicit join with auth.users
    SELECT m.role INTO current_user_role
    FROM "Membership" m
    JOIN auth.users u ON u.id = m.user_id
    WHERE m.space_id = can_be_promoted_to_role.space_id
    AND m.user_id = auth.uid()
    AND m.status = 'active'
    AND u.status = 'active';

    -- Ensure target user exists and is active
    SELECT m.role INTO target_user_role
    FROM "Membership" m
    JOIN auth.users u ON u.id = m.user_id
    WHERE m.space_id = can_be_promoted_to_role.space_id
    AND m.user_id = can_be_promoted_to_role.user_id
    AND m.status = 'active'
    AND u.status = 'active';

    -- If either user's role is null, they don't have valid access
    IF current_user_role IS NULL OR target_user_role IS NULL THEN
        RETURN false;
    END IF;

    -- Validate role promotion rules with additional checks
    RETURN (
        -- Current user must have higher role than target role
        public.get_role_level(current_user_role) > public.get_role_level(target_role)
        -- Target user's current role must be lower than target role
        AND public.get_role_level(target_user_role) < public.get_role_level(target_role)
        -- Only owners can promote to owner
        AND (target_role != 'owner' OR current_user_role = 'owner')
        -- Prevent self-promotion
        AND auth.uid() != user_id
    );
END;
$$;

-- Add function to verify active user session
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
        AND u.status = 'active'
        AND m.status = 'active'
    );
END;
$$;

-- Update handle_owner_deactivation to use the optimized index
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
    -- Find spaces where the deactivating user is an owner
    FOR space_id, space_name IN
        SELECT m.space_id, s.name
        FROM "Membership" m
        JOIN "Space" s ON s.id = m.space_id
        WHERE m.user_id = OLD.id
        AND m.role = 'owner'
        AND m.status = 'active'
    LOOP
        -- Find the next highest-ranking member for each space
        -- Uses the optimized idx_space_role_status_priority index
        -- Query is structured to use the index effectively
        SELECT user_id INTO next_owner
        FROM (
            -- Get admins first (will use index)
            SELECT user_id, 1 as priority
            FROM "Membership"
            WHERE space_id = space_id
            AND user_id != OLD.id
            AND role = 'admin'
            AND status = 'active'
            UNION ALL
            -- Then get members if no admin found (will use index)
            SELECT user_id, 2 as priority
            FROM "Membership"
            WHERE space_id = space_id
            AND user_id != OLD.id
            AND role = 'member'
            AND status = 'active'
        ) ranked_members
        ORDER BY priority
        LIMIT 1;

        -- If no valid members are found, prevent deactivation
        IF next_owner IS NULL THEN
            RAISE EXCEPTION 'Cannot deactivate account: You are the last owner of space "%"', space_name;
        END IF;

        -- Transfer ownership
        UPDATE "Membership"
        SET
            role = 'owner',
            updated_at = clock_timestamp()
        WHERE space_id = space_id
        AND user_id = next_owner;

        -- Demote current owner
        UPDATE "Membership"
        SET
            role = 'admin',
            updated_at = clock_timestamp()
        WHERE space_id = space_id
        AND user_id = OLD.id;

        -- Log the automatic transfer with additional context
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

        -- Notify the new owner with enhanced context
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

-- Create trigger for owner deactivation
DROP TRIGGER IF EXISTS owner_deactivation_handler ON auth.users;
CREATE TRIGGER owner_deactivation_handler
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.status = 'active' AND NEW.status != 'active')
    EXECUTE FUNCTION public.handle_owner_deactivation();

-- Add index for fast ownership lookups
CREATE INDEX IF NOT EXISTS idx_space_owner_lookup
    ON public."Membership" (space_id, role)
    WHERE role = 'owner';
