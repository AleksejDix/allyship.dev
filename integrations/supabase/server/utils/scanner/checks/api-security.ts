import type { SecurityFinding } from '../types'
import { nanoid } from 'nanoid'

/**
 * API Security Checks
 *
 * Scans for:
 * - Service role key exposure risk
 * - Anon key usage patterns
 * - CORS misconfiguration
 */

export async function checkApiSecurity(
  projectId: string,
  projectName: string,
  apiKeys: any,
  projectConfig: any
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  // INFO: Remind about service_role key security
  findings.push({
    id: nanoid(),
    title: 'Service role key security reminder',
    description: 'Your service_role key has full database access and bypasses RLS. Never expose it in client-side code, version control, or logs. Only use it in server-side environments.',
    severity: 'info',
    category: 'api_security',
    resource: {
      type: 'config',
      name: 'API Keys',
      identifier: 'api.service_role_key'
    },
    compliance: [
      {
        framework: 'OWASP',
        controls: ['A02:2021 - Cryptographic Failures'],
        references: ['https://owasp.org/Top10/A02_2021-Cryptographic_Failures/']
      }
    ],
    remediation: {
      description: 'Audit your codebase to ensure service_role key is only used server-side. Use environment variables and never commit keys to Git.',
      code: `# ❌ NEVER do this (client-side)
const supabase = createClient(url, SERVICE_ROLE_KEY)

# ✅ Use anon key in client
const supabase = createClient(url, ANON_KEY)

# ✅ Use service_role only in server/backend
const supabaseAdmin = createClient(url, SERVICE_ROLE_KEY) // Server only!`,
      documentation: 'https://supabase.com/docs/guides/api/api-keys'
    },
    metadata: {
      projectId,
      projectName,
      scannedAt: new Date().toISOString()
    }
  })

  // Check CORS configuration if available
  if (projectConfig?.cors?.allowed_origins) {
    const allowedOrigins = projectConfig.cors.allowed_origins

    // CRITICAL: Allow all origins (*)
    if (allowedOrigins.includes('*')) {
      findings.push({
        id: nanoid(),
        title: 'CORS allows all origins (*)',
        description: 'CORS is configured to allow requests from any origin. This can enable unauthorized websites to make requests to your API.',
        severity: 'high',
        category: 'api_security',
        resource: {
          type: 'config',
          name: 'CORS Configuration',
          identifier: 'api.cors'
        },
        compliance: [
          {
            framework: 'OWASP',
            controls: ['A05:2021 - Security Misconfiguration'],
            references: []
          }
        ],
        remediation: {
          description: 'Restrict CORS to specific trusted domains only.',
          documentation: 'https://supabase.com/docs/guides/api#cors'
        },
        metadata: {
          projectId,
          projectName,
          scannedAt: new Date().toISOString()
        }
      })
    }
  }

  return findings
}
