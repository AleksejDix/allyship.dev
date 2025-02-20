---
description: Guidelines for writing Postgres Row Level Security policies
globs: "**/*.sql"
---

# Row Level Security Policy Guidelines

## Core Principles

### Policy Structure

✅ Correct policy structure:

```sql
CREATE POLICY "Users can view their own records"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

❌ Avoid incorrect structures:

```sql
-- Don't combine multiple operations
CREATE POLICY "Users can manage their records"
ON users
FOR SELECT, UPDATE -- Bad: Multiple operations
TO authenticated
USING (auth.uid() = user_id);
```

## Operation-Specific Policies

### SELECT Policies

```sql
-- Always use USING, never WITH CHECK for SELECT
CREATE POLICY "Public posts are viewable by everyone"
ON posts
FOR SELECT
TO authenticated, anon
USING (is_public = true);
```

### INSERT Policies

```sql
-- Always use WITH CHECK, never USING for INSERT
CREATE POLICY "Users can create their own posts"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);
```

### UPDATE Policies

```sql
-- Use both USING and WITH CHECK for UPDATE
CREATE POLICY "Users can update their own posts"
ON posts
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);
```

### DELETE Policies

```sql
-- Always use USING, never WITH CHECK for DELETE
CREATE POLICY "Users can delete their own posts"
ON posts
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);
```

## Role Management

### Role Specification

✅ Always specify roles:

```sql
CREATE POLICY "Authenticated users can view profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);
```

❌ Avoid omitting roles:

```sql
-- Don't omit roles
CREATE POLICY "Anyone can view profiles"
ON profiles
FOR SELECT
USING (true); -- Bad: No role specified
```

## Performance Optimization

### Function Optimization

✅ Use SELECT for functions:

```sql
CREATE POLICY "Users can access their records"
ON documents
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);
```

❌ Avoid direct function calls:

```sql
-- Don't call functions directly
CREATE POLICY "Users can access their records"
ON documents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id); -- Bad: Direct function call
```

### Index Usage

✅ Add indexes for policy columns:

```sql
-- Add index for policy columns
CREATE INDEX idx_documents_user_id ON documents (user_id);

CREATE POLICY "Users can access their records"
ON documents
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);
```

## Join Optimization

### Avoid Direct Joins

✅ Use subqueries instead of joins:

```sql
CREATE POLICY "Team members can access documents"
ON documents
FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id
    FROM team_members
    WHERE user_id = (SELECT auth.uid())
  )
);
```

❌ Avoid policies with joins:

```sql
-- Don't use joins in policies
CREATE POLICY "Team members can access documents"
ON documents
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) IN (
    SELECT user_id
    FROM team_members
    WHERE team_members.team_id = documents.team_id -- Bad: Join
  )
);
```

## Policy Types

### PERMISSIVE vs RESTRICTIVE

✅ Use PERMISSIVE policies (default):

```sql
CREATE POLICY "Users can view public or own posts"
ON posts
FOR SELECT
TO authenticated
USING (
  is_public = true OR
  auth.uid() = author_id
);
```

❌ Avoid RESTRICTIVE policies unless absolutely necessary:

```sql
-- Avoid RESTRICTIVE policies when possible
CREATE POLICY "Must have MFA enabled"
ON sensitive_data
AS RESTRICTIVE -- Bad: Makes policy system more complex
FOR SELECT
TO authenticated
USING ((SELECT auth.jwt()->>'aal') = 'aal2');
```

## Helper Functions

### auth.uid()

```sql
CREATE POLICY "Users can manage their profile"
ON profiles
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);
```

### auth.jwt()

```sql
CREATE POLICY "Team members can view documents"
ON documents
FOR SELECT
TO authenticated
USING (
  team_id = ANY(
    (SELECT auth.jwt() -> 'app_metadata' -> 'teams')::text[]
  )
);
```

## String Handling

### Use Double Apostrophes

✅ Correct string handling:

```sql
CREATE POLICY "Content with special characters"
ON content
FOR SELECT
TO authenticated
USING (name = 'Night''s watch');
```

❌ Avoid single apostrophes:

```sql
-- Don't use single apostrophes
CREATE POLICY "Content with special characters"
ON content
FOR SELECT
TO authenticated
USING (name = 'Night's watch'); -- Bad: Invalid SQL
```
