-- Enhanced cleanup function with notifications
CREATE OR REPLACE FUNCTION public.cleanup_expired_transfer_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    expired_space RECORD;
BEGIN
    FOR expired_space IN
        SELECT s.id, s.user_id, m.user_id as owner_id
        FROM "Space" s
        JOIN "Membership" m ON s.id = m.space_id
        WHERE s.transfer_token_expires_at < NOW()
        AND m.role = 'owner'
        AND m.status = 'active'
    LOOP
        -- Notify both current owner and intended new owner
        PERFORM public.queue_user_notification(
            expired_space.owner_id,
            'space_transfer_expired',
            jsonb_build_object(
                'space_id', expired_space.id,
                'role', 'owner'
            )
        );

        -- Also notify the user who was going to receive the space
        IF expired_space.user_id != expired_space.owner_id THEN
            PERFORM public.queue_user_notification(
                expired_space.user_id,
                'space_transfer_expired',
                jsonb_build_object(
                    'space_id', expired_space.id,
                    'role', 'recipient'
                )
            );
        END IF;

        -- Clear expired transfer tokens
        UPDATE "Space"
        SET
            transfer_token = NULL,
            transfer_token_expires_at = NULL
        WHERE id = expired_space.id;

        -- Log the expiration
        PERFORM public.log_user_action(
            expired_space.owner_id,
            'space_transfer_expired',
            jsonb_build_object(
                'space_id', expired_space.id,
                'intended_recipient', expired_space.user_id
            )
        );
    END LOOP;
END;
$$;

-- Schedule cleanup job with duplicate prevention
DO $$
BEGIN
    -- Drop existing job if it exists
    PERFORM cron.unschedule('cleanup-transfer-tokens');

    -- Schedule new job
    PERFORM cron.schedule(
        'cleanup-transfer-tokens',
        '0 * * * *',  -- Every hour
        $$
        SELECT public.cleanup_expired_transfer_tokens();
        $$
    );
END $$;

-- Update personal space transfer policy to allow admin override
DROP POLICY IF EXISTS "Prevent personal space transfer" ON "public"."Space";
CREATE POLICY "Prevent personal space transfer"
    ON "public"."Space"
    AS RESTRICTIVE
    FOR UPDATE
    USING (
        CASE
            WHEN NEW.transfer_token IS NOT NULL THEN
                NOT (OLD.is_personal) OR (
                    -- Allow admin override for personal space transfers
                    OLD.is_personal AND
                    auth.jwt() ? 'is_admin' AND
                    EXISTS (
                        SELECT 1 FROM jsonb_array_elements(current_setting('request.jwt.claims')::jsonb) AS claims
                        WHERE claims->>'role' = 'service_role'
                    )
                )
            ELSE true
        END
    );

-- Add function to handle emergency personal space transfers (admin only)
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
    -- Verify admin privileges
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

-- Add an index to improve transfer token cleanup performance
CREATE INDEX IF NOT EXISTS idx_space_transfer_expiry
    ON "Space" (transfer_token_expires_at)
    WHERE transfer_token_expires_at IS NOT NULL;

-- Add an index to improve personal space queries
CREATE INDEX IF NOT EXISTS idx_space_personal
    ON "Space" (user_id)
    WHERE is_personal = true;
