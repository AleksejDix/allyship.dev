# AllyShip Integrations

Security scanner integrations for various platforms.

## What Are Integrations?

Integrations are OAuth-based security scanners that connect to third-party platforms (like Supabase, Vercel, Netlify, etc.) and scan for security misconfigurations, compliance violations, and best practice violations.

## Current Integrations

### Supabase Security Scanner

**Status**: ✅ Built (Testing phase)

**Location**: `integrations/supabase/`

**What it does**: Scans Supabase projects for security issues:
- Row Level Security (RLS) misconfigurations
- Weak authentication settings
- API key exposure risks
- Sensitive data without protection
- CORS misconfigurations

**Compliance**: Maps findings to GDPR, OWASP Top 10, SOC2, HIPAA, ISO 27001

**Tech Stack**: Nuxt 3 (Vue + TypeScript)

**Documentation**:
- [README.md](./supabase/README.md) - Setup & OAuth flow
- [SCANNER.md](./supabase/SCANNER.md) - Scanner architecture

**Status**: Ready for OAuth app creation and testing

## Planned Integrations

### Vercel Security Scanner
- Edge config security
- Environment variable exposure
- Deployment protection
- Function permissions

### Netlify Security Scanner
- Build hook security
- Environment variables
- Form handling security
- Identity/Auth configuration

### AWS Security Scanner
- S3 bucket permissions
- Lambda function security
- API Gateway configuration
- IAM policy analysis

### Cloudflare Security Scanner
- Workers security
- DNS configuration
- WAF rules
- API token exposure

## Architecture Pattern

All integrations follow the same pattern:

```
Integration/
├── OAuth 2.0 + PKCE flow
├── Token management
├── Security scanner engine
│   ├── Multiple check categories
│   ├── Severity levels (critical → info)
│   └── Compliance mapping
├── Results dashboard
└── Framework definition (docs/masterplan/frameworks/)
```

## How to Add a New Integration

1. **Create integration folder**:
   ```
   integrations/new-platform/
   ```

2. **Choose tech stack**:
   - Nuxt 3 (recommended, Vue-based)
   - Next.js (React-based)
   - Hono + SPA (separate backend/frontend)

3. **Implement OAuth flow**:
   - Authorization endpoint
   - Callback handler
   - Token exchange
   - Token refresh

4. **Build scanner**:
   - Create check modules
   - Define severity levels
   - Map to compliance frameworks

5. **Create framework definition**:
   ```
   docs/masterplan/frameworks/platform-security/framework.json
   ```

6. **Deploy & submit**:
   - Deploy to production
   - Submit to platform marketplace

## Marketplace Listings

Goal: Get AllyShip listed as official integration on:
- ✅ Supabase Marketplace (in progress)
- ⏳ Vercel Marketplace
- ⏳ Netlify Integrations
- ⏳ Cloudflare Apps

## Benefits of Integrations

1. **For Users**:
   - One-click security scanning
   - Continuous monitoring
   - Compliance mapping
   - Actionable remediation

2. **For AllyShip**:
   - Marketplace visibility
   - OAuth-based trust
   - Recurring scans (potential revenue)
   - Platform partnerships

3. **For Platforms**:
   - Better security for customers
   - Reduced support tickets
   - Compliance assistance
   - Ecosystem growth
