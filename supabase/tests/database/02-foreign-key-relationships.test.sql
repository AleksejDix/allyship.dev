-- Foreign Key Relationship Tests
-- Validates that foreign key constraints are properly set up
-- Tests cascade behavior and referential integrity

BEGIN;

create extension if not exists pgtap;
select plan(15);

-- === FOREIGN KEY EXISTENCE TESTS ===

-- Space -> auth.users (owner_id)
select has_fk(
    'public', 'Space',
    'Space should have foreign key constraints'
);

select fk_ok(
    'public', 'Space', 'owner_id',
    'auth', 'users', 'id',
    'Space.owner_id should reference auth.users.id'
);

-- Website -> Space (space_id)
select fk_ok(
    'public', 'Website', 'space_id',
    'public', 'Space', 'id',
    'Website.space_id should reference Space.id'
);

-- Website -> auth.users (user_id)
select fk_ok(
    'public', 'Website', 'user_id',
    'auth', 'users', 'id',
    'Website.user_id should reference auth.users.id'
);

-- Page -> Website (website_id)
select fk_ok(
    'public', 'Page', 'website_id',
    'public', 'Website', 'id',
    'Page.website_id should reference Website.id'
);

-- Scan -> Page (page_id)
select fk_ok(
    'public', 'Scan', 'page_id',
    'public', 'Page', 'id',
    'Scan.page_id should reference Page.id'
);

-- === FRAMEWORK RELATIONSHIPS ===

-- programs -> basejump.accounts
select fk_ok(
    'public', 'programs', 'account_id',
    'basejump', 'accounts', 'id',
    'programs.account_id should reference basejump.accounts.id'
);

-- programs -> frameworks
select fk_ok(
    'public', 'programs', 'framework_id',
    'public', 'frameworks', 'id',
    'programs.framework_id should reference frameworks.id'
);

-- program_controls -> programs
select fk_ok(
    'public', 'program_controls', 'program_id',
    'public', 'programs', 'id',
    'program_controls.program_id should reference programs.id'
);

-- program_controls -> controls
select fk_ok(
    'public', 'program_controls', 'control_id',
    'public', 'controls', 'id',
    'program_controls.control_id should reference controls.id'
);

-- framework_controls -> frameworks
select fk_ok(
    'public', 'framework_controls', 'framework_id',
    'public', 'frameworks', 'id',
    'framework_controls.framework_id should reference frameworks.id'
);

-- framework_controls -> controls
select fk_ok(
    'public', 'framework_controls', 'control_id',
    'public', 'controls', 'id',
    'framework_controls.control_id should reference controls.id'
);

-- checks -> programs
select fk_ok(
    'public', 'checks', 'program_id',
    'public', 'programs', 'id',
    'checks.program_id should reference programs.id'
);

-- checks -> controls
select fk_ok(
    'public', 'checks', 'control_id',
    'public', 'controls', 'id',
    'checks.control_id should reference controls.id'
);

-- integrations -> basejump.accounts
select fk_ok(
    'public', 'integrations', 'account_id',
    'basejump', 'accounts', 'id',
    'integrations.account_id should reference basejump.accounts.id'
);

SELECT * FROM finish();
ROLLBACK;
