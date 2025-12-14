-- Controls and Framework System Tests
-- Tests the atomic control framework that maps controls to compliance frameworks

BEGIN;

create extension if not exists pgtap;
select plan(25);

-- === CORE TABLES ===

select has_table('public', 'controls', 'controls table should exist');
select has_table('public', 'frameworks', 'frameworks table should exist');
select has_table('public', 'framework_controls', 'framework_controls junction table should exist');
select has_table('public', 'programs', 'programs table should exist');
select has_table('public', 'program_controls', 'program_controls table should exist');
select has_table('public', 'checks', 'checks table should exist');

-- === CONTROLS TABLE STRUCTURE ===

select has_column('public', 'controls', 'id', 'controls should have id');
select has_column('public', 'controls', 'name', 'controls should have name');
select has_column('public', 'controls', 'description', 'controls should have description');

-- Verify controls.id pattern (e.g., AX-ANIM-01, CIS-001)
select col_type_is(
    'public', 'controls', 'id',
    'text',
    'controls.id should be text type for patterns like AX-ANIM-01'
);

-- === FRAMEWORKS TABLE STRUCTURE ===

select has_column('public', 'frameworks', 'id', 'frameworks should have id');
select has_column('public', 'frameworks', 'display_name', 'frameworks should have display_name');
select has_column('public', 'frameworks', 'jurisdiction', 'frameworks should have jurisdiction');
select has_column('public', 'frameworks', 'status', 'frameworks should have status');
select has_column('public', 'frameworks', 'compliance_type', 'frameworks should have compliance_type');

-- === FRAMEWORK_CONTROLS JUNCTION TABLE ===

select has_column('public', 'framework_controls', 'framework_id', 'framework_controls should link to framework');
select has_column('public', 'framework_controls', 'control_id', 'framework_controls should link to control');
select has_column('public', 'framework_controls', 'requirement_number', 'framework_controls should have requirement_number');

-- === PROGRAMS (CERTIFICATION PROGRAMS) ===

select has_column('public', 'programs', 'account_id', 'programs should belong to an account');
select has_column('public', 'programs', 'framework_id', 'programs should reference a framework');

-- === CHECKS (UNIFIED CHECK RESULTS) ===

select has_column('public', 'checks', 'program_id', 'checks should belong to a program');
select has_column('public', 'checks', 'control_id', 'checks should reference a control');
select has_column('public', 'checks', 'check_type', 'checks should have check_type (automated/manual)');
select has_column('public', 'checks', 'status', 'checks should have status');
select has_column('public', 'checks', 'result_data', 'checks should store result_data as jsonb');

SELECT * FROM finish();
ROLLBACK;
