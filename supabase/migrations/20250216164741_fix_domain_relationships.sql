-- First handle the relationships
ALTER TABLE public."Domain"
    DROP CONSTRAINT IF EXISTS "Domain_space_id_fkey";

ALTER TABLE public."Domain"
    ADD CONSTRAINT "Domain_space_id_fkey"
    FOREIGN KEY (space_id)
    REFERENCES public."Space"(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- Add explicit relationship metadata
COMMENT ON CONSTRAINT "Domain_space_id_fkey" ON public."Domain" IS 'Each domain belongs to exactly one space. When a space is deleted, all its domains are deleted.';

-- Create index for the relationship if it doesn't exist
CREATE INDEX IF NOT EXISTS "Domain_space_id_idx" ON public."Domain"(space_id);

-- Drop the view if it exists
DROP VIEW IF EXISTS "public"."UserSpaceView";

-- Create a view for user spaces with domain counts
CREATE VIEW "public"."UserSpaceView" AS
WITH space_domains AS (
    SELECT
        space_id,
        COUNT(*) as domain_count
    FROM public."Domain"
    GROUP BY space_id
)
SELECT
    s.id as space_id,
    s.name as space_name,
    s.created_at,
    s.updated_at,
    s.created_by,
    u.first_name as owner_first_name,
    u.last_name as owner_last_name,
    m.user_id,
    m.role as user_role,
    m.status as membership_status,
    COALESCE(sd.domain_count, 0) as domain_count
FROM
    public."Space" s
    INNER JOIN public."User" u ON s.created_by = u.id
    LEFT JOIN public."Membership" m ON s.id = m.space_id
    LEFT JOIN space_domains sd ON s.id = sd.space_id
WHERE
    m.status = 'active';

-- Grant appropriate permissions
GRANT SELECT ON "public"."UserSpaceView" TO authenticated;

-- Add helpful comments
COMMENT ON VIEW "public"."UserSpaceView" IS 'Provides an optimized view of spaces with their domain counts and user roles';

