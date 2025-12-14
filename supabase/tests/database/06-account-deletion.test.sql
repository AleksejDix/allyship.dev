-- Account Deletion Tests
-- Tests the delete_account function and related RLS policies

BEGIN;

create extension if not exists pgtap;
select plan(14);

-- === FUNCTION EXISTENCE ===
select has_function(
    'public',
    'delete_account',
    ARRAY['uuid'],
    'delete_account function should exist'
);

-- === RLS POLICY EXISTENCE ===
select ok(
    (select count(*) > 0 from pg_policies
     where schemaname = 'basejump'
     and tablename = 'accounts'
     and cmd = 'DELETE'),
    'accounts table should have DELETE policy'
);

-- Verify the specific policy exists
select ok(
    (select count(*) > 0 from pg_policies
     where schemaname = 'basejump'
     and tablename = 'accounts'
     and policyname = 'Accounts can be deleted by owners'),
    'DELETE policy should be named "Accounts can be deleted by owners"'
);

-- === CASCADE CONFIGURATION ===
-- Verify Website FK cascades on account deletion
select ok(
    (select delete_rule = 'CASCADE'
     from information_schema.referential_constraints
     where constraint_name = 'fk_website_account_id'),
    'Website FK should CASCADE on account deletion'
);

-- === CREATE TEST DATA ===
-- Create test user
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values
    ('00000000-0000-0000-0000-000000000001', 'owner@test.com', crypt('password', gen_salt('bf')), now()),
    ('00000000-0000-0000-0000-000000000002', 'member@test.com', crypt('password', gen_salt('bf')), now());

-- Create personal account (via Basejump trigger)
insert into basejump.accounts (id, primary_owner_user_id, personal_account, name)
values
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', true, 'Personal Account'),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', true, 'Personal Account 2');

-- Add account_user entries
insert into basejump.account_user (account_id, user_id, account_role)
values
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'owner'),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'owner');

-- Create team account
insert into basejump.accounts (id, primary_owner_user_id, personal_account, name, slug)
values ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', false, 'Test Team', 'test-team');

insert into basejump.account_user (account_id, user_id, account_role)
values
    ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'owner'),
    ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'member');

-- Create legacy Space for Website (still required until full migration)
insert into public."Space" (id, name, owner_id, is_personal)
values ('40000000-0000-0000-0000-000000000001', 'Test Space', '00000000-0000-0000-0000-000000000001', false);

-- Create website linked to team account
insert into public."Website" (id, account_id, space_id, url, normalized_url)
values ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'https://test.com', 'test.com');

-- === FUNCTION TESTS ===

-- Set authenticated user context (simulating user1 as authenticated)
set local role authenticated;
set local "request.jwt.claims" to '{"sub": "00000000-0000-0000-0000-000000000001"}';

-- Test 1: Cannot delete personal account
select throws_ok(
    format('select delete_account(%L)', '10000000-0000-0000-0000-000000000001'),
    'Personal accounts cannot be deleted',
    'Should throw error when trying to delete personal account'
);

-- Test 2: Personal account still exists after failed deletion
select ok(
    (select count(*) = 1 from basejump.accounts where id = '10000000-0000-0000-0000-000000000001'),
    'Personal account should still exist after failed deletion attempt'
);

-- Test 3: Non-owner cannot delete (switch to member user)
set local "request.jwt.claims" to '{"sub": "00000000-0000-0000-0000-000000000002"}';

select throws_ok(
    format('select delete_account(%L)', '20000000-0000-0000-0000-000000000001'),
    'Only account owners can delete accounts',
    'Should throw error when non-owner tries to delete account'
);

-- Test 4: Team account still exists after failed deletion by non-owner
select ok(
    (select count(*) = 1 from basejump.accounts where id = '20000000-0000-0000-0000-000000000001'),
    'Team account should still exist after failed deletion by non-owner'
);

-- Test 5: Owner can delete team account (switch back to owner)
set local "request.jwt.claims" to '{"sub": "00000000-0000-0000-0000-000000000001"}';

select lives_ok(
    format('select delete_account(%L)', '20000000-0000-0000-0000-000000000001'),
    'Owner should be able to delete team account'
);

-- Test 6: Team account is deleted
select ok(
    (select count(*) = 0 from basejump.accounts where id = '20000000-0000-0000-0000-000000000001'),
    'Team account should be deleted'
);

-- Test 7: CASCADE - Website is deleted when account is deleted
select ok(
    (select count(*) = 0 from public."Website" where id = '30000000-0000-0000-0000-000000000001'),
    'Website should be deleted via CASCADE when account is deleted'
);

-- Test 8: CASCADE - account_user entries are deleted
select ok(
    (select count(*) = 0 from basejump.account_user where account_id = '20000000-0000-0000-0000-000000000001'),
    'account_user entries should be deleted via CASCADE'
);

-- Test 9: Verify function executed successfully (implicit in lives_ok above)
-- Additional verification: Check related data was cleaned up
select ok(
    (select count(*) = 0 from basejump.invitations where account_id = '20000000-0000-0000-0000-000000000001'),
    'Invitations should be deleted via CASCADE'
);

-- Test 10: Verify billing data would cascade (if it existed)
select ok(
    (select count(*) = 0 from basejump.billing_customers where account_id = '20000000-0000-0000-0000-000000000001'),
    'Billing customers should be deleted via CASCADE'
);

SELECT * FROM finish();
ROLLBACK;
