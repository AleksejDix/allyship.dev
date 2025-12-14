# Database Test Suite Summary

## Overview

Comprehensive database test suite for Allyship.dev using pgTAP. All 116 tests passing ✅

## Test Files

### 1. Schema & Table Structure (26 tests)
**File**: `00-example-simple-test.sql`

Tests basic database structure:
- Schema existence (basejump, public)
- Core tables (Space, Website, Page, Scan, controls, frameworks, integrations)
- Basejump tables (accounts, account_user)
- Column existence and types
- RLS enabled on all tables
- Primary keys and foreign keys

### 2. RLS Policies (12 tests)
**File**: `01-rls-policies.test.sql`

Critical security tests:
- ✅ RLS enabled on Space, Website, Page, Scan
- ✅ RLS enabled on integrations, programs, checks
- ✅ RLS policies exist for all tables
- ✅ Basejump tables have RLS enabled

**Why this matters**: RLS is your primary security mechanism ensuring users only access their own data.

### 3. Foreign Key Relationships (15 tests)
**File**: `02-foreign-key-relationships.test.sql`

Tests referential integrity:
- ✅ Space → auth.users (owner_id)
- ✅ Website → Space (space_id)
- ✅ Website → auth.users (user_id)
- ✅ Page → Website (website_id)
- ✅ Scan → Page (page_id)
- ✅ programs → basejump.accounts + frameworks
- ✅ framework_controls → frameworks + controls
- ✅ program_controls → programs + controls
- ✅ checks → programs + controls + integrations
- ✅ integrations → basejump.accounts

**Why this matters**: Ensures data consistency and prevents orphaned records.

### 4. Data Constraints (20 tests)
**File**: `03-data-constraints.test.sql`

Tests data integrity:
- ✅ NOT NULL constraints on required fields
- ✅ Default values (is_personal, theme, status, scan_type, scope)
- ✅ Primary key constraints
- ✅ CHECK constraints for:
  - controls.id pattern (`^[A-Z]+(-[A-Z0-9]+)+$`)
  - Scan field validations
  - integration_type allowed values
- ✅ Enum types exist (DomainTheme, ScanStatus, account_role, subscription_status)

**Why this matters**: Prevents invalid data from entering your database.

### 5. Timestamps & Triggers (18 tests)
**File**: `04-timestamps-and-triggers.test.sql`

Tests automatic timestamp management:
- ✅ created_at, updated_at columns exist
- ✅ Default to now() for timestamp columns
- ✅ Soft delete support (deleted_at columns)
- ✅ Audit trail (created_by, updated_by in basejump.accounts)

**Why this matters**: Automatic timestamp tracking and audit trails for compliance.

### 6. Controls & Framework System (25 tests)
**File**: `05-controls-framework-system.test.sql`

Tests your compliance framework architecture:
- ✅ Core tables (controls, frameworks, framework_controls)
- ✅ Program management (programs, program_controls)
- ✅ Check system (checks with automated/manual types)
- ✅ Proper column structure for all tables
- ✅ Controls use text IDs (AX-ANIM-01, CIS-001 pattern)
- ✅ Framework metadata (jurisdiction, compliance_type, penalties)

**Why this matters**: Your unique atomic control framework that maps to 50+ compliance frameworks.

## Test Coverage

### What's Tested ✅

1. **Schema Structure** - All tables, columns, and types
2. **Security** - RLS policies on all sensitive tables
3. **Referential Integrity** - All foreign key relationships
4. **Data Quality** - Constraints, defaults, and enums
5. **Audit Trail** - Timestamps and user tracking
6. **Business Logic** - Controls/frameworks mapping system

### What's NOT Tested (Recommendations)

1. **RLS Policy Logic** - Need test users to verify users only see their data
2. **Cascade Behavior** - What happens when you delete a Space?
3. **Triggers** - Do updated_at timestamps actually update?
4. **Functions** - Any custom database functions
5. **Performance** - Index coverage and query performance

## Running Tests

```bash
# Run all tests
yarn test:db

# Run a specific test file
supabase test db supabase/tests/database/01-rls-policies.test.sql

# From apps/allyship
cd apps/allyship && yarn test:db
```

## Next Steps

### High Priority

1. **Add RLS Policy Behavior Tests**
   - Create test users
   - Verify isolation between users
   - Test owner vs member access

2. **Test Cascade Deletes**
   - Insert test data
   - Delete parent records
   - Verify children are deleted/updated correctly

3. **Test Custom Functions**
   - If you have any database functions, test their behavior

### Medium Priority

4. **Test Triggers**
   - Verify updated_at actually updates on row changes
   - Test any custom triggers

5. **Test Integration Points**
   - Verify checks can be created for programs
   - Test framework control mappings

### Low Priority

6. **Performance Tests**
   - Verify indexes exist on foreign keys
   - Test query performance on large datasets

## Example: Adding New Tests

```sql
-- supabase/tests/database/06-your-new-test.test.sql
BEGIN;

create extension if not exists pgtap;
select plan(5);

-- Your tests here
select has_table('public', 'new_table', 'New table should exist');

SELECT * FROM finish();
ROLLBACK;
```

## Resources

- [pgTAP Documentation](https://pgtap.org/)
- [Supabase Testing Guide](https://supabase.com/docs/guides/local-development/testing/pgtap-extended)
- [Test README](./README.md)
