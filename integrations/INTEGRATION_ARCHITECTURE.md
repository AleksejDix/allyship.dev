# Integration Architecture

## Overview

AllyShip integrations are OAuth-based credential collectors that enable customers to connect their third-party services (Supabase, Slack, GitHub, etc.) for automated compliance scanning.

## Core Principle

**Integrations DON'T scan. They collect and store credentials.**

```
┌─────────────────────────────────────────────────────────────┐
│ Integration App (OAuth Collector)                          │
│ - Handles OAuth flow                                        │
│ - Encrypts credentials                                      │
│ - Stores in database                                        │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Database: integrations table                                │
│ {                                                           │
│   organization_id: "org_123",                              │
│   integration_type: "supabase",                            │
│   config: {                                                 │
│     access_token: "encrypted_abc...",                      │
│     refresh_token: "encrypted_def...",                     │
│     project_id: "proj_456"                                 │
│   }                                                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Scanner Service (Separate - Future)                        │
│ - Reads from integrations table                            │
│ - Decrypts credentials                                      │
│ - Calls platform APIs                                       │
│ - Stores results in assessments table                      │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### `integrations` Table

```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  integration_type TEXT NOT NULL, -- 'supabase' | 'slack' | 'github'...
  name TEXT NOT NULL,             -- User-friendly name
  config JSONB NOT NULL,          -- Encrypted credentials + metadata
  status TEXT DEFAULT 'active',   -- 'active' | 'error' | 'paused'
  scan_schedule TEXT,             -- Cron expression
  last_checked_at TIMESTAMPTZ,
  next_check_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Config Structure

```typescript
{
  // Encrypted fields
  access_token: "encrypted_...",
  refresh_token: "encrypted_...",

  // Plaintext metadata
  project_id: "abc123",
  project_name: "Production",
  expires_at: "2025-12-08T10:30:00Z",

  // Scan config
  enabled_checks: ["rls", "auth", "api_security"]
}
```

## Security

### 1. Encryption (AES-256-GCM)

```typescript
import { encryptConfig, decryptConfig } from '~/server/utils/encryption'

const config = {
  access_token: "secret_token",
  project_id: "abc123"
}

const encrypted = encryptConfig(config)
// {
//   access_token: "iv.tag.ciphertext",  // Encrypted
//   project_id: "abc123"                 // Plaintext
// }

const decrypted = decryptConfig(encrypted)
// Back to original
```

### 2. Row Level Security (RLS)

```sql
-- Users can only see their organization's integrations
CREATE POLICY "org_access" ON integrations
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    )
  );
```

### 3. Credential Handling

✅ **DO:**
- Encrypt before storing in DB
- Use environment variable for encryption key
- Rotate keys periodically
- Audit credential access

❌ **DON'T:**
- Return decrypted credentials in API responses
- Log decrypted credentials
- Store credentials in cookies (except for backward compat during migration)

## Integration Flow

### 1. OAuth Authorization

```typescript
// /api/auth/login.get.ts
const authUrl = new URL('https://api.supabase.com/v1/oauth/authorize')
authUrl.searchParams.set('client_id', CLIENT_ID)
authUrl.searchParams.set('redirect_uri', CALLBACK_URL)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('code_challenge', codeChallenge) // PKCE
authUrl.searchParams.set('state', state) // CSRF protection

return sendRedirect(event, authUrl.toString())
```

### 2. OAuth Callback

```typescript
// /api/auth/callback.get.ts
const tokens = await exchangeCodeForTokens(code, codeVerifier)

const config = {
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
  project_id: await fetchProjectId(tokens.access_token),
  expires_at: new Date(Date.now() + tokens.expires_in * 1000)
}

const encrypted = encryptConfig(config)

await supabase.from('integrations').insert({
  organization_id: user.organization_id,
  integration_type: 'supabase',
  name: 'Production Supabase',
  config: encrypted,
  status: 'active'
})
```

### 3. Scanner Service (Future)

```typescript
// Separate scanner service
const { data: integrations } = await supabase
  .from('integrations')
  .select('*')
  .eq('status', 'active')
  .lte('next_check_at', new Date())

for (const integration of integrations) {
  const config = decryptConfig(integration.config)

  // Use credentials to scan
  const results = await scan(config.access_token, config.project_id)

  // Store results
  await storeAssessments(integration.organization_id, results)
}
```

## Supported Integration Types

| Type | OAuth Provider | API |
|------|---------------|-----|
| `supabase` | Supabase OAuth | Management API v1 |
| `slack` | Slack OAuth 2.0 | Web API |
| `github` | GitHub OAuth | REST API v3 |
| `vercel` | Vercel OAuth | REST API |
| `netlify` | Netlify OAuth | API v1 |
| `aws` | AWS IAM | AWS SDK |

## API Endpoints

### List Integrations
```
GET /api/integrations
→ Returns list without credentials
```

### Delete Integration
```
DELETE /api/integrations/:id
→ Removes integration and credentials
```

### Trigger Scan (Future)
```
POST /api/integrations/:id/scan
→ Queues integration for scanning
```

## Environment Variables

```bash
# OAuth credentials (per integration type)
SUPABASE_CLIENT_ID=xxx
SUPABASE_CLIENT_SECRET=xxx

# Encryption
ENCRYPTION_KEY=base64_encoded_32_byte_key

# Main database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## Testing

### 1. Generate Encryption Key
```bash
openssl rand -base64 32
```

### 2. Test Encryption
```bash
ENCRYPTION_KEY=<key> node server/utils/encryption.ts
```

### 3. Complete OAuth Flow
```bash
yarn dev
# Navigate to http://localhost:3000
# Click "Connect Supabase"
# Authorize
# Check database for encrypted credentials
```

## Migration Guide

### Current State
- Manual scanner with cookie-based credentials
- No multi-customer support

### New State
- Database-stored encrypted credentials
- Multi-customer ready
- Backward compatible (cookies still work)

### Migration Steps
1. ✅ Create `integrations` table
2. ✅ Add encryption utilities
3. ✅ Update OAuth callback to save to DB
4. ✅ Keep manual scanner working (cookies)
5. ⏳ Build scanner service
6. ⏳ Remove cookie dependency

## Next Steps

1. **User Authentication** - Connect integrations to real user accounts
2. **Scanner Service** - Build separate service that reads from DB
3. **Token Refresh** - Auto-refresh expired access tokens
4. **Webhooks** - Real-time updates from platforms
5. **Multi-Project Support** - Let users connect multiple projects
6. **Integration Health** - Monitor integration status
