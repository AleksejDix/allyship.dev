-- Timestamp and Trigger Tests
-- Validates that created_at, updated_at, and deleted_at columns exist
-- Tests soft delete functionality

BEGIN;

create extension if not exists pgtap;
select plan(18);

-- === TIMESTAMP COLUMNS ===

-- Space table timestamps
select has_column('public', 'Space', 'created_at', 'Space should have created_at');
select has_column('public', 'Space', 'updated_at', 'Space should have updated_at');
select has_column('public', 'Space', 'deleted_at', 'Space should have deleted_at for soft deletes');

-- Website table timestamps
select has_column('public', 'Website', 'created_at', 'Website should have created_at');
select has_column('public', 'Website', 'updated_at', 'Website should have updated_at');

-- Page table timestamps
select has_column('public', 'Page', 'created_at', 'Page should have created_at');
select has_column('public', 'Page', 'updated_at', 'Page should have updated_at');
select has_column('public', 'Page', 'deleted_at', 'Page should have deleted_at for soft deletes');

-- Scan table timestamps
select has_column('public', 'Scan', 'created_at', 'Scan should have created_at');

-- === TIMESTAMP DEFAULTS ===

-- created_at should default to now()
select col_default_is(
    'public', 'Space', 'created_at',
    'now()',
    'Space.created_at should default to now()'
);

select col_default_is(
    'public', 'Website', 'created_at',
    'now()',
    'Website.created_at should default to now()'
);

select col_default_is(
    'public', 'Page', 'created_at',
    'now()',
    'Page.created_at should default to now()'
);

-- updated_at should default to now()
select col_default_is(
    'public', 'Space', 'updated_at',
    'now()',
    'Space.updated_at should default to now()'
);

select col_default_is(
    'public', 'Website', 'updated_at',
    'now()',
    'Website.updated_at should default to now()'
);

-- === CREATED_BY / UPDATED_BY TRACKING ===

-- basejump.accounts should track created_by and updated_by
select has_column('basejump', 'accounts', 'created_by', 'accounts should track created_by');
select has_column('basejump', 'accounts', 'updated_by', 'accounts should track updated_by');
select has_column('basejump', 'accounts', 'created_at', 'accounts should have created_at');
select has_column('basejump', 'accounts', 'updated_at', 'accounts should have updated_at');

SELECT * FROM finish();
ROLLBACK;
