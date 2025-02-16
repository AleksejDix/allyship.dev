-- Drop existing triggers that might interfere with deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
DROP TRIGGER IF EXISTS owner_deactivation_handler ON auth.users;

-- Create a safer user deletion function
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Handle space ownership transfers before deletion
    WITH owned_spaces AS (
        SELECT m.space_id, s.name as space_name
        FROM public."Membership" m
        JOIN public."Space" s ON s.id = m.space_id
        WHERE m.user_id = OLD.id
        AND m.role = 'owner'
        AND m.status = 'active'
        AND NOT s.is_personal -- Skip personal spaces as they'll be deleted
    ),
    next_owners AS (
        SELECT DISTINCT ON (m.space_id)
            m.space_id,
            m.user_id as next_owner_id,
            m.role as previous_role
        FROM public."Membership" m
        JOIN owned_spaces os ON os.space_id = m.space_id
        WHERE m.user_id != OLD.id
        AND m.status = 'active'
        ORDER BY m.space_id,
            CASE m.role
                WHEN 'admin' THEN 1
                WHEN 'member' THEN 2
                ELSE 3
            END
    )
    UPDATE public."Membership" m
    SET role = 'owner',
        updated_at = NOW()
    FROM next_owners no
    WHERE m.space_id = no.space_id
    AND m.user_id = no.next_owner_id;

    -- Mark user as deleted in User table
    UPDATE public."User"
    SET status = 'deleted',
        deleted_at = NOW(),
        updated_at = NOW()
    WHERE id = OLD.id;

    -- Log the deletion
    INSERT INTO public.user_audit_logs (
        user_id,
        action,
        details
    ) VALUES (
        OLD.id,
        'user_deleted',
        jsonb_build_object(
            'deleted_at', NOW(),
            'deleted_by', COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'),
            'email', OLD.email,
            'metadata', OLD.raw_user_meta_data
        )
    );

    RETURN OLD;
END;
$$;

-- Create new trigger for user deletion
CREATE TRIGGER handle_user_deletion
    BEFORE DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_deletion();

-- Drop any existing policies that might interfere
DROP POLICY IF EXISTS "Enable delete for users only" ON auth.users;

-- Create policy to allow service role to delete users
CREATE POLICY "Enable delete for service role"
    ON auth.users
    FOR DELETE
    TO service_role
    USING (true);
