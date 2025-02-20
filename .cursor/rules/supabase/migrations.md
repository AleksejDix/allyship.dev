---
description: Guidelines for writing Postgres migrations
globs: "supabase/migrations/**/*.sql"
---

# Database Migration Guidelines

## File Naming

### Migration File Format

✅ Use correct UTC timestamp format:

```
YYYYMMDDHHmmss_short_description.sql
```

Example:

```
20240906123045_create_profiles.sql
20240906123145_add_email_verification.sql
20240906123245_alter_user_roles.sql
```

❌ Avoid incorrect formats:

```
# Don't use these formats
2024-09-06_profiles.sql          # Bad: Wrong timestamp format
create_profiles_20240906.sql     # Bad: Timestamp at end
1_add_users.sql                  # Bad: Sequential numbering
```

## Migration Structure

### Header Documentation

✅ Include comprehensive headers:

```sql
-- Migration: Create profiles table
-- Description: Creates the profiles table with RLS policies
-- Tables: profiles
-- Dependencies: auth.users
-- Author: Jane Smith
-- Date: 2024-09-06

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Comments
comment on table public.profiles is 'User profile information';
comment on column public.profiles.id is 'References auth.users.id';
comment on column public.profiles.username is 'Unique username for the profile';

-- Create policies
create policy "Public profiles are viewable by everyone"
on public.profiles
for select
to authenticated, anon
using (true);

create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can delete their own profile"
on public.profiles
for delete
to authenticated
using (auth.uid() = id);
```

### Destructive Changes

✅ Document destructive operations:

```sql
-- WARNING: Destructive changes below
-- This migration will:
-- 1. Drop the 'old_profiles' table
-- 2. Remove the 'unused_column' from 'users'
-- 3. Change 'email' column type from varchar to text

-- Backup old data (if needed)
create table public.old_profiles_backup as
select * from public.old_profiles;

-- Drop old table
drop table if exists public.old_profiles;

-- Remove unused column
alter table public.users
drop column if exists unused_column;

-- Change column type
alter table public.users
alter column email type text;
```

## Table Creation

### Basic Table Structure

✅ Include standard columns and RLS:

```sql
-- Create new table with standard columns
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Add constraints
  constraint "title_length" check (char_length(title) >= 3),
  constraint "valid_content" check (content is null or char_length(content) > 0)
);

-- Enable RLS
alter table public.documents enable row level security;

-- Add indexes
create index documents_user_id_idx on public.documents (user_id);
create index documents_created_at_idx on public.documents (created_at desc);

-- Add comments
comment on table public.documents is 'User documents and content';
comment on column public.documents.title is 'Document title (min 3 characters)';
```

## RLS Policies

### Policy Structure

✅ Create granular policies:

```sql
-- Allow public read access
create policy "Documents are viewable by everyone"
on public.documents
for select
to anon
using (true);

create policy "Documents are viewable by authenticated users"
on public.documents
for select
to authenticated
using (true);

-- Restrict write access to owners
create policy "Users can create their own documents"
on public.documents
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own documents"
on public.documents
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own documents"
on public.documents
for delete
to authenticated
using (auth.uid() = user_id);
```

### Policy Comments

✅ Document policy rationale:

```sql
-- Policy: Public read access for blog posts
-- Rationale: Blog posts should be publicly accessible
-- Security: No sensitive data in this table
create policy "Blog posts are publicly viewable"
on public.blog_posts
for select
to anon
using (true);

-- Policy: Authenticated write access for comments
-- Rationale: Only logged-in users can comment
-- Security: Prevents spam and requires accountability
create policy "Authenticated users can create comments"
on public.comments
for insert
to authenticated
with check (auth.uid() = user_id);
```

## Data Migration

### Safe Data Transfer

✅ Use transactions and validation:

```sql
-- Migrate user preferences to new structure
begin;
  -- Create temporary staging table
  create temporary table preference_staging (
    user_id uuid,
    preferences jsonb,
    valid boolean
  );

  -- Copy and validate data
  insert into preference_staging
  select
    id as user_id,
    jsonb_build_object(
      'theme', coalesce(theme, 'light'),
      'notifications', coalesce(notifications, true)
    ) as preferences,
    true as valid
  from public.old_user_preferences;

  -- Insert valid data only
  insert into public.user_preferences (user_id, preferences)
  select user_id, preferences
  from preference_staging
  where valid = true;
commit;

-- Cleanup
drop table if exists preference_staging;
```

## Schema Updates

### Column Modifications

✅ Safe column updates:

```sql
-- Add new columns with defaults
alter table public.users
add column if not exists status text not null default 'active',
add column if not exists last_login timestamptz;

-- Add column comments
comment on column public.users.status is 'User account status';
comment on column public.users.last_login is 'Timestamp of last login';

-- Create index for frequently queried column
create index users_status_idx on public.users (status);

-- Add check constraint
alter table public.users
add constraint "valid_status"
check (status in ('active', 'inactive', 'suspended'));
```

## Rollback Support

### Revertible Changes

✅ Include rollback instructions:

```sql
-- Forward migration
create type user_role as enum ('admin', 'moderator', 'user');

alter table public.users
add column role user_role not null default 'user';

-- Rollback instructions (in comments)
/*
To rollback this migration:

1. Remove the column:
alter table public.users drop column role;

2. Remove the enum type:
drop type user_role;
*/
```
