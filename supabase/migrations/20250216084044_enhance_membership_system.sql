-- Add created_at column to track membership history
ALTER TABLE public."Membership"
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Drop existing policies to update them
DROP POLICY IF EXISTS "Membership update policy" ON public."Membership";
DROP POLICY IF EXISTS "Membership delete policy" ON public."Membership";
DROP POLICY IF EXISTS "Prevent owner self-removal" ON public."Membership";

-- Create policy to prevent owner self-removal
CREATE POLICY "Prevent owner self-removal"
    ON public."Membership"
    AS RESTRICTIVE
    FOR DELETE
    TO authenticated
    USING (
        -- Prevent owners from removing themselves
        NOT (
            role = 'owner'
            AND user_id = auth.uid()
        )
    );

-- Update policy to allow admins to manage memberships
CREATE POLICY "Membership update policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (
        -- Allow both owners and admins to update memberships
        EXISTS (
            SELECT 1 FROM "Membership" m2
            WHERE m2.space_id = space_id
            AND m2.user_id = auth.uid()
            AND m2.role IN ('owner', 'admin')
            AND m2.status = 'active'
        )
        -- But prevent changing owner role (only owners can do that)
        AND (
            NEW.role != 'owner'
            OR EXISTS (
                SELECT 1 FROM "Membership" m2
                WHERE m2.space_id = space_id
                AND m2.user_id = auth.uid()
                AND m2.role = 'owner'
                AND m2.status = 'active'
            )
        )
    );

-- Update policy to allow admins to remove members
CREATE POLICY "Membership delete policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR DELETE
    TO authenticated
    USING (
        -- Allow both owners and admins to remove members
        EXISTS (
            SELECT 1 FROM "Membership" m2
            WHERE m2.space_id = space_id
            AND m2.user_id = auth.uid()
            AND m2.role IN ('owner', 'admin')
            AND m2.status = 'active'
        )
    );

-- Add function to get membership details
CREATE OR REPLACE FUNCTION public.get_membership_details(
    space_id UUID,
    user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
    role public.MembershipRole,
    status public.MembershipStatus,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    is_owner BOOLEAN,
    is_admin BOOLEAN,
    can_manage_members BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.role,
        m.status,
        m.created_at,
        m.updated_at,
        m.role = 'owner' AS is_owner,
        m.role IN ('owner', 'admin') AS is_admin,
        m.role IN ('owner', 'admin') AND m.status = 'active' AS can_manage_members
    FROM "Membership" m
    WHERE m.space_id = get_membership_details.space_id
    AND m.user_id = get_membership_details.user_id;
END;
$$;

-- Add function to get space members with details
CREATE OR REPLACE FUNCTION public.get_space_members(space_id UUID)
RETURNS TABLE (
    user_id UUID,
    role public.MembershipRole,
    status public.MembershipStatus,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    first_name TEXT,
    last_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if the current user is a member of the space
    IF NOT EXISTS (
        SELECT 1 FROM "Membership"
        WHERE space_id = get_space_members.space_id
        AND user_id = auth.uid()
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Access denied: Not a member of this space';
    END IF;

    RETURN QUERY
    SELECT
        m.user_id,
        m.role,
        m.status,
        m.created_at,
        m.updated_at,
        u.first_name,
        u.last_name
    FROM "Membership" m
    JOIN "User" u ON m.user_id = u.id
    WHERE m.space_id = get_space_members.space_id
    ORDER BY
        m.role = 'owner' DESC,  -- Owners first
        m.role = 'admin' DESC,  -- Then admins
        m.created_at ASC;       -- Then by join date
END;
$$;

-- Add function to check if user can manage members
CREATE OR REPLACE FUNCTION public.can_manage_members(space_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM "Membership"
        WHERE space_id = can_manage_members.space_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
        AND status = 'active'
    );
END;
$$;

-- Add trigger to ensure at least one owner
CREATE OR REPLACE FUNCTION public.ensure_space_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- If this is a role change or deletion that would remove the last owner
    IF (TG_OP = 'DELETE' AND OLD.role = 'owner') OR
       (TG_OP = 'UPDATE' AND OLD.role = 'owner' AND NEW.role != 'owner')
    THEN
        -- Check if there would be any owners left
        IF NOT EXISTS (
            SELECT 1 FROM "Membership"
            WHERE space_id = OLD.space_id
            AND role = 'owner'
            AND status = 'active'
            AND id != OLD.id
        ) THEN
            RAISE EXCEPTION 'Cannot remove the last owner of a space';
        END IF;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- Create trigger for owner protection
DROP TRIGGER IF EXISTS ensure_space_owner_trigger ON public."Membership";
CREATE TRIGGER ensure_space_owner_trigger
    BEFORE UPDATE OR DELETE ON public."Membership"
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_space_owner();
