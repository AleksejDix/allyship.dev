-- Improve admin role detection with a more robust function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    jwt_claims JSONB;
BEGIN
    jwt_claims := current_setting('request.jwt.claims', true)::jsonb;
    RETURN (
        jwt_claims ? 'is_admin' OR
        jwt_claims ->> 'role' = 'admin' OR
        jwt_claims ->> 'role' = 'service_role' OR
        EXISTS (
            SELECT 1 FROM jsonb_array_elements(jwt_claims -> 'roles') AS role
            WHERE role::text = '"admin"'
        )
    );
END;
$$;

-- Update admin_transfer_personal_space to require membership
CREATE OR REPLACE FUNCTION public.admin_transfer_personal_space(
    space_id UUID,
    new_owner_email TEXT,
    reason TEXT DEFAULT 'admin_emergency_transfer'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    transfer_token UUID;
    admin_id UUID;
    new_owner_id UUID;
BEGIN
    -- Verify admin privileges using improved function
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only administrators can perform emergency transfers';
    END IF;

    -- Get admin ID
    admin_id := auth.uid();

    -- Find the new owner
    SELECT id INTO new_owner_id
    FROM auth.users
    WHERE email = new_owner_email;

    IF new_owner_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', new_owner_email;
    END IF;

    -- Verify this is a personal space
    IF NOT EXISTS (
        SELECT 1 FROM "Space"
        WHERE id = space_id
        AND is_personal = true
    ) THEN
        RAISE EXCEPTION 'This function can only be used for personal spaces';
    END IF;

    -- Verify the new owner is already a member
    IF NOT EXISTS (
        SELECT 1 FROM "Membership"
        WHERE space_id = space_id
        AND user_id = new_owner_id
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'User must be an active member before transfer';
    END IF;

    -- Generate transfer token
    transfer_token := gen_random_uuid();

    -- Update space with transfer token
    UPDATE "Space"
    SET
        transfer_token = transfer_token,
        transfer_token_expires_at = NOW() + INTERVAL '24 hours'
    WHERE id = space_id;

    -- Queue notification for the new owner
    PERFORM public.queue_user_notification(
        new_owner_id,
        'emergency_space_transfer_initiated',
        jsonb_build_object(
            'space_id', space_id,
            'transfer_token', transfer_token,
            'initiated_by_admin', admin_id,
            'reason', reason,
            'expires_at', NOW() + INTERVAL '24 hours'
        )
    );

    -- Log the emergency transfer initiation
    PERFORM public.log_user_action(
        admin_id,
        'emergency_space_transfer_initiated',
        jsonb_build_object(
            'space_id', space_id,
            'new_owner_id', new_owner_id,
            'reason', reason
        )
    );

    RETURN transfer_token;
END;
$$;

-- Add function to expire all transfer tokens (admin only)
CREATE OR REPLACE FUNCTION public.expire_all_transfer_tokens(
    reason TEXT DEFAULT 'admin_override'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    -- Verify admin privileges using improved function
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only administrators can expire transfer tokens';
    END IF;

    -- Get count of active transfers before expiring
    SELECT COUNT(*)
    INTO expired_count
    FROM "Space"
    WHERE transfer_token IS NOT NULL;

    -- Expire all active transfers
    WITH expired_transfers AS (
        SELECT
            s.id as space_id,
            s.user_id as intended_recipient,
            m.user_id as current_owner
        FROM "Space" s
        JOIN "Membership" m ON s.id = m.space_id
        WHERE s.transfer_token IS NOT NULL
        AND m.role = 'owner'
        AND m.status = 'active'
    )
    UPDATE "Space" s
    SET
        transfer_token = NULL,
        transfer_token_expires_at = NULL
    FROM expired_transfers e
    WHERE s.id = e.space_id
    RETURNING (
        -- Queue notifications for each affected user
        PERFORM public.queue_user_notification(
            e.current_owner,
            'transfer_token_expired_by_admin',
            jsonb_build_object(
                'space_id', e.space_id,
                'reason', reason,
                'admin_id', auth.uid()
            )
        ),
        -- Also notify intended recipients
        PERFORM public.queue_user_notification(
            e.intended_recipient,
            'transfer_token_expired_by_admin',
            jsonb_build_object(
                'space_id', e.space_id,
                'reason', reason,
                'admin_id', auth.uid()
            )
        )
    );

    -- Log the mass expiration event
    IF expired_count > 0 THEN
        PERFORM public.log_user_action(
            auth.uid(),
            'all_transfer_tokens_expired',
            jsonb_build_object(
                'count', expired_count,
                'reason', reason
            )
        );
    END IF;

    RETURN expired_count;
END;
$$;

-- Add function to check if a space has pending transfers
CREATE OR REPLACE FUNCTION public.has_pending_transfer(space_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM "Space"
        WHERE id = space_id
        AND transfer_token IS NOT NULL
        AND transfer_token_expires_at > NOW()
    );
END;
$$;

-- Add function to get space transfer status
CREATE OR REPLACE FUNCTION public.get_space_transfer_status(space_id UUID)
RETURNS TABLE (
    has_pending_transfer BOOLEAN,
    transfer_expires_at TIMESTAMPTZ,
    current_owner_id UUID,
    intended_recipient_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.transfer_token IS NOT NULL AND s.transfer_token_expires_at > NOW(),
        s.transfer_token_expires_at,
        m.user_id,
        s.user_id
    FROM "Space" s
    JOIN "Membership" m ON s.id = m.space_id
    WHERE s.id = space_id
    AND m.role = 'owner'
    AND m.status = 'active';
END;
$$;
