# AllyShip Supabase Integration

Security scanning for Supabase projects via OAuth integration.

## How It Works

This integration is a **credential collector** that uses OAuth 2.0 to securely connect Supabase projects:

```
User clicks "Connect Supabase"
         ↓
Generate PKCE challenge (security)
         ↓
Redirect to Supabase OAuth
         ↓
User authorizes access
         ↓
Supabase redirects back with CODE
         ↓
Exchange CODE for ACCESS TOKEN
         ↓
ENCRYPT credentials (AES-256-GCM)
         ↓
STORE in integrations table
         ↓
(Scanner service reads from DB - separate)
```

**Important**: This integration does NOT scan. It only:
1. Handles OAuth flow
2. Encrypts credentials
3. Stores in database

Scanning is handled by a separate scanner service that reads from the database.

## Setup

### 1. Create OAuth App in Supabase

1. Go to https://supabase.com/dashboard/org/_/apps
2. Click "Create OAuth App"
3. Fill in:
   - **Name**: AllyShip Security Scanner
   - **Description**: Security scanning for Supabase projects
   - **Redirect URI**: `http://localhost:3000/api/auth/callback` (for development)
4. Copy the Client ID and Client Secret

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```bash
# OAuth App Credentials
SUPABASE_CLIENT_ID=your_client_id_here
SUPABASE_CLIENT_SECRET=your_client_secret_here
APP_URL=http://localhost:3000

# Encryption Key (generate with: openssl rand -base64 32)
ENCRYPTION_KEY=your_base64_encryption_key_here

# Main AllyShip Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Generate encryption key:
```bash
openssl rand -base64 32
```

### 3. Install Dependencies

```bash
yarn install
```

### 4. Run Development Server

```bash
yarn dev
```

Visit http://localhost:3000

## OAuth Flow Explained

### Files Overview

- **`pages/index.vue`** - Landing page with "Connect Supabase" button
- **`server/api/auth/login.get.ts`** - Starts OAuth flow, generates PKCE challenge
- **`server/api/auth/callback.get.ts`** - Handles OAuth callback, exchanges code for token
- **`server/api/projects.get.ts`** - Example: Fetches user's Supabase projects
- **`pages/dashboard.vue`** - Shows connected projects

### Step-by-Step Flow

#### 1. User Clicks "Connect Supabase" (`/api/auth/login`)

```typescript
// Generate random code_verifier (for PKCE security)
const codeVerifier = randomBytes(32).toString('base64url')

// Hash it to create code_challenge
const codeChallenge = SHA256(codeVerifier)

// Store verifier in cookie (need it later)
setCookie('oauth_code_verifier', codeVerifier)

// Redirect to Supabase
redirect('https://api.supabase.com/v1/oauth/authorize?...')
```

**Why PKCE?** Prevents authorization code interception attacks.

#### 2. User Authorizes on Supabase

Supabase shows: "AllyShip wants to access your projects. Allow?"

User clicks "Allow"

#### 3. Supabase Redirects Back (`/api/auth/callback`)

URL: `http://localhost:3000/api/auth/callback?code=ABC123&state=XYZ`

```typescript
// Get authorization code from URL
const code = query.code

// Get stored code_verifier
const codeVerifier = getCookie('oauth_code_verifier')

// Exchange code + verifier for access token
const response = await fetch('https://api.supabase.com/v1/oauth/token', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + base64(clientId + ':' + clientSecret)
  },
  body: {
    grant_type: 'authorization_code',
    code: code,
    code_verifier: codeVerifier
  }
})

// Response contains:
{
  access_token: "eyJ...",     // Use this to call Management API
  refresh_token: "v1.abc...", // Use this to get new access tokens
  expires_in: 3600,           // Token valid for 1 hour
  token_type: "Bearer"
}
```

#### 4. Store Tokens Securely

```typescript
// Encrypt sensitive credentials
const config = {
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
  project_id: projectId,
  project_name: projectName,
  expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
}

const encryptedConfig = encryptConfig(config)

// Save to database
await supabase.from('integrations').insert({
  organization_id: organizationId,
  integration_type: 'supabase',
  name: projectName,
  config: encryptedConfig,
  status: 'active'
})
```

**Security**: Credentials are encrypted using AES-256-GCM before storage. See `INTEGRATION_DATABASE.md` for details.

#### 5. Use Access Token to Call Management API

```typescript
// Get user's projects
const projects = await fetch('https://api.supabase.com/v1/projects', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})

// Get project API keys
const keys = await fetch('https://api.supabase.com/v1/projects/{ref}/api-keys', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

## What We Can Access

Via Management API with access token:

- ✅ List all user's projects
- ✅ Get project details
- ✅ Get project API keys (anon, service_role)
- ✅ Create new projects
- ✅ Configure SMTP settings
- ❌ Database queries (need database password - user provides separately)

## Security Scanning (Next Steps)

Once we have access, we can scan for:

1. **RLS Issues** (requires database access)
   - Tables without RLS enabled
   - Missing policies
   - Overly permissive policies

2. **API Key Exposure**
   - Check if service_role key is in frontend code
   - Verify anon key restrictions

3. **Configuration Issues**
   - Weak JWT secret
   - No MFA enforcement
   - Anonymous sign-in enabled

4. **Compliance Mapping**
   - Map findings to GDPR, SOC2, ISO 27001, etc.

## Production Deployment

For Supabase marketplace submission:

1. Deploy to production (Vercel/Cloudflare/etc)
2. Update OAuth app redirect URI to production URL
3. Store tokens in database (not cookies)
4. Implement token refresh logic
5. Add proper error handling
6. Create branding/marketing materials
7. Submit to Supabase marketplace

## Architecture

```
Integration App (Nuxt 3)
├── Frontend (Vue)
│   ├── Landing page
│   ├── Dashboard
│   └── Integration management
│
└── Backend (Nitro API)
    ├── OAuth handlers (/api/auth/*)
    ├── Encryption utilities
    ├── Integration management (/api/integrations/*)
    └── Database storage
         ↓
┌────────────────────────────────────────┐
│ Database: integrations table           │
│ - Stores encrypted OAuth credentials   │
│ - Multi-tenant with RLS                │
│ - AES-256-GCM encryption               │
└────────────────────────────────────────┘
         ↓
Scanner Service (Separate - Future)
├── Reads from integrations table
├── Decrypts credentials
├── Calls Supabase Management API
└── Stores results in assessments table
```

See `INTEGRATION_ARCHITECTURE.md` and `INTEGRATION_DATABASE.md` for detailed documentation.

## Security Scanner

The scanner performs comprehensive security checks across multiple categories:

### Scan Categories

1. **Access Control** (RLS & Policies)
   - ✅ Tables without RLS enabled
   - ✅ Tables with RLS but no policies
   - ✅ Overly permissive policies (e.g., `USING (true)`)

2. **Authentication & Authorization**
   - ✅ Weak password policies (< 8 characters)
   - ✅ MFA not enabled
   - ✅ Long JWT expiration times
   - ✅ Public sign-up enabled

3. **Data Protection**
   - ✅ Sensitive data (PII/PHI) without RLS
   - ✅ Potential unhashed password columns
   - ⏳ Unencrypted sensitive columns (planned)

4. **API Security**
   - ✅ Service role key security reminders
   - ✅ CORS misconfiguration
   - ⏳ Rate limiting checks (planned)

### Compliance Mapping

All findings are mapped to relevant compliance frameworks:

- **GDPR** - Article 32, Article 5(1)(f)
- **OWASP** - Top 10 2021 (A01, A02, A05, A07)
- **SOC2** - CC6.1 Logical and Physical Access Controls
- **HIPAA** - 164.308, 164.312
- **ISO 27001** - A.9.4 System access control

### Current Limitations

**Database Access Required**: Some checks (RLS, policies, column analysis) require direct database access. Currently:
- ✅ Management API-based checks (auth config, API keys)
- ⏳ Database-based checks (coming soon - requires user to provide DB password)

The next step is implementing database connection support where users can optionally provide their database password for deeper scans.

## Testing the Integration

### 1. Quick Test (Without OAuth App)

You can test the scanner logic without setting up OAuth:

```typescript
// Test scanner directly
import { SupabaseSecurityScanner } from './server/utils/scanner'

const scanner = new SupabaseSecurityScanner(
  'your-access-token',
  'project-id'
)

const results = await scanner.scan()
console.log(results)
```

### 2. Full OAuth Flow Test

1. Create OAuth app in Supabase
2. Configure `.env`
3. Run `yarn dev`
4. Visit http://localhost:3000
5. Click "Connect Supabase"
6. Authorize access
7. Select a project
8. Click "Run Security Scan"
9. View results with findings, severity, and remediation

## Database Storage

The integration now stores OAuth credentials in the main AllyShip database:

### Features
- ✅ AES-256-GCM encryption for sensitive fields
- ✅ Row Level Security (RLS) for multi-tenant isolation
- ✅ API endpoints for listing/deleting integrations
- ✅ Backward compatible with manual scanner (cookies still work)
- ✅ Environment-based encryption key management

### API Endpoints

**List Integrations**
```bash
GET /api/integrations
# Returns list without credentials
```

**Delete Integration**
```bash
DELETE /api/integrations/:id
# Removes integration and credentials
```

### Testing

Test encryption utilities:
```bash
cd integrations/supabase
node test-encryption.mjs
```

See `INTEGRATION_DATABASE.md` for complete documentation.

## Next Steps

### Phase 1: Integration Setup (✅ Complete)
- [x] OAuth 2.0 + PKCE implementation
- [x] Database storage with encryption
- [x] Integration management API
- [x] RLS policies for multi-tenant access

### Phase 2: Scanner Service (TODO)
- [ ] Build separate scanner service
- [ ] Read integrations from database
- [ ] Decrypt credentials securely
- [ ] Call Supabase Management API
- [ ] Store results in assessments table
- [ ] Scheduled scans

### Phase 3: Production Readiness (TODO)
- [ ] User authentication integration
- [x] Token refresh logic - **DONE** (see `TOKEN_REFRESH.md`)
- [ ] Integration health monitoring
- [ ] Audit logging
- [ ] Key rotation mechanism
- [ ] Webhook support
- [ ] Multi-project support
- [ ] Deploy to production
- [ ] Submit to Supabase marketplace
