# Database Testing with pgTAP

This directory contains database tests using [pgTAP](https://pgtap.org/) for testing PostgreSQL database schemas, tables, functions, and Row Level Security (RLS) policies.

## Quick Start

Run all database tests:

```bash
# From project root
yarn test:db

# Or using Supabase CLI directly
supabase test db

# Run a specific test file
supabase test db supabase/tests/database/00-example-simple-test.sql
```

## Test Structure

Tests are located in `supabase/tests/database/` and run in alphabetical order. Each test file should:

1. Begin with `BEGIN;` to start a transaction
2. Load pgTAP: `create extension if not exists pgtap;`
3. Declare test count: `select plan(N);` where N is the number of tests
4. Run your tests using pgTAP functions
5. Finish with `SELECT * FROM finish();`
6. End with `ROLLBACK;` to clean up

## Example Test

```sql
-- Example test file
BEGIN;

create extension if not exists pgtap;
select plan(3);

-- Test 1: Check table exists
select has_table('public', 'Space', 'Space table should exist');

-- Test 2: Check column exists
select has_column('public', 'Space', 'name', 'Space should have name column');

-- Test 3: Check RLS is enabled
select ok(
    (select relrowsecurity from pg_class where oid = 'public."Space"'::regclass),
    'RLS should be enabled on Space table'
);

SELECT * FROM finish();
ROLLBACK;
```

## Available pgTAP Functions

### Schema Testing
- `has_schema(schema, description)` - Check if schema exists
- `has_table(schema, table, description)` - Check if table exists
- `has_column(schema, table, column, description)` - Check if column exists

### Constraint Testing
- `has_pk(schema, table, description)` - Check for primary key
- `has_fk(schema, table, description)` - Check for foreign keys

### Custom Assertions
- `ok(boolean, description)` - Generic boolean test
- `is(actual, expected, description)` - Equality test
- `isnt(actual, expected, description)` - Inequality test

### Function Testing
- `has_function(schema, function, description)` - Check if function exists
- `function_returns(schema, function, args, return_type, description)` - Check function signature

## Testing Best Practices

1. **Test Isolation**: Each test runs in a transaction that's rolled back, so tests don't affect each other

2. **Descriptive Names**: Use clear descriptions in your tests:
   ```sql
   select has_table('public', 'Website', 'Website table should exist');
   ```

3. **Accurate Plan**: Always match your `plan(N)` count to the number of tests you run

4. **Case Sensitivity**: PostgreSQL table names created with quotes are case-sensitive. Use:
   ```sql
   'public."Space"'::regclass  -- For table "Space" (capitalized)
   'public.space'::regclass    -- For table space (lowercase)
   ```

5. **Test Organization**: Prefix test files with numbers to control execution order:
   - `00-example-simple-test.sql` - Basic schema tests
   - `01-basejump-schema-tests.sql` - Basejump framework tests
   - `02-personal-accounts.sql` - Feature-specific tests

## Current Tests

- **00-example-simple-test.sql**: Tests core schema, tables (Space, Website, Page, Scan, controls, frameworks), RLS policies, and constraints

## Archived Basejump Tests

The original Basejump test suite has been moved to `supabase/basejump-tests-archived/`. These tests require the `basejump-supabase_test_helpers` extension which is not currently set up in the local test environment. If you need to run these tests, you would need to:

1. Install dbdev extension manager in your production database
2. Install the test helpers via `select dbdev.install('basejump-supabase_test_helpers');`
3. Run tests against your production database (not recommended)

For local testing, we recommend writing tests using plain pgTAP as shown in the example test.

## Resources

- [pgTAP Documentation](https://pgtap.org/)
- [Supabase Testing Guide](https://supabase.com/docs/guides/local-development/testing/pgtap-extended)
- [Basejump Testing Guide](https://usebasejump.com/docs/testing)

## Troubleshooting

**Tests fail with "extension not available"**:
- Make sure you're running tests with the Supabase CLI: `supabase test db`
- The local Supabase instance handles extension installation automatically

**Tests fail with "relation does not exist"**:
- Check if migrations have been applied: `supabase db reset`
- Verify table name casing (use quotes for case-sensitive names)

**Test count mismatch**:
- Count all `select` statements that call pgTAP functions
- Update the `plan(N)` number to match
