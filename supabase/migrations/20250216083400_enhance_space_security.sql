-- Function to automatically clean up expired transfer tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_transfer_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE "Space"
    SET
        transfer_token = NULL,
        transfer_token_expires_at = NULL
    WHERE transfer_token_expires_at < NOW();
END;
$$;

-- Schedule cleanup of expired tokens (every hour)
SELECT cron.schedule(
    'cleanup-transfer-tokens',
    '0 * * * *',
    $$
    SELECT public.cleanup_expired_transfer_tokens();
    $$
);

-- Update create_personal_space to prevent multiple personal spaces
CREATE OR REPLACE FUNCTION public.create_personal_space()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_space_id UUID;
BEGIN
    -- Check if user already has a personal space
    IF EXISTS (
        SELECT 1 FROM "Space"
        WHERE user_id = NEW.id
        AND is_personal = true
    ) THEN
        RAISE EXCEPTION 'User already has a personal space';
    END IF;

    -- Create personal space
    INSERT INTO "Space" (
        name,
        user_id,
        is_personal
    ) VALUES (
        'Personal Space',  -- Default name
        NEW.id,           -- User ID
        true              -- Mark as personal space
    ) RETURNING id INTO new_space_id;

    -- Create owner membership
    INSERT INTO "Membership" (
        space_id,
        user_id,
        role,
        status,
        updated_at
    ) VALUES (
        new_space_id,
        NEW.id,
        'owner',
        'active',
        NOW()
    );

    -- Log the action
    PERFORM public.log_user_action(
        NEW.id,
        'personal_space_created',
        jsonb_build_object(
            'space_id', new_space_id
        )
    );

    RETURN NEW;
END;
$$;

-- Update initiate_space_transfer to require membership and allow admin override
CREATE OR REPLACE FUNCTION public.initiate_space_transfer(
    space_id UUID,
    new_owner_email TEXT,
    admin_override BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    transfer_token UUID;
    current_user_id UUID;
    new_owner_id UUID;
    requester_is_admin BOOLEAN;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();

    -- Check if requester is admin when admin_override is true
    IF admin_override THEN
        SELECT public.is_admin() INTO requester_is_admin;
        IF NOT requester_is_admin THEN
            RAISE EXCEPTION 'Admin privileges required for override';
        END IF;
    END IF;

    -- Verify the current user is the space owner (unless admin override)
    IF NOT EXISTS (
        SELECT 1 FROM "Membership"
        WHERE space_id = space_id
        AND user_id = current_user_id
        AND role = 'owner'
        AND status = 'active'
    ) AND NOT (admin_override AND requester_is_admin) THEN
        RAISE EXCEPTION 'Only the space owner or an admin can initiate a transfer';
    END IF;

    -- Find the new owner's user ID
    SELECT id INTO new_owner_id
    FROM auth.users
    WHERE email = new_owner_email;

    IF new_owner_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', new_owner_email;
    END IF;

    -- Verify the new owner is already a member (unless admin override)
    IF NOT EXISTS (
        SELECT 1 FROM "Membership"
        WHERE space_id = space_id
        AND user_id = new_owner_id
        AND status = 'active'
    ) AND NOT admin_override THEN
        RAISE EXCEPTION 'User must be an active member of the space before transfer';
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
        'space_transfer_initiated',
        jsonb_build_object(
            'space_id', space_id,
            'transfer_token', transfer_token,
            'initiated_by', current_user_id,
            'expires_at', NOW() + INTERVAL '24 hours',
            'admin_override', admin_override
        )
    );

    -- Log the action
    PERFORM public.log_user_action(
        current_user_id,
        'space_transfer_initiated',
        jsonb_build_object(
            'space_id', space_id,
            'new_owner_id', new_owner_id,
            'admin_override', admin_override,
            'requester_is_admin', requester_is_admin
        )
    );

    RETURN transfer_token;
END;
$$;

-- Add policy to prevent personal space transfers
CREATE POLICY "Prevent personal space transfer"
    ON "public"."Space"
    AS RESTRICTIVE
    FOR UPDATE
    USING (
        CASE
            WHEN NEW.transfer_token IS NOT NULL THEN
                NOT (OLD.is_personal)
            ELSE true
        END
    );

-- Add policy to prevent personal space deletion
CREATE POLICY "Prevent personal space deletion"
    ON "public"."Space"
    AS RESTRICTIVE
    FOR DELETE
    USING (NOT is_personal);

-- Add policy to ensure only one personal space per user
CREATE POLICY "One personal space per user"
    ON "public"."Space"
    AS RESTRICTIVE
    FOR INSERT
    WITH CHECK (
        CASE
            WHEN NEW.is_personal THEN
                NOT EXISTS (
                    SELECT 1 FROM "Space"
                    WHERE user_id = NEW.user_id
                    AND is_personal = true
                )
            ELSE true
        END
    );
