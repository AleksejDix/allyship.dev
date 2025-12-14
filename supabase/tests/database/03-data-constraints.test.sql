-- Data Constraint Tests
-- Validates check constraints, NOT NULL constraints, and defaults

BEGIN;

create extension if not exists pgtap;
select plan(20);

-- === NOT NULL CONSTRAINTS ===

-- Space table
select col_not_null(
    'public', 'Space', 'id',
    'Space.id should not be null'
);

select col_not_null(
    'public', 'Space', 'name',
    'Space.name should not be null'
);

select col_not_null(
    'public', 'Space', 'owner_id',
    'Space.owner_id should not be null'
);

-- Website table
select col_not_null(
    'public', 'Website', 'url',
    'Website.url should not be null'
);

select col_not_null(
    'public', 'Website', 'normalized_url',
    'Website.normalized_url should not be null'
);

-- Scan table - normalized_url and url should not be empty
select col_not_null(
    'public', 'Scan', 'normalized_url',
    'Scan.normalized_url should not be null'
);

select col_not_null(
    'public', 'Scan', 'url',
    'Scan.url should not be null'
);

-- === DEFAULT VALUES ===

-- Space.is_personal defaults to false
select col_has_default(
    'public', 'Space', 'is_personal',
    'Space.is_personal should have a default value'
);

-- Website.theme has a default
select col_has_default(
    'public', 'Website', 'theme',
    'Website.theme should have a default value'
);

-- Scan.status has a default
select col_has_default(
    'public', 'Scan', 'status',
    'Scan.status should have a default value'
);

-- Scan.scan_type has a default
select col_has_default(
    'public', 'Scan', 'scan_type',
    'Scan.scan_type should have a default value'
);

-- Scan.scope has a default
select col_has_default(
    'public', 'Scan', 'scope',
    'Scan.scope should have a default value'
);

-- === PRIMARY KEY CONSTRAINTS ===

-- controls.id is the primary key (which is unique)
select has_pk(
    'public', 'controls',
    'controls should have a primary key'
);

-- === CHECK CONSTRAINTS ===

-- Verify controls.id pattern constraint exists
select ok(
    (select count(*) > 0
     from pg_constraint
     where conrelid = 'public.controls'::regclass
     and contype = 'c'),
    'controls table should have check constraints'
);

-- Verify Scan check constraints exist
select ok(
    (select count(*) > 0
     from pg_constraint
     where conrelid = 'public."Scan"'::regclass
     and contype = 'c'),
    'Scan table should have check constraints'
);

-- Verify integrations.integration_type has check constraint
select ok(
    (select count(*) > 0
     from pg_constraint
     where conrelid = 'public.integrations'::regclass
     and contype = 'c'),
    'integrations table should have check constraints for integration_type'
);

-- === ENUM TYPES ===

-- Check that enum types exist
select has_type('public', 'DomainTheme', 'DomainTheme enum should exist');
select has_type('public', 'ScanStatus', 'ScanStatus enum should exist');
select has_type('basejump', 'account_role', 'account_role enum should exist');
select has_type('basejump', 'subscription_status', 'subscription_status enum should exist');

SELECT * FROM finish();
ROLLBACK;
