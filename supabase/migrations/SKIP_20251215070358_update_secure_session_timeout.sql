-- Rename and enrich Secure Session Timeout control and align framework mappings

-- Create or update control definition
INSERT INTO public.controls (id, name, description)
VALUES (
  'CIS-020',
  'Secure Session Timeout',
  'Automatic session locking with warning and user extension to balance security and accessibility.'
)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- CIS Controls v8.1 Safeguard 4.3
INSERT INTO public.framework_controls (
  framework_id,
  control_id,
  requirement_number,
  requirement_text,
  created_at,
  updated_at
) VALUES (
  'cis',
  'CIS-020',
  'Safeguard 4.3',
  'Configure automatic session locking after defined inactivity with a warning and user extension when appropriate.',
  NOW(),
  NOW()
) ON CONFLICT (framework_id, control_id) DO UPDATE
SET
  requirement_number = EXCLUDED.requirement_number,
  requirement_text = EXCLUDED.requirement_text,
  updated_at = NOW();

-- SOC 2 (logical access) reference
INSERT INTO public.framework_controls (
  framework_id,
  control_id,
  requirement_number,
  requirement_text,
  created_at,
  updated_at
) VALUES (
  'soc2',
  'CIS-020',
  'CC6 (session timeout)',
  'Idle sessions are locked after a defined period with warning and user extension to preserve accessibility.',
  NOW(),
  NOW()
) ON CONFLICT (framework_id, control_id) DO UPDATE
SET
  requirement_number = EXCLUDED.requirement_number,
  requirement_text = EXCLUDED.requirement_text,
  updated_at = NOW();

-- EN 301 549 (EAA) timing adjustable requirements
INSERT INTO public.framework_controls (
  framework_id,
  control_id,
  requirement_number,
  requirement_text,
  created_at,
  updated_at
) VALUES (
  'en-301-549',
  'CIS-020',
  'Clause 9.2.2.1 / 11.2.2.1',
  'Session timeout provides advance warning (multi-modal) and allows simple user extension before lockout.',
  NOW(),
  NOW()
) ON CONFLICT (framework_id, control_id) DO UPDATE
SET
  requirement_number = EXCLUDED.requirement_number,
  requirement_text = EXCLUDED.requirement_text,
  updated_at = NOW();

-- European Accessibility Act annex reference
INSERT INTO public.framework_controls (
  framework_id,
  control_id,
  requirement_number,
  requirement_text,
  created_at,
  updated_at
) VALUES (
  'european-accessibility-act',
  'CIS-020',
  'Annex I.c',
  'Security session timeout warns users and permits extension via simple action before locking.',
  NOW(),
  NOW()
) ON CONFLICT (framework_id, control_id) DO UPDATE
SET
  requirement_number = EXCLUDED.requirement_number,
  requirement_text = EXCLUDED.requirement_text,
  updated_at = NOW();

-- GDPR integrity and confidentiality
INSERT INTO public.framework_controls (
  framework_id,
  control_id,
  requirement_number,
  requirement_text,
  created_at,
  updated_at
) VALUES (
  'gdpr',
  'CIS-020',
  'Art. 5(1)(f); Art. 32',
  'Automatic session lock with warning and extension protects integrity and confidentiality of personal data.',
  NOW(),
  NOW()
) ON CONFLICT (framework_id, control_id) DO UPDATE
SET
  requirement_number = EXCLUDED.requirement_number,
  requirement_text = EXCLUDED.requirement_text,
  updated_at = NOW();

-- ISO/IEC 27001:2022 A.8.1
INSERT INTO public.framework_controls (
  framework_id,
  control_id,
  requirement_number,
  requirement_text,
  created_at,
  updated_at
) VALUES (
  'iso-27001',
  'CIS-020',
  'A.8.1',
  'User endpoint sessions lock after inactivity with warning and extension to prevent unauthorized access.',
  NOW(),
  NOW()
) ON CONFLICT (framework_id, control_id) DO UPDATE
SET
  requirement_number = EXCLUDED.requirement_number,
  requirement_text = EXCLUDED.requirement_text,
  updated_at = NOW();
