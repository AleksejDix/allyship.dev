# AllyShip for Slack

Security scanner for Slack workspaces. Scans for security misconfigurations and compliance issues.

## What It Scans

### Workspace Security
- ✅ 2FA enforcement
- ✅ Email domain restrictions
- ✅ Guest user access

### User Security
- ✅ Users without 2FA enabled
- ✅ Guest user monitoring

### Compliance Mapping
- GDPR (Article 32 - Security of processing)
- SOC2 (CC6.1, CC6.2 - Access controls)
- ISO27001 (A.9.4.2 - Secure log-on procedures)

## Quick Start

### 1. Create Slack App

1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Enter:
   - **App Name**: AllyShip Security Scanner (Dev)
   - **Workspace**: Select your workspace
4. Click "Create App"

### 2. Configure OAuth & Permissions

1. In your app settings, go to **OAuth & Permissions**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3001/api/auth/callback
   ```
3. Under **Scopes** → **User Token Scopes**, add:
   - `channels:read`
   - `groups:read`
   - `users:read`
   - `users:read.email`
   - `team:read`

4. Copy your **Client ID** and **Client Secret** from **Basic Information** → **App Credentials**

### 3. Set Up Environment

```bash
cd integrations/slack
cp .env.example .env
```

Edit `.env` and add your credentials:
```bash
SLACK_CLIENT_ID=your_client_id_here
SLACK_CLIENT_SECRET=your_client_secret_here
APP_URL=https://localhost:3001
```

**Note:** The app uses a self-signed HTTPS certificate for local development (required by Slack).

### 4. Update Slack App Redirect URL

Go back to your Slack app → **OAuth & Permissions** and add the redirect URL:
```
https://localhost:3001/api/auth/callback
```

Click **"Save URLs"**

### 5. Install & Run

```bash
# From monorepo root
yarn install

# Start the Slack integration
yarn dev --filter=@allyship/slack-integration
```

Or from the integration directory:
```bash
cd integrations/slack
yarn dev
```

Open http://localhost:3001

### 5. Test OAuth Flow

1. Click **"Add to Slack"**
2. Authorize the app
3. You'll be redirected to `/dashboard`
4. Click **"Run Security Scan"**
5. View findings and compliance scores

## Architecture

```
integrations/slack/
├── pages/
│   ├── index.vue           # Landing page with "Add to Slack"
│   └── dashboard.vue       # Scan results dashboard
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.get.ts    # OAuth initiation
│   │   │   └── callback.get.ts # OAuth callback
│   │   └── scan.get.ts     # Run security scan
│   └── utils/
│       ├── token-refresh.ts    # Automatic token refresh
│       └── scanner/
│           ├── types.ts         # TypeScript types
│           ├── index.ts         # Main scanner
│           └── checks/
│               ├── workspace.ts # Workspace checks
│               └── users.ts     # User checks
└── nuxt.config.ts
```

## Token Management

The integration handles both **access tokens** and **refresh tokens**:

### Access Token
- Short-lived (typically 12 hours)
- Used for API calls
- Automatically refreshed when expired

### Refresh Token
- Long-lived (up to 1 year)
- Used to get new access tokens
- Stored securely in HTTP-only cookies

### Automatic Refresh
When the access token expires, the `/api/scan` endpoint automatically:
1. Detects the expired token
2. Uses the refresh token to get a new access token
3. Updates cookies with new tokens
4. Continues with the scan

No user intervention needed!

## Security Checks

### Workspace Level
- **2FA Enforcement**: Checks if 2FA is required for all members
- **Email Domain Restrictions**: Verifies domain-based access control

### User Level
- **2FA Adoption**: Counts users without 2FA enabled
- **Guest Users**: Monitors guest user access
- **Inactive User Accounts**: Detects users inactive for over 1 year
- **Deactivated Accounts**: Alerts on excessive deactivated accounts
- **Users Without Profile Photos**: Flags incomplete user profiles

### App Security
- **Apps with Sensitive Permissions**: Identifies apps with access to files, history, emails, admin
- **Excessive App Count**: Alerts if >50 apps installed

### External Sharing
- **Externally Shared Channels**: Detects Slack Connect channels
- **Public Channels with Sensitive Names**: Finds public channels that should be private
- **Large Public Channels**: Monitors overly large public channels
- **Message Deletion Settings**: Reviews message deletion policies

## Compliance Frameworks

Each finding is mapped to:
- **GDPR**: Article 32 (Security of processing)
- **SOC2**: CC6.1, CC6.2 (Access controls)
- **ISO27001**: A.9.4.2 (Secure log-on procedures)

## Adding More Checks

1. Create new check file in `server/utils/scanner/checks/`
2. Import in `server/utils/scanner/index.ts`
3. Add to `scan()` method
4. Map to compliance frameworks

## Deployment

For production deployment:

1. Update redirect URL in Slack app to your production domain
2. Update `APP_URL` in `.env`
3. Build and deploy:
   ```bash
   yarn build
   yarn preview
   ```

## Slack App Distribution

To list on Slack App Directory:

1. Complete all required features
2. Add app icon and branding
3. Submit for review at https://api.slack.com/apps/{app-id}/distribute

## API Endpoints

- `GET /api/auth/login` - Initiate OAuth flow
- `GET /api/auth/callback` - Handle OAuth callback
- `GET /api/scan` - Run security scan (requires auth)

## Notes

- Runs on port **3001** (Supabase integration uses 3000)
- Uses Slack Web API (https://api.slack.com/web)
- Stores access token in HTTP-only cookies
- OAuth state parameter for CSRF protection
