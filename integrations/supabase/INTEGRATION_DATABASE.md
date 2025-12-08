# Integration Database Storage

This integration now stores OAuth credentials in the main AllyShip database for multi-customer support.

## Architecture

```
User → OAuth Flow → Exchange Token → Encrypt Credentials → Store in DB
                                                              ↓
                                        integrations table (Supabase)
                                        {
                                          organization_id: "org_123",
                                          integration_type: "supabase",
                                          config: {
                                            access_token: "encrypted_...",
                                            refresh_token: "encrypted_...",
                                            project_id: "abc123"
                                          }
                                        }
```

## Database Setup

### 1. Run Migration

```bash
# From main project root
cd apps/allyship
npx supabase migration up
```

This creates the `integrations` table.

### 2. Generate Encryption Key

```bash
openssl rand -base64 32
```

Add to `/integrations/supabase/.env`:
```bash
ENCRYPTION_KEY=<your_generated_key>
```

### 3. Configure Supabase Connection

Add to `/integrations/supabase/.env`:
```bash
# Main AllyShip Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## How It Works

### OAuth Callback Flow

1. **User authorizes** → Supabase redirects to `/api/auth/callback`
2. **Exchange code** for access token + refresh token
3. **Fetch project details** to populate integration name
4. **Encrypt credentials** using AES-256-GCM
5. **Save to database**:
   ```javascript
   {
     organization_id: "demo-org-id", // TODO: From user session
     integration_type: "supabase",
     name: "My Project Name",
     config: {
       access_token: "encrypted_...",
       refresh_token: "encrypted_...",
       project_id: "abc123",
       project_name: "My Project Name",
       expires_at: "2025-12-08T10:30:00Z"
     },
     status: "active"
   }
   ```

### Encryption

Sensitive fields are automatically encrypted:
- `access_token`
- `refresh_token`
- `api_key`
- `client_secret`
- `*_password`
- `*_secret`
- `*_key`

Non-sensitive fields (like `project_id`, `project_name`) are stored as plaintext.

### API Endpoints

#### List Integrations
```bash
GET /api/integrations

Response:
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

**Note:** Credentials are NOT returned in API responses for security.

#### Delete Integration
```bash
DELETE /api/integrations/:id

Response:
{
  "success": true,
  "message": "Integration deleted successfully"
}
```

## Security Features

### 1. Encryption at Rest
- AES-256-GCM encryption
- Unique IV per encrypted value
- Authentication tags prevent tampering

### 2. Row Level Security (RLS)
Users can only access integrations for their organization:
```sql
CREATE POLICY "Users can view their organization's integrations"
  ON integrations FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
  ));
```

### 3. Secure Key Storage
- Encryption key stored in environment variables
- Never committed to git
- Rotatable without data loss

## TODO: Production Readiness

- [ ] Implement proper user authentication
- [ ] Get `organization_id` from user session instead of cookie
- [ ] Add token refresh logic when access token expires
- [ ] Implement integration health checks
- [ ] Add audit logging for credential access
- [ ] Implement key rotation mechanism

## Testing

### Test Encryption Utilities
```bash
cd integrations/supabase
ENCRYPTION_KEY=$(openssl rand -base64 32) node server/utils/encryption.ts
```

### Manual Integration Test
1. Start the integration app: `yarn dev`
2. Complete OAuth flow
3. Check database:
   ```sql
   SELECT id, integration_type, name, status
   FROM integrations
   WHERE organization_id = 'demo-org-id';
   ```
4. Verify credentials are encrypted:
   ```sql
   SELECT config->'access_token' FROM integrations LIMIT 1;
   -- Should return encrypted string like: "aB3d...F7g=.cD4e...H8i=.encrypted_data"
   ```

## Migration Path

### Current (Manual Scanner)
```
OAuth → Store in Cookies → Scan Immediately
```

### New (Database Storage)
```
OAuth → Store in DB → Manual Scanner Still Works (for now)
                    → Separate Scanner Service (future)
```

The OAuth callback now:
1. ✅ Saves to database with encryption
2. ✅ Also stores in cookies (backward compatibility)
3. ✅ Manual scanner can still work for testing

## Next Steps

1. **Build Scanner Service** - Read from `integrations` table, scan periodically
2. **User Authentication** - Connect to actual user accounts
3. **Multi-Project Support** - Let users choose which Supabase project to connect
4. **Webhook Support** - Real-time updates when projects change
