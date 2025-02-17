-- Create Domain table
CREATE TABLE IF NOT EXISTS public."Domain" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    space_id UUID NOT NULL REFERENCES public."Space"(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(space_id, name)
);

-- Add missing columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_schema = 'public'
                  AND table_name = 'Domain'
                  AND column_name = 'created_by') THEN
        ALTER TABLE public."Domain" ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_schema = 'public'
                  AND table_name = 'Domain'
                  AND column_name = 'updated_by') THEN
        ALTER TABLE public."Domain" ADD COLUMN updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_schema = 'public'
                  AND table_name = 'Domain'
                  AND column_name = 'updated_at') THEN
        ALTER TABLE public."Domain" ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "Domain_space_id_idx" ON public."Domain"(space_id);
CREATE INDEX IF NOT EXISTS "Domain_created_by_idx" ON public."Domain"(created_by);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Domain_select_policy" ON public."Domain";
DROP POLICY IF EXISTS "Domain_insert_policy" ON public."Domain";
DROP POLICY IF EXISTS "Domain_update_policy" ON public."Domain";
DROP POLICY IF EXISTS "Domain_delete_policy" ON public."Domain";
DROP POLICY IF EXISTS "Domain access policy" ON public."Domain";

-- Drop existing triggers
DROP TRIGGER IF EXISTS set_domain_updated_at ON public."Domain";

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Ensure RLS is enabled
ALTER TABLE public."Domain" ENABLE ROW LEVEL SECURITY;

-- Policy for viewing domains (any space member can view)
CREATE POLICY "Domain_select_policy"
    ON public."Domain"
    FOR SELECT
    TO authenticated
    USING (
        space_id IN (
            SELECT space_id
            FROM public."Membership"
            WHERE user_id = auth.uid()
            AND status = 'active'
        )
    );

-- Policy for inserting domains (only space owners and admins)
CREATE POLICY "Domain_insert_policy"
    ON public."Domain"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        space_id IN (
            SELECT space_id
            FROM public."Membership"
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'admin')
            AND status = 'active'
        )
    );

-- Policy for updating domains (only space owners and admins)
CREATE POLICY "Domain_update_policy"
    ON public."Domain"
    FOR UPDATE
    TO authenticated
    USING (
        space_id IN (
            SELECT space_id
            FROM public."Membership"
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'admin')
            AND status = 'active'
        )
    )
    WITH CHECK (
        space_id IN (
            SELECT space_id
            FROM public."Membership"
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'admin')
            AND status = 'active'
        )
    );

-- Policy for deleting domains (only space owners and admins)
CREATE POLICY "Domain_delete_policy"
    ON public."Domain"
    FOR DELETE
    TO authenticated
    USING (
        space_id IN (
            SELECT space_id
            FROM public."Membership"
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'admin')
            AND status = 'active'
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER set_domain_updated_at
    BEFORE UPDATE ON public."Domain"
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add helpful comments
COMMENT ON TABLE public."Domain" IS 'Stores domains belonging to spaces';
COMMENT ON COLUMN public."Domain".space_id IS 'The space this domain belongs to';
COMMENT ON COLUMN public."Domain".name IS 'The domain name';
COMMENT ON COLUMN public."Domain".created_by IS 'The user who created this domain';
COMMENT ON COLUMN public."Domain".updated_by IS 'The user who last updated this domain';
