# Supabase Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Visit http://localhost:3000                                │
│  2. Click "Connect Supabase"                                   │
│  3. Redirected to Supabase OAuth                               │
│  4. Authorize access                                            │
│  5. Redirected back with code                                   │
│  6. View dashboard with projects                                │
│  7. Click "Run Security Scan"                                   │
│  8. View scan results                                           │
│                                                                 │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│              AllyShip Integration (Nuxt 3)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend (Pages)                                               │
│  ├── pages/index.vue          Landing page                     │
│  ├── pages/dashboard.vue      Project list                     │
│  └── pages/scan/[id].vue      Scan results                     │
│                                                                 │
│  Backend (API Routes)                                           │
│  ├── server/api/auth/                                           │
│  │   ├── login.get.ts         Start OAuth flow                 │
│  │   └── callback.get.ts      Handle OAuth callback            │
│  ├── server/api/projects.get.ts   List projects                │
│  └── server/api/scan/[id].get.ts  Run security scan           │
│                                                                 │
│  Security Scanner                                               │
│  ├── server/utils/scanner/                                      │
│  │   ├── index.ts             Main scanner class               │
│  │   ├── types.ts             TypeScript types                 │
│  │   └── checks/                                                │
│  │       ├── rls.ts           Row Level Security               │
│  │       ├── auth.ts          Authentication config            │
│  │       ├── api-security.ts  API keys & CORS                  │
│  │       └── data-protection.ts  PII/PHI detection             │
│                                                                 │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Platform                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OAuth Server                                                   │
│  └── api.supabase.com/v1/oauth/                                │
│      ├── /authorize       User authorization                   │
│      └── /token          Exchange code for token              │
│                                                                 │
│  Management API                                                 │
│  └── api.supabase.com/v1/                                      │
│      ├── /projects        List user's projects                 │
│      └── /projects/{id}/api-keys  Get API keys                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## OAuth Flow (Detailed)

```
User                  AllyShip               Supabase OAuth          Supabase API
 │                       │                         │                      │
 │  1. Click "Connect"   │                         │                      │
 ├──────────────────────>│                         │                      │
 │                       │                         │                      │
 │                       │  2. Generate PKCE       │                      │
 │                       │     code_verifier       │                      │
 │                       │     code_challenge      │                      │
 │                       │                         │                      │
 │  3. Redirect          │                         │                      │
 │<──────────────────────┤                         │                      │
 │                       │                         │                      │
 │  4. Authorize         │                         │                      │
 ├───────────────────────┼────────────────────────>│                      │
 │                       │                         │                      │
 │  5. Redirect with code│                         │                      │
 │<──────────────────────┼─────────────────────────┤                      │
 │                       │                         │                      │
 │                       │  6. Exchange code       │                      │
 │                       │     + code_verifier     │                      │
 │                       ├────────────────────────>│                      │
 │                       │                         │                      │
 │                       │  7. access_token        │                      │
 │                       │     refresh_token       │                      │
 │                       │<────────────────────────┤                      │
 │                       │                         │                      │
 │                       │  8. Store tokens        │                      │
 │                       │     (httpOnly cookie)   │                      │
 │                       │                         │                      │
 │  9. Redirect to       │                         │                      │
 │     /dashboard        │                         │                      │
 │<──────────────────────┤                         │                      │
 │                       │                         │                      │
 │  10. Load projects    │                         │                      │
 ├──────────────────────>│                         │                      │
 │                       │                         │                      │
 │                       │  11. GET /v1/projects   │                      │
 │                       │      Authorization: Bearer {access_token}      │
 │                       ├─────────────────────────┼─────────────────────>│
 │                       │                         │                      │
 │                       │  12. Projects list      │                      │
 │                       │<─────────────────────────┼──────────────────────┤
 │                       │                         │                      │
 │  13. Display projects │                         │                      │
 │<──────────────────────┤                         │                      │
 │                       │                         │                      │
```

## Security Scan Flow

```
User                  AllyShip Scanner           Supabase API
 │                          │                          │
 │  1. Click "Scan"         │                          │
 ├─────────────────────────>│                          │
 │                          │                          │
 │                          │  2. Fetch project info   │
 │                          ├─────────────────────────>│
 │                          │                          │
 │                          │  3. Fetch API keys       │
 │                          ├─────────────────────────>│
 │                          │                          │
 │                          │  4. Fetch auth config    │
 │                          ├─────────────────────────>│
 │                          │                          │
 │                          │  5. Run security checks  │
 │                          │     in parallel:         │
 │                          │     - RLS checks         │
 │                          │     - Auth checks        │
 │                          │     - API checks         │
 │                          │     - Data checks        │
 │                          │                          │
 │                          │  6. Generate findings    │
 │                          │     - Severity           │
 │                          │     - Compliance mapping │
 │                          │     - Remediation        │
 │                          │                          │
 │                          │  7. Calculate scores     │
 │                          │     - Summary            │
 │                          │     - Compliance %       │
 │                          │                          │
 │  8. Display results      │                          │
 │<─────────────────────────┤                          │
 │                          │                          │
```

## Scanner Architecture

```
SupabaseSecurityScanner
│
├── scan() → ScanResult
│   │
│   ├── fetchProject()
│   │   └── GET /v1/projects/{id}
│   │
│   ├── Run checks in parallel:
│   │   │
│   │   ├── scanRLS()
│   │   │   └── checkRLS()
│   │   │       ├── Tables without RLS
│   │   │       ├── Tables without policies
│   │   │       └── Permissive policies
│   │   │
│   │   ├── scanAuth()
│   │   │   └── checkAuth()
│   │   │       ├── Password policy
│   │   │       ├── MFA enabled
│   │   │       ├── JWT expiry
│   │   │       └── Sign-up protection
│   │   │
│   │   ├── scanApiSecurity()
│   │   │   └── checkApiSecurity()
│   │   │       ├── Service role key
│   │   │       └── CORS config
│   │   │
│   │   └── scanDataProtection()
│   │       └── checkDataProtection()
│   │           ├── Sensitive columns
│   │           └── Password storage
│   │
│   ├── Aggregate findings
│   │
│   ├── Calculate summary
│   │   ├── Count by severity
│   │   └── Total findings
│   │
│   └── Calculate compliance scores
│       ├── GDPR
│       ├── OWASP
│       ├── SOC2
│       ├── HIPAA
│       └── ISO 27001
│
└── Return ScanResult
```

## Data Flow

```
1. User Input
   └─> OAuth authorization

2. AllyShip receives access_token
   └─> Stores in httpOnly cookie

3. User triggers scan
   └─> AllyShip reads access_token

4. Scanner fetches data
   ├─> Management API (project info, API keys)
   └─> (Future) Database queries (RLS, policies)

5. Scanner runs checks
   ├─> Generates SecurityFinding[]
   └─> Maps to compliance frameworks

6. Scanner calculates scores
   ├─> Summary (counts by severity)
   └─> Compliance (% per framework)

7. Results displayed
   ├─> Severity cards (Critical, High, Medium, Low, Info)
   ├─> Compliance scores (GDPR, OWASP, SOC2, etc.)
   └─> Detailed findings with remediation
```

## File Structure

```
integrations/supabase/
│
├── Frontend
│   ├── app.vue                    Root component
│   ├── pages/
│   │   ├── index.vue              Landing page
│   │   ├── dashboard.vue          Project dashboard
│   │   └── scan/[projectId].vue   Scan results
│   │
├── Backend API
│   └── server/
│       ├── api/
│       │   ├── auth/
│       │   │   ├── login.get.ts       OAuth start
│       │   │   └── callback.get.ts    OAuth callback
│       │   ├── projects.get.ts        List projects
│       │   └── scan/[projectId].get.ts Run scan
│       │
│       └── utils/
│           └── scanner/
│               ├── index.ts                Scanner class
│               ├── types.ts                TypeScript types
│               └── checks/
│                   ├── rls.ts              RLS checks
│                   ├── auth.ts             Auth checks
│                   ├── api-security.ts     API checks
│                   └── data-protection.ts  Data checks
│
├── Configuration
│   ├── nuxt.config.ts             Nuxt configuration
│   ├── package.json               Dependencies
│   ├── .env.example               Environment template
│   └── tsconfig.json              TypeScript config
│
└── Documentation
    ├── README.md                  Main documentation
    ├── QUICKSTART.md             Getting started
    ├── SCANNER.md                Scanner details
    └── ARCHITECTURE.md           This file
```

## Security Considerations

### Token Storage

- ✅ Access tokens stored in httpOnly cookies (not accessible via JavaScript)
- ✅ Secure flag set in production (HTTPS only)
- ✅ SameSite=Lax (CSRF protection)
- ✅ Short expiration (1 hour)
- ✅ Refresh token for obtaining new access tokens

### PKCE (Proof Key for Code Exchange)

- ✅ Prevents authorization code interception
- ✅ SHA256 hashing of code_verifier
- ✅ Code challenge sent to Supabase
- ✅ Code verifier used in token exchange

### State Parameter

- ✅ Random state generated
- ✅ Stored in cookie
- ✅ Verified on callback (CSRF protection)

## Deployment Architecture

```
Production Deployment

┌────────────────────────────────────────────┐
│         CDN / Edge (Cloudflare)            │
│  - Static assets                           │
│  - Global distribution                     │
└────────────┬───────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────┐
│      Nuxt Server (Vercel/Netlify)          │
│  - SSR rendering                           │
│  - API routes                              │
│  - OAuth handling                          │
│  - Security scanner                        │
└────────────┬───────────────────────────────┘
             │
             ├────────────────────┐
             ▼                    ▼
┌──────────────────────┐  ┌──────────────────┐
│  Supabase OAuth API  │  │ Supabase Mgmt API│
│  - Authorization     │  │ - Projects       │
│  - Token exchange    │  │ - API keys       │
└──────────────────────┘  └──────────────────┘
```

## Future Enhancements

### Database Scanning

```
Current:  Management API only ──> Limited checks
           (auth, API keys)

Future:   Management API + Database access ──> Complete checks
           (auth, API keys, RLS, policies, columns)

User provides DB password ──> Scanner connects directly
                          ──> Queries pg_policies, information_schema
                          ──> Deeper security analysis
```

### Continuous Monitoring

```
One-time scan:     User triggers ──> Results shown

Scheduled scans:   Cron job ──> Daily/weekly scans
                            ──> Compare with previous
                            ──> Email alerts on critical findings
                            ──> Trend analysis (improving/degrading)
```

### Advanced Features

- [ ] Multi-project batch scanning
- [ ] Compliance report generation (PDF)
- [ ] Integration with CI/CD pipelines
- [ ] Slack/Discord notifications
- [ ] Custom rule definitions
- [ ] Whitelabel for enterprises
