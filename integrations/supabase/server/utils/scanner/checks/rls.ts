import type { SecurityFinding, SupabaseTable, SupabasePolicy } from '../types'
import { nanoid } from 'nanoid'

/**
 * Row Level Security (RLS) Checks
 *
 * Scans for:
 * - Tables without RLS enabled
 * - Tables with RLS but no policies
 * - Overly permissive policies
 * - Public tables with sensitive data
 */

export async function checkRLS(
  projectId: string,
  projectName: string,
  tables: SupabaseTable[],
  policies: SupabasePolicy[]
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  // Check each table
  for (const table of tables) {
    // Skip system schemas
    if (['pg_catalog', 'information_schema', 'pg_toast'].includes(table.schema)) {
      continue
    }

    // CRITICAL: Public tables without RLS
    if (table.schema === 'public' && !table.rls_enabled) {
      findings.push({
        id: nanoid(),
        title: `Table "${table.name}" has RLS disabled`,
        description: `The table "${table.schema}.${table.name}" is publicly accessible without Row Level Security enabled. This means any authenticated user can read, insert, update, or delete data unless protected by API policies.`,
        severity: 'critical',
        category: 'access_control',
        resource: {
          type: 'table',
          name: table.name,
          identifier: `${table.schema}.${table.name}`
        },
        compliance: [
          {
            framework: 'GDPR',
            controls: ['Article 32 - Security of processing', 'Article 5(1)(f) - Integrity and confidentiality'],
            references: ['https://gdpr-info.eu/art-32-gdpr/']
          },
          {
            framework: 'OWASP',
            controls: ['A01:2021 - Broken Access Control'],
            references: ['https://owasp.org/Top10/A01_2021-Broken_Access_Control/']
          },
          {
            framework: 'SOC2',
            controls: ['CC6.1 - Logical and Physical Access Controls'],
            references: []
          }
        ],
        remediation: {
          description: 'Enable Row Level Security on this table and create appropriate policies.',
          code: `-- Enable RLS
ALTER TABLE "${table.schema}"."${table.name}" ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only read their own data
CREATE POLICY "Users can read own data"
ON "${table.schema}"."${table.name}"
FOR SELECT
USING (auth.uid() = user_id);`,
          documentation: 'https://supabase.com/docs/guides/auth/row-level-security'
        },
        metadata: {
          projectId,
          projectName,
          scannedAt: new Date().toISOString()
        }
      })
    }

    // HIGH: RLS enabled but no policies
    if (table.rls_enabled) {
      const tablePolicies = policies.filter(
        p => p.schema === table.schema && p.table === table.name
      )

      if (tablePolicies.length === 0) {
        findings.push({
          id: nanoid(),
          title: `Table "${table.name}" has RLS enabled but no policies`,
          description: `RLS is enabled on "${table.schema}.${table.name}", but no policies are defined. This effectively blocks all access to the table, which may not be intended.`,
          severity: 'high',
          category: 'access_control',
          resource: {
            type: 'table',
            name: table.name,
            identifier: `${table.schema}.${table.name}`
          },
          compliance: [
            {
              framework: 'OWASP',
              controls: ['A01:2021 - Broken Access Control'],
              references: []
            }
          ],
          remediation: {
            description: 'Create appropriate RLS policies to define who can access this data.',
            code: `-- Example: Allow authenticated users to read
CREATE POLICY "Allow authenticated read"
ON "${table.schema}"."${table.name}"
FOR SELECT
TO authenticated
USING (true);`,
            documentation: 'https://supabase.com/docs/guides/auth/row-level-security'
          },
          metadata: {
            projectId,
            projectName,
            scannedAt: new Date().toISOString()
          }
        })
      }
    }
  }

  // Check for overly permissive policies
  for (const policy of policies) {
    // MEDIUM: Policy with "true" condition (allows all)
    if (
      policy.definition?.includes('true') ||
      policy.check?.includes('true')
    ) {
      findings.push({
        id: nanoid(),
        title: `Overly permissive policy "${policy.name}"`,
        description: `The policy "${policy.name}" on table "${policy.schema}.${policy.table}" uses a "true" condition, which grants access to all users without restriction.`,
        severity: 'medium',
        category: 'access_control',
        resource: {
          type: 'policy',
          name: policy.name,
          identifier: `${policy.schema}.${policy.table}.${policy.name}`
        },
        compliance: [
          {
            framework: 'OWASP',
            controls: ['A01:2021 - Broken Access Control'],
            references: []
          },
          {
            framework: 'ISO27001',
            controls: ['A.9.4 - System and application access control'],
            references: []
          }
        ],
        remediation: {
          description: 'Replace the permissive policy with specific access conditions based on user identity or data ownership.',
          code: `-- Review and restrict policy
-- Current policy likely has: USING (true)
-- Replace with specific condition:
DROP POLICY "${policy.name}" ON "${policy.schema}"."${policy.table}";

CREATE POLICY "${policy.name}"
ON "${policy.schema}"."${policy.table}"
FOR ${policy.action}
USING (auth.uid() = user_id); -- Replace with appropriate condition`,
          documentation: 'https://supabase.com/docs/guides/auth/row-level-security#policies'
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
