# Supabase Security Scanner

Comprehensive security scanning engine for Supabase projects.

## Architecture

```
Scanner Engine
├── Access Control Checks (RLS)
├── Authentication Checks (Auth Config)
├── API Security Checks (Keys, CORS)
└── Data Protection Checks (PII, Encryption)
     ↓
  Findings with:
  - Severity (critical → info)
  - Compliance mapping (GDPR, OWASP, SOC2, etc.)
  - Remediation code samples
     ↓
  Scan Result:
  - Summary (counts by severity)
  - Compliance scores
  - Detailed findings
```

## Security Checks

### 1. Row Level Security (RLS)

**File**: `server/utils/scanner/checks/rls.ts`

Checks:
- Tables without RLS enabled (CRITICAL)
- Tables with RLS but no policies (HIGH)
- Overly permissive policies with `true` conditions (MEDIUM)

Example Finding:
```json
{
  "severity": "critical",
  "title": "Table 'users' has RLS disabled",
  "category": "access_control",
  "compliance": [
    {
      "framework": "GDPR",
      "controls": ["Article 32 - Security of processing"]
    },
    {
      "framework": "OWASP",
      "controls": ["A01:2021 - Broken Access Control"]
    }
  ],
  "remediation": {
    "code": "ALTER TABLE users ENABLE ROW LEVEL SECURITY;"
  }
}
```

### 2. Authentication Configuration

**File**: `server/utils/scanner/checks/auth.ts`

Checks:
- Weak password policies (< 8 chars) (HIGH)
- MFA not enabled (MEDIUM)
- Long JWT expiration (LOW)
- Public sign-up enabled (MEDIUM)

Example Finding:
```json
{
  "severity": "high",
  "title": "Weak password policy",
  "description": "Minimum password length is 6. NIST recommends 8+.",
  "category": "authentication",
  "compliance": [
    {
      "framework": "OWASP",
      "controls": ["A07:2021 - Identification and Authentication Failures"]
    }
  ]
}
```

### 3. API Security

**File**: `server/utils/scanner/checks/api-security.ts`

Checks:
- Service role key security reminders (INFO)
- CORS allows all origins (*) (HIGH)

Example Finding:
```json
{
  "severity": "info",
  "title": "Service role key security reminder",
  "description": "Never expose service_role key in client-side code",
  "remediation": {
    "code": "// ✅ Server-side only\nconst supabase = createClient(url, SERVICE_ROLE_KEY)"
  }
}
```

### 4. Data Protection

**File**: `server/utils/scanner/checks/data-protection.ts`

Checks:
- Sensitive columns (email, phone, SSN) without RLS (CRITICAL)
- Password columns not hashed (HIGH)

Detects columns matching patterns:
- `email`, `phone`, `address`
- `ssn`, `social_security`
- `credit_card`, `card_number`, `cvv`
- `birth_date`, `dob`
- `passport`, `license`
- `medical`, `health`, `diagnosis`

Example Finding:
```json
{
  "severity": "critical",
  "title": "Table 'customers' contains sensitive data without RLS",
  "description": "Columns: email, phone, address",
  "compliance": [
    {
      "framework": "GDPR",
      "controls": ["Article 32 - Security of processing"]
    },
    {
      "framework": "HIPAA",
      "controls": ["164.312(a)(1) - Access Control"]
    }
  ]
}
```

## Types

**File**: `server/utils/scanner/types.ts`

Key types:
```typescript
type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info'

type ComplianceFramework = 'GDPR' | 'SOC2' | 'ISO27001' | 'HIPAA' | 'OWASP' | 'CIS'

type SecurityCategory =
  | 'access_control'
  | 'authentication'
  | 'data_protection'
  | 'api_security'
  | 'configuration'
  | 'audit_logging'
  | 'network_security'

interface SecurityFinding {
  id: string
  title: string
  description: string
  severity: SeverityLevel
  category: SecurityCategory
  resource: {
    type: 'project' | 'table' | 'policy' | 'function' | 'config'
    name: string
    identifier: string
  }
  compliance: Array<{
    framework: ComplianceFramework
    controls: string[]
    references: string[]
  }>
  remediation: {
    description: string
    code?: string
    documentation?: string
  }
}
```

## Usage

### Running a Scan

```typescript
import { SupabaseSecurityScanner } from '~/server/utils/scanner'

const scanner = new SupabaseSecurityScanner(
  accessToken,  // OAuth access token
  projectId     // Supabase project ID
)

const result = await scanner.scan()
```

### Scan Result

```typescript
interface ScanResult {
  projectId: string
  projectName: string
  scannedAt: string

  findings: SecurityFinding[]

  summary: {
    critical: number
    high: number
    medium: number
    low: number
    info: number
    total: number
  }

  compliance: Array<{
    framework: ComplianceFramework
    passed: number
    failed: number
    total: number
    score: number  // 0-100
  }>
}
```

## Adding New Checks

### 1. Create Check File

Create `server/utils/scanner/checks/my-check.ts`:

```typescript
import type { SecurityFinding } from '../types'
import { nanoid } from 'nanoid'

export async function checkMyFeature(
  projectId: string,
  projectName: string,
  data: any
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  // Your check logic
  if (someCondition) {
    findings.push({
      id: nanoid(),
      title: 'Issue found',
      description: 'Detailed description',
      severity: 'high',
      category: 'configuration',
      resource: {
        type: 'config',
        name: 'Feature Name',
        identifier: 'feature.config'
      },
      compliance: [
        {
          framework: 'OWASP',
          controls: ['A01:2021 - Broken Access Control'],
          references: ['https://...']
        }
      ],
      remediation: {
        description: 'How to fix',
        code: 'ALTER TABLE ...',
        documentation: 'https://docs...'
      },
      metadata: {
        projectId,
        projectName,
        scannedAt: new Date().toISOString()
      }
    })
  }

  return findings
}
```

### 2. Add to Scanner

Edit `server/utils/scanner/index.ts`:

```typescript
import { checkMyFeature } from './checks/my-check'

async scan(): Promise<ScanResult> {
  const [
    // ... existing checks
    myFindings
  ] = await Promise.all([
    // ... existing checks
    this.scanMyFeature(project.name)
  ])

  findings.push(...myFindings)
}

private async scanMyFeature(projectName: string) {
  const data = await this.fetchMyData()
  return checkMyFeature(this.projectId, projectName, data)
}
```

## Framework Definition

Security checks are mapped to the framework definition in:
`docs/masterplan/frameworks/supabase-security/framework.json`

The framework defines:
- Categories (access_control, authentication, etc.)
- Controls (specific security requirements)
- Severity levels
- Compliance mappings (GDPR, OWASP, SOC2, HIPAA, ISO 27001)

This ensures all scanner findings align with recognized security standards.

## Future Enhancements

### Database Scanning

Add direct database connection for deeper scans:

```typescript
// User provides database password
const scanner = new SupabaseSecurityScanner(
  accessToken,
  projectId,
  {
    databasePassword: userProvidedPassword
  }
)

// Now scanner can query:
// - pg_policies (RLS policies)
// - information_schema.columns (sensitive columns)
// - pg_roles (role permissions)
// - Extension configurations
```

### Additional Checks

- [ ] Storage bucket permissions
- [ ] Edge Function security
- [ ] Database function security (SECURITY DEFINER vs INVOKER)
- [ ] Realtime channel permissions
- [ ] Extension security (which extensions are enabled)
- [ ] Database connection pooling config
- [ ] Backup configuration
- [ ] SSL enforcement
- [ ] IP allowlist configuration

### Scan Scheduling

- [ ] Continuous monitoring
- [ ] Daily/weekly scheduled scans
- [ ] Webhook notifications on critical findings
- [ ] Trend analysis (improving vs degrading)

### Reporting

- [ ] PDF export
- [ ] CSV export for findings
- [ ] Executive summary
- [ ] Compliance report per framework
- [ ] Historical comparison
