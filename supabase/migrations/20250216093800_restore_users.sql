-- Restore user profiles and personal spaces
DO $$
DECLARE
    auth_user RECORD;
BEGIN
    -- Loop through all auth users
    FOR auth_user IN
        SELECT
            id,
            email,
            raw_user_meta_data->>'full_name' as full_name,
            raw_user_meta_data->>'first_name' as first_name,
            raw_user_meta_data->>'last_name' as last_name
        FROM auth.users
        WHERE raw_user_meta_data->>'status' != 'deleted'
        ORDER BY created_at
    LOOP
        -- Create or update User profile
        INSERT INTO public."User" (
            id,
            first_name,
            last_name,
            status,
            updated_at
        )
        VALUES (
            auth_user.id,
            COALESCE(auth_user.first_name, split_part(auth_user.full_name, ' ', 1)),
            COALESCE(auth_user.last_name, split_part(auth_user.full_name, ' ', 2)),
            'active',
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            updated_at = NOW();

        -- Create personal space if it doesn't exist
        WITH new_space AS (
            INSERT INTO public."Space" (
                name,
                description,
                is_personal,
                created_by
            )
            SELECT
                COALESCE(auth_user.full_name, auth_user.email) || '''s Personal Space',
                'Personal space for ' || COALESCE(auth_user.full_name, auth_user.email),
                true,
                auth_user.id
            WHERE NOT EXISTS (
                SELECT 1 FROM public."Space"
                WHERE created_by = auth_user.id
                AND is_personal = true
            )
            RETURNING id
        )
        -- Create ownership membership for the personal space
        INSERT INTO public."Membership" (
            space_id,
            user_id,
            role,
            status
        )
        SELECT
            id,
            auth_user.id,
            'owner',
            'active'
        FROM new_space
        ON CONFLICT (space_id, user_id) DO NOTHING;

    END LOOP;
END;
$$;
