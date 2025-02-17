-- One-time script to assign all domains to a specific space
DO $$
DECLARE
    target_space_id UUID := '85eec7d3-0792-4d84-822e-fd1483c4b87c';
    target_user_id UUID := 'e0ae49ae-ddaf-4083-94fd-b91684462d88';
    space_exists BOOLEAN;
    user_exists BOOLEAN;
    membership_exists BOOLEAN;
    domain_count INTEGER;
BEGIN
    -- Check if space exists
    SELECT EXISTS (
        SELECT 1 FROM public."Space"
        WHERE id = target_space_id
    ) INTO space_exists;

    IF NOT space_exists THEN
        RAISE EXCEPTION 'Space with ID % does not exist', target_space_id;
    END IF;

    -- Check if user exists
    SELECT EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = target_user_id
    ) INTO user_exists;

    IF NOT user_exists THEN
        RAISE EXCEPTION 'User with ID % does not exist', target_user_id;
    END IF;

    -- Check if user has membership in the space
    SELECT EXISTS (
        SELECT 1 FROM public."Membership"
        WHERE space_id = target_space_id
        AND user_id = target_user_id
        AND status = 'active'
    ) INTO membership_exists;

    -- If no membership exists, create one with owner role
    IF NOT membership_exists THEN
        INSERT INTO public."Membership" (
            space_id,
            user_id,
            role,
            status,
            created_at,
            updated_at
        )
        VALUES (
            target_space_id,
            target_user_id,
            'owner',
            'active',
            NOW(),
            NOW()
        );
    END IF;

    -- Get count of domains to be moved
    SELECT COUNT(*) INTO domain_count
    FROM public."Domain";

    -- Update all domains to belong to the target space
    UPDATE public."Domain"
    SET
        space_id = target_space_id,
        updated_at = NOW(),
        updated_by = target_user_id
    WHERE space_id IS NOT NULL;

    -- Raise notice with results
    RAISE NOTICE 'Successfully transferred % domains to space %', domain_count, target_space_id;

END;
$$;

-- Direct update of all domains to the target space
UPDATE public."Domain"
SET
    space_id = '85eec7d3-0792-4d84-822e-fd1483c4b87c',
    updated_at = NOW(),
    updated_by = 'e0ae49ae-ddaf-4083-94fd-b91684462d88'
WHERE space_id IS NOT NULL;
