-- Drop the view if it exists (force drop)
DROP VIEW IF EXISTS "public"."UserSpaceView" CASCADE;

-- Create a view for user spaces with domain counts
CREATE OR REPLACE VIEW "public"."UserSpaceView" AS
WITH space_domains AS (
    SELECT
        space_id,
        COUNT(*) as domain_count
    FROM public."Domain"
    GROUP BY space_id
)
SELECT DISTINCT ON (s.id, m.user_id)
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
    s.deleted_at IS NULL
    AND m.status = 'active'
    AND (
        -- Include spaces where user is a member
        m.user_id = auth.uid()
        OR
        -- Include personal spaces owned by the user
        (s.is_personal = true AND s.created_by = auth.uid())
    );

-- Create an RLS policy to restrict access
ALTER VIEW "public"."UserSpaceView" OWNER TO authenticated;

-- Grant appropriate permissions
REVOKE ALL ON "public"."UserSpaceView" FROM PUBLIC;
GRANT SELECT ON "public"."UserSpaceView" TO authenticated;
GRANT SELECT ON "public"."UserSpaceView" TO service_role;

-- Add helpful comments
COMMENT ON VIEW "public"."UserSpaceView" IS 'Provides an optimized view of spaces with their domain counts and user roles';
