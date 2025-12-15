-- Query to help review and update controls one by one

-- 1. See total counts
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN is_production_ready THEN 1 ELSE 0 END) as ready,
  SUM(CASE WHEN NOT is_production_ready THEN 1 ELSE 0 END) as needs_review
FROM controls;

-- 2. See controls that need review (grouped by current name to see duplicates)
SELECT
  name as current_category,
  COUNT(*) as count,
  STRING_AGG(id, ', ' ORDER BY id) as control_ids
FROM controls
WHERE is_production_ready = FALSE
GROUP BY name
ORDER BY count DESC, name
LIMIT 10;

-- 3. Review specific group of controls (change name filter)
SELECT
  id,
  name as current_category,
  description as should_be_name,
  is_production_ready
FROM controls
WHERE name = 'Access Control'  -- Change this
  AND is_production_ready = FALSE
ORDER BY id;

-- 4. Example: Update a single control
-- UPDATE controls
-- SET
--   name = 'Users have unique accounts',
--   is_production_ready = TRUE,
--   updated_at = NOW()
-- WHERE id = 'CIS-001';

-- 5. See recently approved controls
SELECT id, name, updated_at
FROM controls
WHERE is_production_ready = TRUE
ORDER BY updated_at DESC
LIMIT 10;
