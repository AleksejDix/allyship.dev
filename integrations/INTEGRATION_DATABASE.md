# Integration Database Storage

This document describes how OAuth integrations are stored in the main AllyShip database.

## Architecture

Integrations are **credential collectors only**. They:
1. Handle OAuth flow
2. Encrypt credentials using AES-256-GCM
3. Store in `integrations` table
4. **Do NOT scan** - scanning is handled by a separate scanner service

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

The `integrations` table was created via migration on 2025-12-07:

```sql
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  integration_type TEXT NOT NULL,
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  scan_schedule TEXT,
  last_checked_at TIMESTAMPTZ,
  next_check_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_integrations_org_id ON public.integrations(organization_id);
CREATE INDEX idx_integrations_type ON public.integrations(integration_type);
CREATE INDEX idx_integrations_status ON public.integrations(status);
CREATE INDEX idx_integrations_next_check ON public.integrations(next_check_at);

-- RLS Policies
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own integrations"
  ON public.integrations
  FOR ALL
  USING (organization_id::text = auth.uid()::text);
```

### Config Structure

The `config` JSONB field contains both encrypted and plaintext data:

```json
{
  "access_token": "iv.tag.ciphertext",     // ENCRYPTED
  "refresh_token": "iv.tag.ciphertext",    // ENCRYPTED
  "project_id": "abc123",                  // Plaintext
  "project_name": "My Project",            // Plaintext
  "expires_at": "2025-12-08T10:30:00Z"    // Plaintext
}
```

Sensitive fields automatically encrypted:
- `access_token`
- `refresh_token`
- `api_key`
- `client_secret`
- `*_token`
- `*_key`
- `*_secret`
- `*_password`

## Encryption

### AES-256-GCM Encryption

Credentials are encrypted using industry-standard AES-256-GCM:

```typescript
import { encryptConfig, decryptConfig } from '~/server/utils/encryption'

// Encrypt before storing
const config = {
  access_token: "secret_token",
  project_id: "abc123"
}

const encrypted = encryptConfig(config)
// {
//   access_token: "iv.tag.ciphertext",  // Encrypted
//   project_id: "abc123"                 // Plaintext
// }

// Decrypt when needed
const decrypted = decryptConfig(encrypted)
// Back to original
```

### Setup Encryption Key

1. Generate a key:
   ```bash
   openssl rand -base64 32
   ```

2. Add to `.env`:
   ```bash
   ENCRYPTION_KEY=<your_generated_key>
   ```

3. Test encryption:
   ```bash
   cd integrations/supabase
   node test-encryption.mjs
   ```

## OAuth Flow

### 1. User Authorizes

User clicks "Connect Supabase" → Redirects to Supabase OAuth

### 2. OAuth Callback (`/api/auth/callback`)

1. Exchange authorization code for tokens
2. Fetch project details for naming
3. Encrypt sensitive credentials
4. Save to database:

```typescript
const config = {
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
  project_id: projectId,
  project_name: projectName,
  expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
}

const encryptedConfig = encryptConfig(config)

await supabase.from('integrations').insert({
  organization_id: organizationId,
  integration_type: 'supabase',
  name: projectName,
  config: encryptedConfig,
  status: 'active'
})
```

### 3. Backward Compatibility

For testing, credentials are also stored in cookies:
- Manual scanner still works
- Integration app doesn't break existing workflow
- Scanner service can be built without disrupting current functionality

## API Endpoints

### List Integrations

```
GET /api/integrations
```

Returns list of integrations (credentials NOT included):

```json
{
  "integrations": [
    {
      "id": "uuid",
      "integration_type": "supabase",
      "name": "My Project",
      "status": "active",
      "created_at": "2025-12-07T13:30:00Z"
    }
  ],
  "count": 1
}
```

**Security**: Credentials are NEVER returned in API responses.

### Delete Integration

```
DELETE /api/integrations/:id
```

Removes integration and all credentials:

```json
{
  "success": true,
  "message": "Integration deleted successfully"
}
```

## Security Features

### 1. Encryption at Rest
- AES-256-GCM encryption
- Unique IV (initialization vector) per encrypted value
- Authentication tags prevent tampering
- Encryption key stored in environment variables

### 2. Row Level Security (RLS)
- Users can only access their own integrations
- Enforced at database level
- Uses `auth.uid()` for user identification

### 3. Secure Key Storage
- Encryption key never committed to git
- Stored in environment variables only
- Rotatable without data loss

### 4. API Security
- Credentials never returned in API responses
- Organization verification before operations
- Service role key used for database access

## Environment Variables

```bash
# OAuth Credentials
SUPABASE_CLIENT_ID=xxx
SUPABASE_CLIENT_SECRET=xxx

# Encryption
ENCRYPTION_KEY=base64_encoded_32_byte_key

# Main AllyShip Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Application
APP_URL=http://localhost:3000
```

## Testing

### 1. Test Encryption

```bash
cd integrations/supabase
node test-encryption.mjs
```

Generates new key and tests encrypt/decrypt cycles.

### 2. Test OAuth Flow

1. Start integration app:
   ```bash
   yarn dev
   ```

2. Navigate to `http://localhost:3000`

3. Click "Connect Supabase"

4. Authorize the app

5. Check database:
   ```sql
   SELECT id, integration_type, name, status
   FROM integrations;
   ```

6. Verify encryption:
   ```sql
   SELECT config->'access_token' FROM integrations LIMIT 1;
   -- Should show encrypted format: "iv.tag.ciphertext"
   ```

### 3. Test API Endpoints

```bash
# List integrations
curl http://localhost:3000/api/integrations

# Delete integration
curl -X DELETE http://localhost:3000/api/integrations/<uuid>
```

## Next Steps

### Phase 1: Current (✅ Complete)
- ✅ Create `integrations` table
- ✅ Add encryption utilities
- ✅ Update OAuth callback to save to DB
- ✅ Keep manual scanner working (cookies)
- ✅ Create list/delete API endpoints

### Phase 2: Scanner Service (TODO)
- [ ] Build separate scanner service
- [ ] Read from `integrations` table
- [ ] Decrypt credentials securely
- [ ] Call platform APIs for scanning
- [ ] Store results in `assessments` table
- [ ] Schedule periodic scans

### Phase 3: Production Readiness (TODO)
- [ ] Implement proper user authentication
- [ ] Remove placeholder `organization_id`
- [ ] Add token refresh logic
- [ ] Implement integration health checks
- [ ] Add audit logging for credential access
- [ ] Implement key rotation mechanism
- [ ] Add webhook support for real-time updates
- [ ] Multi-project support per integration type

## Migration Path

**From**: Manual scanner with cookie-based credentials
**To**: Database-stored encrypted credentials with separate scanner

**Current State**:
- OAuth callback saves to both database AND cookies
- Manual scanner can still work via cookies
- No breaking changes to existing functionality

**Future State**:
- Scanner service reads from database
- Credentials only stored in database
- Cookies removed completely
- Multi-customer support
- Scheduled automated scans

## Troubleshooting

### Encryption Key Not Set

```
Error: ENCRYPTION_KEY environment variable is not set
```

**Fix**: Generate and set encryption key:
```bash
openssl rand -base64 32
# Add to .env as ENCRYPTION_KEY=<output>
```

### Database Connection Failed

```
Failed to save integration to database
```

**Fix**: Verify Supabase connection:
```bash
# Check .env has correct values:
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

### RLS Policy Denies Access

```
Row level security policy violation
```

**Fix**: Ensure `organization_id` matches `auth.uid()` or update RLS policies for your auth scheme.

## Architecture Files

- `INTEGRATION_ARCHITECTURE.md` - Overall integration architecture
- `INTEGRATION_DATABASE.md` - This file
- `/Users/aleksej/Projects/allyship.dev/docs/tables.md` - Database schema documentation
- `supabase/migrations/20251207133000_create_integrations_table.sql` - Migration file
