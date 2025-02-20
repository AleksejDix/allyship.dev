---
description: Authentication and authorization guidelines
globs:
  - "**/auth/**/*"
  - "**/api/auth/**/*"
  - "**/*.{ts,tsx}"
---

# Authentication Guidelines

## Supabase Auth

### Use Native Supabase Auth

❌ Never use @supabase/auth-helpers-nextjs:

```typescript
// Don't do this
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
```

✅ Use native Supabase auth:

```typescript
// Do this
import { createClient } from "@supabase/supabase-js"
```

## Authentication Flow

- Implement proper login flow
- Handle session management
- Secure password reset
- Implement MFA when needed
- Handle social auth properly

## Authorization

- Implement proper RBAC
- Use proper permission checks
- Handle role-based access
- Implement proper ACLs
- Validate user permissions

## Session Management

- Secure session storage
- Implement proper timeouts
- Handle session refresh
- Validate session tokens
- Implement proper logout

## Security Headers

- Set proper security headers
- Implement CSP properly
- Use secure cookies
- Handle CORS properly
- Set proper HSTS

## Best Practices

- Follow OAuth best practices
- Implement proper rate limiting
- Use secure password storage
- Handle errors securely
- Monitor auth attempts
