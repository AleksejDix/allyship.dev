-- Rename url column to name in Space table
ALTER TABLE "public"."Space" RENAME COLUMN "url" TO "name";

-- Update any policies that might reference the url column
DO $$
BEGIN
    -- Update RLS policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'Space'
        AND schemaname = 'public'
        AND policyname LIKE '%url%'
    ) THEN
        -- Drop and recreate policies that reference the url column
        -- Note: Add specific policy updates here if needed
        NULL;
    END IF;
END $$;
