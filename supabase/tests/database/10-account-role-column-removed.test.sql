-- Tests for account_role column removal
-- Verifies that the system works without basejump.account_user.account_role

BEGIN;

create extension if not exists pgtap;
select plan(8);

-- ============================================================================
-- TEST 1: Verify account_role column no longer exists
-- ============================================================================

select ok(
  NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'basejump'
      AND table_name = 'account_user'
      AND column_name = 'account_role'
  ),
  'account_role column should not exist in basejump.account_user'
);

-- ============================================================================
-- TEST 2: Verify basejump.account_user only has 2 columns
-- ============================================================================

select ok(
  (SELECT COUNT(*) = 2
   FROM information_schema.columns
   WHERE table_schema = 'basejump'
     AND table_name = 'account_user'),
  'basejump.account_user should only have 2 columns (account_id, user_id)'
);

-- ============================================================================
-- TEST 3: New user signup creates custom role entry
-- ============================================================================

-- Create a test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, instance_id, aud, role)
VALUES ('99999999-9999-9999-9999-999999999999', 'newuser@test.com', crypt('password', gen_salt('bf')), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated');

-- Trigger should create account and role
-- The run_new_user_setup trigger should have created an account_user_roles entry

select ok(
  EXISTS (
    SELECT 1
    FROM public.account_user_roles
    WHERE user_id = '99999999-9999-9999-9999-999999999999'
      AND role_id = 'owner'
  ),
  'New user signup should create owner role in custom roles'
);

select ok(
  EXISTS (
    SELECT 1
    FROM basejump.account_user
    WHERE user_id = '99999999-9999-9999-9999-999999999999'
  ),
  'New user signup should create membership entry in basejump.account_user'
);

-- ============================================================================
-- TEST 4: basejump.has_role_on_account() uses custom roles
-- ============================================================================

-- Create test account and users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, instance_id, aud, role)
VALUES
  ('88888888-8888-8888-8888-888888888888', 'roletest1@test.com', crypt('password', gen_salt('bf')), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('77777777-7777-7777-7777-777777777777', 'roletest2@test.com', crypt('password', gen_salt('bf')), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated');

INSERT INTO basejump.accounts (id, primary_owner_user_id, name, slug, personal_account)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', 'Test Role Check', 'test-role-check', false);

-- Add membership only (no role in basejump.account_user since column is dropped)
INSERT INTO basejump.account_user (account_id, user_id)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777');

-- Add custom roles
INSERT INTO public.account_user_roles (account_id, user_id, role_id, granted_by)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', 'owner', '88888888-8888-8888-8888-888888888888'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777', 'member', '88888888-8888-8888-8888-888888888888');

-- Test as owner
set local role to authenticated;
set local "request.jwt.claims" to '{"sub": "88888888-8888-8888-8888-888888888888"}';

select ok(
  basejump.has_role_on_account('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'owner'),
  'basejump.has_role_on_account should return true for owner using custom roles'
);

select ok(
  NOT basejump.has_role_on_account('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'member'),
  'basejump.has_role_on_account should return false for non-matching role'
);

-- Test as member
set local "request.jwt.claims" to '{"sub": "77777777-7777-7777-7777-777777777777"}';

select ok(
  basejump.has_role_on_account('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'member'),
  'basejump.has_role_on_account should return true for member using custom roles'
);

select ok(
  NOT basejump.has_role_on_account('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'owner'),
  'basejump.has_role_on_account should return false for higher role when user is member'
);

-- ============================================================================
-- Cleanup and finish
-- ============================================================================

select * from finish();
ROLLBACK;
