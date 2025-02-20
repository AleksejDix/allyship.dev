---
description: Guidelines for writing Supabase database functions
globs: "**/*.sql"
---

# Database Function Guidelines

## Core Principles

### Security Settings

✅ Default to SECURITY INVOKER:

```sql
CREATE OR REPLACE FUNCTION public.get_user_data(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'id', id,
      'name', name,
      'email', email
    )
    FROM public.users
    WHERE id = user_id
  );
END;
$$;
```

❌ Avoid omitting security settings:

```sql
-- Don't omit security settings
CREATE OR REPLACE FUNCTION public.get_user_data(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$ -- Bad: Missing SECURITY INVOKER and search_path
BEGIN
  RETURN (SELECT row_to_json(users.*) FROM users WHERE id = user_id);
END;
$$;
```

### Search Path Configuration

✅ Always set and use fully qualified names:

```sql
CREATE OR REPLACE FUNCTION public.calculate_order_total(order_id BIGINT)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT SUM(price * quantity)
  INTO total
  FROM public.order_items
  WHERE order_id = calculate_order_total.order_id;

  RETURN total;
END;
$$;
```

❌ Avoid unqualified references:

```sql
-- Don't use unqualified references
CREATE FUNCTION calculate_total(order_id BIGINT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT SUM(price * quantity)
    FROM order_items -- Bad: Unqualified table reference
    WHERE order_id = calculate_total.order_id
  );
END;
$$;
```

## Function Types

### Immutable Functions

✅ Use IMMUTABLE for deterministic functions:

```sql
CREATE OR REPLACE FUNCTION public.format_full_name(
  first_name TEXT,
  last_name TEXT
)
RETURNS TEXT
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
IMMUTABLE
AS $$
  SELECT first_name || ' ' || last_name;
$$;
```

### Stable Functions

✅ Use STABLE for consistent results within transaction:

```sql
CREATE OR REPLACE FUNCTION public.get_user_settings(user_id UUID)
RETURNS JSONB
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
  SELECT settings
  FROM public.user_settings
  WHERE user_id = get_user_settings.user_id;
$$;
```

### Volatile Functions

✅ Use VOLATILE for functions with side effects:

```sql
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
VOLATILE
AS $$
BEGIN
  NEW.last_login_at = NOW();
  RETURN NEW;
END;
$$;
```

## Error Handling

### Proper Exception Handling

✅ Include comprehensive error handling:

```sql
CREATE OR REPLACE FUNCTION public.safe_divide(
  numerator NUMERIC,
  denominator NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
IMMUTABLE
AS $$
BEGIN
  IF denominator = 0 THEN
    RAISE EXCEPTION 'Division by zero is not allowed'
      USING HINT = 'Please provide a non-zero denominator',
            ERRCODE = '22012';
  END IF;

  RETURN numerator / denominator;
EXCEPTION
  WHEN numeric_value_out_of_range THEN
    RAISE EXCEPTION 'Numeric value out of range'
      USING HINT = 'Check your input values',
            ERRCODE = '22003';
END;
$$;
```

## Trigger Functions

### Before Triggers

✅ Use BEFORE triggers for modifying NEW data:

```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_trigger
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
```

### After Triggers

✅ Use AFTER triggers for side effects:

```sql
CREATE OR REPLACE FUNCTION public.notify_order_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  PERFORM pg_notify(
    'order_created',
    jsonb_build_object(
      'order_id', NEW.id,
      'user_id', NEW.user_id
    )::text
  );
  RETURN NULL;
END;
$$;

CREATE TRIGGER notify_order_created_trigger
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_created();
```

## Parameter Validation

### Input Validation

✅ Validate inputs early:

```sql
CREATE OR REPLACE FUNCTION public.create_user(
  email TEXT,
  name TEXT,
  age INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Validate inputs
  IF email IS NULL OR email = '' THEN
    RAISE EXCEPTION 'Email cannot be empty'
      USING ERRCODE = 'VALID1';
  END IF;

  IF age < 0 OR age > 150 THEN
    RAISE EXCEPTION 'Invalid age: %', age
      USING ERRCODE = 'VALID2';
  END IF;

  -- Create user
  INSERT INTO public.users (email, name, age)
  VALUES (email, name, age)
  RETURNING id INTO user_id;

  RETURN user_id;
END;
$$;
```

## Return Types

### Complex Returns

✅ Use custom types for complex returns:

```sql
-- Create custom type
CREATE TYPE public.user_summary AS (
  id UUID,
  name TEXT,
  email TEXT,
  post_count INTEGER
);

-- Function using custom type
CREATE OR REPLACE FUNCTION public.get_user_summary(user_id UUID)
RETURNS public.user_summary
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
DECLARE
  result public.user_summary;
BEGIN
  SELECT
    u.id,
    u.name,
    u.email,
    COUNT(p.id)::INTEGER
  INTO result
  FROM public.users u
  LEFT JOIN public.posts p ON p.user_id = u.id
  WHERE u.id = get_user_summary.user_id
  GROUP BY u.id, u.name, u.email;

  RETURN result;
END;
$$;
```

## Performance Considerations

### Batch Processing

✅ Use set-based operations:

```sql
CREATE OR REPLACE FUNCTION public.archive_old_posts(
  days_old INTEGER,
  batch_size INTEGER DEFAULT 1000
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
VOLATILE
AS $$
DECLARE
  archived_count INTEGER := 0;
BEGIN
  WITH posts_to_archive AS (
    SELECT id
    FROM public.posts
    WHERE
      created_at < NOW() - (days_old || ' days')::INTERVAL
      AND NOT is_archived
    LIMIT batch_size
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.posts p
  SET
    is_archived = TRUE,
    archived_at = NOW()
  FROM posts_to_archive
  WHERE p.id = posts_to_archive.id
  RETURNING 1
  INTO archived_count;

  RETURN archived_count;
END;
$$;
```
