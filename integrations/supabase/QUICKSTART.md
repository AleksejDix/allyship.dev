# Quick Start Guide

Get the Supabase integration running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Yarn package manager
- A Supabase account

## Step 1: Install Dependencies

```bash
cd integrations/supabase
yarn install
```

## Step 2: Create Supabase OAuth App

1. Go to https://supabase.com/dashboard
2. Select your organization
3. Click your profile → Settings → OAuth Apps
4. Click "Create OAuth App"
5. Fill in:
   - **Name**: AllyShip Security Scanner (Local Dev)
   - **Description**: Local development testing
   - **Redirect URI**: `http://localhost:3000/api/auth/callback`
6. Click "Create"
7. Copy your **Client ID** and **Client Secret**

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
SUPABASE_CLIENT_ID=your_client_id_here
SUPABASE_CLIENT_SECRET=your_client_secret_here
APP_URL=http://localhost:3000
```

## Step 4: Start Development Server

```bash
yarn dev
```

You should see:
```
Nuxt 3.15.1 with Nitro 2.x
  > Local:    http://localhost:3000
```

## Step 5: Test OAuth Flow

1. Open http://localhost:3000 in your browser

2. Click **"Connect Supabase"**

3. You'll be redirected to Supabase - click **"Authorize"**

4. You'll be redirected back to http://localhost:3000/dashboard

5. You should see your Supabase projects listed

## Step 6: Run a Security Scan

1. On the dashboard, click **"Run Security Scan"** for any project

2. Wait for the scan to complete (a few seconds)

3. View the results:
   - Summary of findings by severity
   - Compliance scores (GDPR, OWASP, SOC2, etc.)
   - Detailed findings with remediation

## Expected Results

You should see findings like:

- ✅ **Auth Configuration Checks**:
  - Password policy strength
  - MFA status
  - JWT expiration
  - Sign-up protection

- ✅ **API Security Checks**:
  - Service role key security reminder
  - CORS configuration

- ⏳ **Database Checks** (coming soon):
  - RLS enabled on tables
  - Policy definitions
  - Sensitive data protection

## Troubleshooting

### "Not authenticated" error

Clear your browser cookies and try the OAuth flow again.

### "Failed to fetch projects"

Check your `.env` file:
- Is `SUPABASE_CLIENT_ID` correct?
- Is `SUPABASE_CLIENT_SECRET` correct?
- Did you restart the dev server after changing `.env`?

### OAuth redirect fails

Verify the redirect URI in your OAuth app matches exactly:
```
http://localhost:3000/api/auth/callback
```

### No findings appear

This is expected! Currently, only auth and API security checks work via the Management API. Database-level checks (RLS, policies) require additional database access (coming soon).

## What's Working vs Not Working

### ✅ Working Now

- OAuth 2.0 + PKCE flow
- Project listing
- Auth configuration checks
- API security checks
- Compliance mapping
- Results UI

### ⏳ Coming Soon

- Database connection (for RLS/policy checks)
- Scan history storage
- Scheduled scans
- Email alerts
- Report exports

## Next Steps

Once you've verified the OAuth flow works:

1. **Add Database Scanning** - Allow users to provide DB password for deeper scans
2. **Store Scan History** - Save results to a database
3. **Deploy to Production** - Get a production URL
4. **Submit to Marketplace** - Apply for Supabase integration listing

## Development Tips

### Testing Without OAuth

You can test the scanner directly without OAuth:

```typescript
// Create test file: test-scanner.ts
import { SupabaseSecurityScanner } from './server/utils/scanner'

const scanner = new SupabaseSecurityScanner(
  'your-test-access-token',
  'your-project-id'
)

const result = await scanner.scan()
console.log(JSON.stringify(result, null, 2))
```

Run it:
```bash
tsx test-scanner.ts
```

### Adding New Security Checks

1. Create check file in `server/utils/scanner/checks/`
2. Import in `server/utils/scanner/index.ts`
3. Add to `scan()` method
4. Update framework definition in `docs/masterplan/frameworks/supabase-security/`

### Hot Reload

Nuxt has hot reload enabled by default. Changes to:
- Vue files (`.vue`)
- API routes (`server/api/`)
- Utils (`server/utils/`)

...will automatically reload without restarting the server.

## Questions?

- Check [README.md](./README.md) for OAuth flow explanation
- Check [SCANNER.md](./SCANNER.md) for scanner architecture
- Check Nuxt 3 docs: https://nuxt.com/docs
