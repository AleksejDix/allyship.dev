# Token Refresh Implementation

Automatic token refresh for OAuth integrations to maintain continuous access without requiring users to re-authorize.

## How It Works

OAuth access tokens typically expire after 1 hour. We use refresh tokens to automatically get new access tokens before they expire.

### Flow

```
Access Token Expiring
         ↓
Check expires_at timestamp
         ↓
Use refresh_token to get new access_token
         ↓
Encrypt and save new tokens to database
         ↓
Continue using integration seamlessly
```

## Features

### 1. Automatic Token Refresh

**Function**: `refreshSupabaseToken(integrationId)`

Refreshes an expired access token using the refresh token:
- Fetches integration from database
- Decrypts refresh token
- Calls Supabase OAuth token endpoint
- Receives new access token and refresh token
- Encrypts and saves updated tokens
- Marks integration as `error` if refresh fails

### 2. Token Expiry Check

**Function**: `shouldRefreshToken(expiresAt, bufferMinutes = 5)`

Determines if a token needs refreshing:
- Returns `true` if token expires within 5 minutes (configurable)
- Prevents last-minute failures by refreshing proactively

### 3. Get Valid Token

**Function**: `getValidAccessToken(integrationId)`

Smart token retrieval that handles expiry automatically:
- Checks if token is expired or expiring soon
- Automatically refreshes if needed
- Returns valid access token ready to use
- Returns `null` if refresh fails

### 4. Batch Token Refresh

**Function**: `refreshExpiredTokens()`

Refreshes all expired tokens across all integrations:
- Queries all active integrations
- Checks each for expiry
- Refreshes expired tokens
- Logs results

## API Endpoints

### Manual Token Refresh

```bash
POST /api/integrations/:id/refresh
```

Manually trigger token refresh for testing:

```bash
curl -X POST http://localhost:3001/api/integrations/11d45a75-4fd4-4899-9496-dacb609cecc0/refresh
```

Response:
```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "integration": {
    "id": "11d45a75-4fd4-4899-9496-dacb609cecc0",
    "name": "dignity-dev",
    "status": "active",
    "updated_at": "2025-12-07T14:00:00Z"
  }
}
```

### Cron Job Endpoint

```bash
POST /api/cron/refresh-tokens
```

Batch refresh all expired tokens:

```bash
curl -X POST http://localhost:3001/api/cron/refresh-tokens
```

Response:
```json
{
  "success": true,
  "message": "Token refresh completed",
  "timestamp": "2025-12-07T14:00:00Z"
}
```

## Usage in Scanner Service

When building the scanner service, use `getValidAccessToken()` to ensure you always have a valid token:

```typescript
import { getValidAccessToken } from '~/server/utils/token-refresh'

async function scanSupabaseProject(integrationId: string) {
  // Get valid access token (auto-refreshes if needed)
  const accessToken = await getValidAccessToken(integrationId)

  if (!accessToken) {
    console.error('Failed to get valid access token')
    return
  }

  // Use token to call Supabase Management API
  const projects = await fetch('https://api.supabase.com/v1/projects', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  // Continue scanning...
}
```

## Automated Refresh (Production)

### Option 1: Vercel Cron Jobs

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-tokens",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

This runs every 30 minutes.

### Option 2: External Cron Service

Use services like:
- **cron-job.org**
- **EasyCron**
- **Google Cloud Scheduler**
- **AWS EventBridge**

Configure to POST to:
```
https://your-domain.com/api/cron/refresh-tokens
```

Every 30 minutes: `*/30 * * * *`

### Option 3: System Cron

Add to crontab:

```bash
*/30 * * * * curl -X POST https://your-domain.com/api/cron/refresh-tokens
```

## Security

### Protect Cron Endpoint

Add to `.env`:
```bash
CRON_SECRET=your_random_secret_here
```

Update `server/api/cron/refresh-tokens.post.ts`:

```typescript
export default defineEventHandler(async (event) => {
  const cronSecret = getHeader(event, 'x-cron-secret')

  if (cronSecret !== process.env.CRON_SECRET) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Continue...
})
```

Then call with:
```bash
curl -X POST \
  -H "x-cron-secret: your_random_secret_here" \
  https://your-domain.com/api/cron/refresh-tokens
```

## Error Handling

### When Refresh Fails

If token refresh fails:
1. Integration status is set to `error`
2. `error_message` is set with details
3. User needs to re-authorize the integration

Query integrations with errors:

```sql
SELECT id, name, error_message
FROM integrations
WHERE status = 'error';
```

### Common Failure Reasons

- **Refresh token expired**: User must re-authorize
- **Refresh token revoked**: User revoked access
- **OAuth app deleted**: OAuth app no longer exists
- **Network error**: Temporary, retry may work

## Testing

### 1. Test Manual Refresh

```bash
# Get integration ID
curl http://localhost:3001/api/integrations

# Trigger refresh
curl -X POST http://localhost:3001/api/integrations/[id]/refresh
```

### 2. Test Batch Refresh

```bash
curl -X POST http://localhost:3001/api/cron/refresh-tokens
```

### 3. Test getValidAccessToken

Create test script:

```typescript
import { getValidAccessToken } from './server/utils/token-refresh'

const integrationId = '11d45a75-4fd4-4899-9496-dacb609cecc0'
const token = await getValidAccessToken(integrationId)

console.log('Valid token:', token ? '✅' : '❌')
```

### 4. Verify Token in Database

```sql
-- Check expires_at was updated
SELECT
  id,
  name,
  config->>'expires_at' as expires_at,
  updated_at
FROM integrations
WHERE id = '11d45a75-4fd4-4899-9496-dacb609cecc0';
```

## Monitoring

### Log Messages

The token refresh utilities log these messages:

- `🔄 Refreshing access token for integration: [id]`
- `✅ Access token refreshed successfully`
- `❌ Failed to save integration: [error]`
- `⏰ Cron job triggered: Token refresh`
- `✅ Token refresh complete: X refreshed, Y errors`

### Database Checks

Monitor integration health:

```sql
-- Count integrations by status
SELECT status, COUNT(*)
FROM integrations
GROUP BY status;

-- Find integrations with expiring tokens
SELECT id, name, config->>'expires_at' as expires_at
FROM integrations
WHERE status = 'active'
  AND (config->>'expires_at')::timestamptz < NOW() + INTERVAL '1 hour';
```

## Best Practices

1. **Refresh Proactively**: Use 5-10 minute buffer before expiry
2. **Handle Failures Gracefully**: Mark as error, notify user
3. **Log Everything**: Track refresh success/failure rates
4. **Monitor Errors**: Alert on high error rates
5. **Secure Cron Endpoint**: Use secret tokens in production
6. **Test Regularly**: Verify refresh logic works end-to-end

## Next Steps

- [ ] Set up automated cron job (Vercel Cron or external)
- [ ] Add monitoring/alerting for failed refreshes
- [ ] Implement user notifications for error integrations
- [ ] Add retry logic for transient failures
- [ ] Build scanner service that uses `getValidAccessToken()`
