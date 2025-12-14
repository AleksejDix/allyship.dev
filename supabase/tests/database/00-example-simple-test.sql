-- Example test for Allyship.dev implementation using plain pgTAP
-- Tests the core tables, RLS policies, and schema structure

BEGIN;

-- Load pgTAP extension
create extension if not exists pgtap;

-- Plan: declare how many tests we'll run
select plan(26);

-- === SCHEMA TESTS ===
select has_schema('basejump', 'Basejump schema should exist');
select has_schema('public', 'Public schema should exist');

-- === TABLE EXISTENCE TESTS ===
select has_table('public', 'Space', 'Space table should exist');
select has_table('public', 'Website', 'Website table should exist');
select has_table('public', 'Page', 'Page table should exist');
select has_table('public', 'Scan', 'Scan table should exist');
select has_table('public', 'controls', 'Controls table should exist');
select has_table('public', 'frameworks', 'Frameworks table should exist');
select has_table('public', 'integrations', 'Integrations table should exist');

-- === BASEJUMP TABLES ===
select has_table('basejump', 'accounts', 'Basejump accounts table should exist');
select has_table('basejump', 'account_user', 'Basejump account_user table should exist');

-- === COLUMN TESTS (Space table) ===
select has_column('public', 'Space', 'id', 'Space should have id column');
select has_column('public', 'Space', 'name', 'Space should have name column');
select has_column('public', 'Space', 'owner_id', 'Space should have owner_id column');
select has_column('public', 'Space', 'is_personal', 'Space should have is_personal column');

-- === COLUMN TESTS (Website table) ===
select has_column('public', 'Website', 'url', 'Website should have url column');
select has_column('public', 'Website', 'space_id', 'Website should have space_id column');
select has_column('public', 'Website', 'normalized_url', 'Website should have normalized_url column');

-- === RLS TESTS ===
select ok(
    (select relrowsecurity from pg_class where oid = 'public."Space"'::regclass),
    'RLS should be enabled on Space table'
);
select ok(
    (select relrowsecurity from pg_class where oid = 'public."Website"'::regclass),
    'RLS should be enabled on Website table'
);
select ok(
    (select relrowsecurity from pg_class where oid = 'public."Scan"'::regclass),
    'RLS should be enabled on Scan table'
);

-- === PRIMARY KEY TESTS ===
select has_pk('public', 'Space', 'Space should have a primary key');
select has_pk('public', 'Website', 'Website should have a primary key');
select has_pk('public', 'controls', 'Controls should have a primary key');

-- === FOREIGN KEY TESTS ===
select has_fk('public', 'Website', 'Website should have foreign keys');
select has_fk('public', 'Page', 'Page should have foreign keys');

-- Finish the test
SELECT * FROM finish();

ROLLBACK;
