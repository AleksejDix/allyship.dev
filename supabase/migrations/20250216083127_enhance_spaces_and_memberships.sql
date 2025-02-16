-- Add is_personal flag to Space table
ALTER TABLE "public"."Space"
ADD COLUMN is_personal BOOLEAN NOT NULL DEFAULT false;

-- Add transfer_token for secure ownership transfers
ALTER TABLE "public"."Space"
ADD COLUMN transfer_token UUID,
ADD COLUMN transfer_token_expires_at TIMESTAMPTZ;

-- Function to create a personal space for new users
CREATE OR REPLACE FUNCTION public.create_personal_space()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_space_id UUID;
BEGIN
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

-- Create trigger to create personal space on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_create_space ON auth.users;
CREATE TRIGGER on_auth_user_created_create_space
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_personal_space();

-- Function to initiate space ownership transfer
CREATE OR REPLACE FUNCTION public.initiate_space_transfer(
    space_id UUID,
    new_owner_email TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    transfer_token UUID;
    current_user_id UUID;
    new_owner_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();

    -- Verify the current user is the space owner
    IF NOT EXISTS (
        SELECT 1 FROM "Membership"
        WHERE space_id = space_id
        AND user_id = current_user_id
        AND role = 'owner'
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Only the space owner can initiate a transfer';
    END IF;

    -- Find the new owner's user ID
    SELECT id INTO new_owner_id
    FROM auth.users
    WHERE email = new_owner_email;

    IF new_owner_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', new_owner_email;
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
            'expires_at', NOW() + INTERVAL '24 hours'
        )
    );

    -- Log the action
    PERFORM public.log_user_action(
        current_user_id,
        'space_transfer_initiated',
        jsonb_build_object(
            'space_id', space_id,
            'new_owner_id', new_owner_id
        )
    );

    RETURN transfer_token;
END;
$$;

-- Function to complete space ownership transfer
CREATE OR REPLACE FUNCTION public.complete_space_transfer(
    space_id UUID,
    transfer_token UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    old_owner_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();

    -- Verify transfer token and expiration
    IF NOT EXISTS (
        SELECT 1 FROM "Space"
        WHERE id = space_id
        AND transfer_token = transfer_token
        AND transfer_token_expires_at > NOW()
    ) THEN
        RAISE EXCEPTION 'Invalid or expired transfer token';
    END IF;

    -- Get current owner ID
    SELECT user_id INTO old_owner_id
    FROM "Membership"
    WHERE space_id = space_id
    AND role = 'owner'
    AND status = 'active';

    -- Begin ownership transfer
    -- First, demote current owner to admin
    UPDATE "Membership"
    SET role = 'admin'
    WHERE space_id = space_id
    AND user_id = old_owner_id;

    -- Then, either promote existing member to owner or create new owner membership
    INSERT INTO "Membership" (
        space_id,
        user_id,
        role,
        status,
        updated_at
    ) VALUES (
        space_id,
        current_user_id,
        'owner',
        'active',
        NOW()
    )
    ON CONFLICT (space_id, user_id)
    DO UPDATE SET
        role = 'owner',
        status = 'active',
        updated_at = NOW();

    -- Clear transfer token
    UPDATE "Space"
    SET
        transfer_token = NULL,
        transfer_token_expires_at = NULL
    WHERE id = space_id;

    -- Queue notifications
    -- Notify old owner
    PERFORM public.queue_user_notification(
        old_owner_id,
        'space_transfer_completed',
        jsonb_build_object(
            'space_id', space_id,
            'new_owner_id', current_user_id
        )
    );

    -- Log the action
    PERFORM public.log_user_action(
        current_user_id,
        'space_transfer_completed',
        jsonb_build_object(
            'space_id', space_id,
            'old_owner_id', old_owner_id
        )
    );

    RETURN true;
END;
$$;

-- Update RLS policies for Space table
ALTER TABLE "public"."Space" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Space access policy" ON "public"."Space";
CREATE POLICY "Space access policy"
    ON "public"."Space"
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

-- Update RLS policies for Membership table
ALTER TABLE "public"."Membership" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Membership access policy" ON "public"."Membership";
CREATE POLICY "Membership access policy"
    ON "public"."Membership"
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING (
        -- Members can view all memberships in their spaces
        EXISTS (
            SELECT 1 FROM "Membership" m2
            WHERE m2.space_id = space_id
            AND m2.user_id = auth.uid()
            AND m2.status = 'active'
        )
    )
    WITH CHECK (
        -- Only owners can modify memberships
        EXISTS (
            SELECT 1 FROM "Membership" m2
            WHERE m2.space_id = space_id
            AND m2.user_id = auth.uid()
            AND m2.role = 'owner'
            AND m2.status = 'active'
        )
    );
