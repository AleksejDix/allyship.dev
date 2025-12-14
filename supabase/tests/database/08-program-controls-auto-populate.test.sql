-- Test: Auto-populate program_controls on program creation
-- Verifies that program_controls entries are automatically created when a program is created

BEGIN;

create extension if not exists pgtap;
select plan(10);

-- === SETUP TEST DATA ===

-- Create test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com', crypt('password', gen_salt('bf')), now());

-- Create test account (team account for testing)
INSERT INTO basejump.accounts (id, primary_owner_user_id, personal_account, name, slug)
VALUES ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', false, 'Test Account for Program Controls', 'test-program-account');

-- Add account_user entry
INSERT INTO basejump.account_user (account_id, user_id, account_role)
VALUES ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'owner');

-- Create test controls
INSERT INTO public.controls (id, name, description) VALUES
  ('TEST-001', 'Test Control 1', 'First test control'),
  ('TEST-002', 'Test Control 2', 'Second test control'),
  ('TEST-003', 'Test Control 3', 'Third test control');

-- Create a test framework
INSERT INTO public.frameworks (
  id,
  display_name,
  shorthand_name,
  description,
  jurisdiction,
  status,
  compliance_type,
  official_url
) VALUES (
  'test-framework',
  'Test Framework',
  'TF',
  'Framework for testing auto-population',
  'Global',
  'active',
  'certification',
  'https://example.com'
);

-- Link controls to framework
INSERT INTO public.framework_controls (framework_id, control_id, requirement_number) VALUES
  ('test-framework', 'TEST-001', 'TF-R1'),
  ('test-framework', 'TEST-002', 'TF-R2'),
  ('test-framework', 'TEST-003', 'TF-R3');

-- === TEST 1: Trigger function exists ===
select has_function(
  'public',
  'auto_populate_program_controls',
  ARRAY[]::text[],
  'auto_populate_program_controls function should exist'
);

-- === TEST 2: Trigger exists on programs table ===
select has_trigger(
  'public',
  'programs',
  'trigger_auto_populate_program_controls',
  'programs table should have auto-populate trigger'
);

-- === TEST 3: program_controls table is empty before program creation ===
select is(
  (SELECT COUNT(*)::int FROM public.program_controls),
  0,
  'program_controls should be empty before creating any programs'
);

-- === TEST 4: Create a program and verify trigger fires ===
INSERT INTO public.programs (id, account_id, framework_id)
VALUES (
  '00000000-0000-0000-0000-000000000020'::uuid,
  '00000000-0000-0000-0000-000000000010'::uuid,
  'test-framework'
);

select ok(
  (SELECT COUNT(*) FROM public.program_controls WHERE program_id = '00000000-0000-0000-0000-000000000020'::uuid) > 0,
  'program_controls should be populated after program creation'
);

-- === TEST 5: Verify correct number of controls created ===
select is(
  (SELECT COUNT(*)::int FROM public.program_controls WHERE program_id = '00000000-0000-0000-0000-000000000020'::uuid),
  3,
  'Should create 3 program_controls (matching framework_controls count)'
);

-- === TEST 6: Verify all framework controls are included ===
select is(
  (
    SELECT COUNT(DISTINCT pc.control_id)::int
    FROM public.program_controls pc
    WHERE pc.program_id = '00000000-0000-0000-0000-000000000020'::uuid
    AND pc.control_id IN ('TEST-001', 'TEST-002', 'TEST-003')
  ),
  3,
  'All framework controls should be included in program_controls'
);

-- === TEST 7: Verify specific control IDs are present ===
select ok(
  EXISTS (
    SELECT 1 FROM public.program_controls
    WHERE program_id = '00000000-0000-0000-0000-000000000020'::uuid
    AND control_id = 'TEST-001'
  ),
  'TEST-001 control should exist in program_controls'
);

select ok(
  EXISTS (
    SELECT 1 FROM public.program_controls
    WHERE program_id = '00000000-0000-0000-0000-000000000020'::uuid
    AND control_id = 'TEST-002'
  ),
  'TEST-002 control should exist in program_controls'
);

-- === TEST 8: Create second framework and program to test trigger works multiple times ===
-- Create second test framework with different controls
INSERT INTO public.controls (id, name, description) VALUES
  ('TEST-004', 'Test Control 4', 'Fourth test control'),
  ('TEST-005', 'Test Control 5', 'Fifth test control');

INSERT INTO public.frameworks (
  id,
  display_name,
  shorthand_name,
  description,
  jurisdiction,
  status,
  compliance_type,
  official_url
) VALUES (
  'test-framework-2',
  'Test Framework 2',
  'TF2',
  'Second framework for testing',
  'Global',
  'active',
  'certification',
  'https://example.com/2'
);

-- Link different controls to second framework
INSERT INTO public.framework_controls (framework_id, control_id, requirement_number) VALUES
  ('test-framework-2', 'TEST-004', 'TF2-R1'),
  ('test-framework-2', 'TEST-005', 'TF2-R2');

-- Create second program with different framework
INSERT INTO public.programs (id, account_id, framework_id)
VALUES (
  '00000000-0000-0000-0000-000000000021'::uuid,
  '00000000-0000-0000-0000-000000000010'::uuid,
  'test-framework-2'
);

select is(
  (SELECT COUNT(*)::int FROM public.program_controls WHERE program_id = '00000000-0000-0000-0000-000000000021'::uuid),
  2,
  'Second program should have 2 program_controls auto-created (matching its framework)'
);

-- === TEST 9: Verify total program_controls count ===
select is(
  (SELECT COUNT(*)::int FROM public.program_controls),
  5,
  'Total program_controls should be 5 (3 for first program + 2 for second program)'
);

SELECT * FROM finish();
ROLLBACK;
