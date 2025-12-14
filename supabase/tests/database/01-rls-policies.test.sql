-- RLS Policy Tests
-- Tests that Row Level Security policies correctly isolate user data
-- This is CRITICAL for security - users should only access their own data

BEGIN;

create extension if not exists pgtap;
select plan(12);

-- Create test users
-- Note: We can't use test helpers, so we'll test the policies exist and are enabled

-- === RLS ENABLED TESTS ===
select ok(
    (select relrowsecurity from pg_class where oid = 'public."Space"'::regclass),
    'RLS should be enabled on Space table'
);

select ok(
    (select relrowsecurity from pg_class where oid = 'public."Website"'::regclass),
    'RLS should be enabled on Website table'
);

select ok(
    (select relrowsecurity from pg_class where oid = 'public."Page"'::regclass),
    'RLS should be enabled on Page table'
);

select ok(
    (select relrowsecurity from pg_class where oid = 'public."Scan"'::regclass),
    'RLS should be enabled on Scan table'
);

select ok(
    (select relrowsecurity from pg_class where oid = 'public.integrations'::regclass),
    'RLS should be enabled on integrations table'
);

select ok(
    (select relrowsecurity from pg_class where oid = 'public.programs'::regclass),
    'RLS should be enabled on programs table'
);

select ok(
    (select relrowsecurity from pg_class where oid = 'public.checks'::regclass),
    'RLS should be enabled on checks table'
);

-- === POLICY EXISTENCE TESTS ===
-- Check that policies exist (at least one policy per table)
select ok(
    (select count(*) > 0 from pg_policies where schemaname = 'public' and tablename = 'Space'),
    'Space table should have at least one RLS policy'
);

select ok(
    (select count(*) > 0 from pg_policies where schemaname = 'public' and tablename = 'Website'),
    'Website table should have at least one RLS policy'
);

select ok(
    (select count(*) > 0 from pg_policies where schemaname = 'public' and tablename = 'Page'),
    'Page table should have at least one RLS policy'
);

select ok(
    (select count(*) > 0 from pg_policies where schemaname = 'public' and tablename = 'Scan'),
    'Scan table should have at least one RLS policy'
);

-- === BASEJUMP RLS TESTS ===
select ok(
    (select relrowsecurity from pg_class where oid = 'basejump.accounts'::regclass),
    'RLS should be enabled on basejump.accounts table'
);

SELECT * FROM finish();
ROLLBACK;
