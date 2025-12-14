-- Account Creation Tests
-- Tests the create_account function from Basejump
-- NOTE: This function is provided by Basejump and should not be modified
-- Production has the SECURITY DEFINER version, local Basejump may not

BEGIN;

create extension if not exists pgtap;
select plan(3);

-- === FUNCTION EXISTENCE ===
select has_function(
    'public',
    'create_account',
    ARRAY['text', 'text'],
    'create_account function should exist (provided by Basejump)'
);

select function_returns(
    'public',
    'create_account',
    ARRAY['text', 'text'],
    'json',
    'create_account should return json with account details'
);

-- === RLS POLICY FOR CREATION ===
select ok(
    (select count(*) > 0 from pg_policies
     where schemaname = 'basejump'
     and tablename = 'accounts'
     and cmd = 'INSERT'),
    'accounts table should have INSERT policy allowing team creation'
);

-- === INTEGRATION TEST NOTES ===
-- The create_account function:
-- 1. Creates a new team account with the provided slug and name
-- 2. Automatically adds the creator as the primary owner
-- 3. Returns account details as JSON
-- 4. Validates slug uniqueness
-- 5. Only allows authenticated users to create accounts
--
-- Testing is done via the application's createTeamAccount server action
-- which calls the Basejump RPC: supabase.rpc("create_account", { slug, name })

SELECT * FROM finish();
ROLLBACK;
