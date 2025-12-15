-- Helper script to update a single control name and mark it as production-ready
-- Usage: Replace VALUES and execute this query for each control

-- Example:
UPDATE public.controls
SET
  name = 'Users have unique accounts',  -- New atomic name
  is_production_ready = TRUE,           -- Mark as quality-approved
  updated_at = NOW()
WHERE id = 'CIS-001';                   -- Control ID to update

-- To review a control before updating:
-- SELECT id, name, description FROM controls WHERE id = 'CIS-001';

-- To see all controls that need updating:
-- SELECT id, name, description, is_production_ready
-- FROM controls
-- WHERE is_production_ready = FALSE
-- ORDER BY id
-- LIMIT 10;
