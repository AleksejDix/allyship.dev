-- Seed core controls into framework_controls for GDPR and SOC2
-- Idempotent: uses ON CONFLICT to keep requirement_number/text in sync with control descriptions.

-- GDPR ← all privacy controls (PR-*)
INSERT INTO public.framework_controls (
  framework_id,
  control_id,
  requirement_number,
  requirement_text,
  created_at,
  updated_at
)
SELECT
  'gdpr' AS framework_id,
  c.id AS control_id,
  c.id AS requirement_number,
  COALESCE(NULLIF(TRIM(c.description), ''), c.name) AS requirement_text,
  NOW() AS created_at,
  NOW() AS updated_at
FROM public.controls c
WHERE c.id LIKE 'PR-%'
ON CONFLICT (framework_id, control_id) DO UPDATE
SET
  requirement_number = EXCLUDED.requirement_number,
  requirement_text = EXCLUDED.requirement_text,
  updated_at = NOW();

-- SOC2 ← all CIS controls (CIS-*)
INSERT INTO public.framework_controls (
  framework_id,
  control_id,
  requirement_number,
  requirement_text,
  created_at,
  updated_at
)
SELECT
  'soc2' AS framework_id,
  c.id AS control_id,
  c.id AS requirement_number,
  COALESCE(NULLIF(TRIM(c.description), ''), c.name) AS requirement_text,
  NOW() AS created_at,
  NOW() AS updated_at
FROM public.controls c
WHERE c.id LIKE 'CIS-%'
ON CONFLICT (framework_id, control_id) DO UPDATE
SET
  requirement_number = EXCLUDED.requirement_number,
  requirement_text = EXCLUDED.requirement_text,
  updated_at = NOW();
