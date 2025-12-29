-- Custom Roles System Tests
-- Tests the complete custom roles system including permissions and RLS

BEGIN;

create extension if not exists pgtap;
select plan(26);

-- ============================================================================
-- SETUP: Create test data
-- ============================================================================

-- Create test users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, instance_id, aud, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'owner@test.com', crypt('password', gen_salt('bf')), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'admin@test.com', crypt('password', gen_salt('bf')), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'manager@test.com', crypt('password', gen_salt('bf')), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('44444444-4444-4444-4444-444444444444', 'developer@test.com', crypt('password', gen_salt('bf')), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('55555555-5555-5555-5555-555555555555', 'auditor@test.com', crypt('password', gen_salt('bf')), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('66666666-6666-6666-6666-666666666666', 'member@test.com', crypt('password', gen_salt('bf')), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated');

-- Create test account
INSERT INTO basejump.accounts (id, primary_owner_user_id, name, slug, personal_account)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Test Organization', 'test-org', false);

-- Add users as account members in basejump.account_user (for membership tracking only)
INSERT INTO basejump.account_user (account_id, user_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666');

-- Add users to custom roles system (sync trigger removed in Phase 5)
INSERT INTO public.account_user_roles (account_id, user_id, role_id, granted_by)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'member', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'member', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'member', '11111111-1111-1111-1111-111111111111');

-- Create test frameworks
INSERT INTO public.frameworks (id, display_name, shorthand_name, description, jurisdiction, status, compliance_type, official_url)
VALUES
  ('test-framework-1', 'Test Framework 1', 'TEST1', 'Framework for testing', 'Global', 'active', 'compliance', 'https://test.com'),
  ('test-framework-2', 'Test Framework 2', 'TEST2', 'Framework for testing', 'Global', 'active', 'compliance', 'https://test.com')
ON CONFLICT (id) DO NOTHING;

-- Create test space (legacy requirement for Website table)
INSERT INTO public."Space" (id, name, owner_id, is_personal)
VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Test Space', '11111111-1111-1111-1111-111111111111', false);

-- Assign additional custom roles as owner
set local role to authenticated;
set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';

SELECT public.grant_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'admin');
SELECT public.grant_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'manager');
SELECT public.grant_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'developer');
SELECT public.grant_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'auditor');

-- ============================================================================
-- TEST 1: Verify roles table exists and has correct roles
-- ============================================================================

select ok(
  (SELECT COUNT(*) = 6 FROM public.roles),
  'Roles table should have 6 roles'
);

select ok(
  (SELECT COUNT(*) = 1 FROM public.roles WHERE id = 'owner' AND level = 100),
  'Owner role should exist with level 100'
);

select ok(
  (SELECT COUNT(*) = 1 FROM public.roles WHERE id = 'admin' AND level = 90),
  'Admin role should exist with level 90'
);

-- ============================================================================
-- TEST 2: Verify role assignments synced correctly
-- ============================================================================

select ok(
  (SELECT COUNT(*) = 10 FROM public.account_user_roles WHERE account_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  'Should have 10 role assignments for test account (6 base + 4 additional)'
);

select ok(
  (SELECT COUNT(*) = 1 FROM public.account_user_roles
   WHERE account_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
     AND user_id = '22222222-2222-2222-2222-222222222222'
     AND role_id = 'admin'),
  'Admin user should have admin role'
);

-- ============================================================================
-- TEST 3: Helper function - is_account_member()
-- ============================================================================

set local role to authenticated;
set local "request.jwt.claims" to '{"sub": "66666666-6666-6666-6666-666666666666"}';

select ok(
  public.is_account_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') = true,
  'is_account_member() should return true for member'
);

select ok(
  public.is_account_member('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') = false,
  'is_account_member() should return false for non-member'
);

-- ============================================================================
-- TEST 4: Helper function - current_user_has_role()
-- ============================================================================

set local "request.jwt.claims" to '{"sub": "22222222-2222-2222-2222-222222222222"}';

select ok(
  public.current_user_has_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin') = true,
  'current_user_has_role() should return true for admin user checking admin role'
);

select ok(
  public.current_user_has_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'owner') = false,
  'current_user_has_role() should return false for admin user checking owner role'
);

-- ============================================================================
-- TEST 5: Helper function - current_user_has_role_level()
-- ============================================================================

set local "request.jwt.claims" to '{"sub": "33333333-3333-3333-3333-333333333333"}';

select ok(
  public.current_user_has_role_level('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 80) = true,
  'Manager should have level >= 80'
);

select ok(
  public.current_user_has_role_level('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 90) = false,
  'Manager should not have level >= 90'
);

-- ============================================================================
-- TEST 6: Programs RLS - View permissions
-- ============================================================================

-- Create a test program as owner
set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';
INSERT INTO public.programs (id, account_id, framework_id)
VALUES ('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'test-framework-1');

-- Member should be able to view
set local "request.jwt.claims" to '{"sub": "66666666-6666-6666-6666-666666666666"}';

select ok(
  (SELECT COUNT(*) = 1 FROM public.programs WHERE id = '99999999-9999-9999-9999-999999999999'),
  'Member should be able to view programs'
);

-- ============================================================================
-- TEST 7: Programs RLS - Create permissions (owner only)
-- ============================================================================

set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';

select lives_ok(
  $$INSERT INTO public.programs (account_id, framework_id)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'test-framework-2')$$,
  'Owner should be able to create programs'
);

-- Member should NOT be able to create
set local "request.jwt.claims" to '{"sub": "66666666-6666-6666-6666-666666666666"}';

select throws_ok(
  $$INSERT INTO public.programs (account_id, framework_id)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'test-framework-2')$$
);

-- ============================================================================
-- TEST 8: Integrations RLS - Members can create
-- ============================================================================

set local "request.jwt.claims" to '{"sub": "44444444-4444-4444-4444-444444444444"}';

select lives_ok(
  $$INSERT INTO public.integrations (id, account_id, integration_type, name, config)
    VALUES ('88888888-8888-8888-8888-888888888888', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'website', 'Test', '{}')$$,
  'Developer should be able to create integrations'
);

-- ============================================================================
-- TEST 9: Integrations RLS - Only owners can delete
-- ============================================================================

-- Member tries to delete (RLS should block - row should still exist)
set local "request.jwt.claims" to '{"sub": "66666666-6666-6666-6666-666666666666"}';

DELETE FROM public.integrations WHERE id = '88888888-8888-8888-8888-888888888888';

select ok(
  (SELECT COUNT(*) = 1 FROM public.integrations WHERE id = '88888888-8888-8888-8888-888888888888'),
  'Member should not be able to delete integrations (row should still exist)'
);

-- Owner deletes successfully
set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';

DELETE FROM public.integrations WHERE id = '88888888-8888-8888-8888-888888888888';

select ok(
  (SELECT COUNT(*) = 0 FROM public.integrations WHERE id = '88888888-8888-8888-8888-888888888888'),
  'Owner should be able to delete integrations'
);

-- ============================================================================
-- TEST 10: Website RLS - Members can create/update
-- ============================================================================

set local "request.jwt.claims" to '{"sub": "66666666-6666-6666-6666-666666666666"}';

select lives_ok(
  $$INSERT INTO public."Website" (id, account_id, space_id, url, normalized_url)
    VALUES ('77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://test.com', 'test.com')$$,
  'Member should be able to create websites'
);

select lives_ok(
  $$UPDATE public."Website" SET url = 'https://test2.com' WHERE id = '77777777-7777-7777-7777-777777777777'$$,
  'Member should be able to update websites'
);

-- ============================================================================
-- TEST 11: Website RLS - Only owners can delete
-- ============================================================================

-- Member tries to delete (RLS should block - row should still exist)
set local "request.jwt.claims" to '{"sub": "66666666-6666-6666-6666-666666666666"}';

DELETE FROM public."Website" WHERE id = '77777777-7777-7777-7777-777777777777';

select ok(
  (SELECT COUNT(*) = 1 FROM public."Website" WHERE id = '77777777-7777-7777-7777-777777777777'),
  'Member should not be able to delete websites (row should still exist)'
);

-- Owner deletes successfully
set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';

DELETE FROM public."Website" WHERE id = '77777777-7777-7777-7777-777777777777';

select ok(
  (SELECT COUNT(*) = 0 FROM public."Website" WHERE id = '77777777-7777-7777-7777-777777777777'),
  'Owner should be able to delete websites'
);

-- ============================================================================
-- TEST 12: Role management - Only owners/admins can grant roles
-- ============================================================================

set local "request.jwt.claims" to '{"sub": "22222222-2222-2222-2222-222222222222"}';

select lives_ok(
  $$SELECT public.grant_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'developer')$$,
  'Admin should be able to grant roles'
);

set local "request.jwt.claims" to '{"sub": "33333333-3333-3333-3333-333333333333"}';

select throws_ok(
  $$SELECT public.grant_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'developer')$$
);

-- ============================================================================
-- TEST 13: Role management - Only owners/admins can revoke roles
-- ============================================================================

set local "request.jwt.claims" to '{"sub": "22222222-2222-2222-2222-222222222222"}';

select lives_ok(
  $$SELECT public.revoke_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'developer')$$,
  'Admin should be able to revoke roles'
);

set local "request.jwt.claims" to '{"sub": "66666666-6666-6666-6666-666666666666"}';

select throws_ok(
  $$SELECT public.revoke_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'developer')$$
);

-- ============================================================================
-- TEST 14: Verify no basejump functions in public schema RLS
-- ============================================================================

select ok(
  (SELECT COUNT(*) = 0 FROM pg_policies
   WHERE schemaname = 'public'
   AND (qual LIKE '%basejump%' OR with_check LIKE '%basejump%')),
  'No RLS policies in public schema should use basejump functions'
);

SELECT * FROM finish();
ROLLBACK;
