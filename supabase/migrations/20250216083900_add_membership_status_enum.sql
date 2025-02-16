-- Create MembershipStatus enum type
DO $$ BEGIN
    CREATE TYPE public.MembershipStatus AS ENUM (
        'active',
        'inactive',
        'pending',
        'blocked'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create MembershipRole enum type
DO $$ BEGIN
    CREATE TYPE public.MembershipRole AS ENUM (
        'owner',
        'admin',
        'member'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Membership table if it doesn't exist
CREATE TABLE IF NOT EXISTS public."Membership" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_id UUID NOT NULL REFERENCES public."Space"(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.MembershipRole NOT NULL DEFAULT 'member',
    status public.MembershipStatus NOT NULL DEFAULT 'pending',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(space_id, user_id)
);

-- Add RLS to Membership table
ALTER TABLE public."Membership" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Membership access policy" ON public."Membership";
DROP POLICY IF EXISTS "Membership insert policy" ON public."Membership";
DROP POLICY IF EXISTS "Membership update policy" ON public."Membership";
DROP POLICY IF EXISTS "Membership delete policy" ON public."Membership";

-- Create new policies
CREATE POLICY "Membership access policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (
        -- Members can view all memberships in their spaces
        EXISTS (
            SELECT 1 FROM "Membership" m2
            WHERE m2.space_id = space_id
            AND m2.user_id = auth.uid()
            AND m2.status = 'active'
        )
    );

CREATE POLICY "Membership insert policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Only space owners can add members
        EXISTS (
            SELECT 1 FROM "Membership" m2
            WHERE m2.space_id = space_id
            AND m2.user_id = auth.uid()
            AND m2.role = 'owner'
            AND m2.status = 'active'
        )
    );

CREATE POLICY "Membership update policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (
        -- Only space owners can update memberships
        EXISTS (
            SELECT 1 FROM "Membership" m2
            WHERE m2.space_id = space_id
            AND m2.user_id = auth.uid()
            AND m2.role = 'owner'
            AND m2.status = 'active'
        )
    );

CREATE POLICY "Membership delete policy"
    ON public."Membership"
    AS PERMISSIVE
    FOR DELETE
    TO authenticated
    USING (
        -- Only space owners can remove members
        EXISTS (
            SELECT 1 FROM "Membership" m2
            WHERE m2.space_id = space_id
            AND m2.user_id = auth.uid()
            AND m2.role = 'owner'
            AND m2.status = 'active'
        )
    );
