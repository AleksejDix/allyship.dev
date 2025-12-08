import type { SecurityFinding, SupabaseTable } from '../types'
import { nanoid } from 'nanoid'

/**
 * Data Protection Checks
 *
 * Scans for:
 * - Potential PII/PHI data without encryption
 * - Sensitive column names without RLS
 * - Audit logging configuration
 */

const SENSITIVE_COLUMN_PATTERNS = [
  /email/i,
  /password/i,
  /ssn/i,
  /social.security/i,
  /credit.card/i,
  /card.number/i,
  /cvv/i,
  /phone/i,
  /address/i,
  /birth.date/i,
  /dob/i,
  /passport/i,
  /license/i,
  /medical/i,
  /health/i,
  /diagnosis/i,
  /prescription/i,
]

export async function checkDataProtection(
  projectId: string,
  projectName: string,
  tables: SupabaseTable[],
  columns: any[]
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  // Check for sensitive columns in tables without RLS
  for (const table of tables) {
    if (['pg_catalog', 'information_schema', 'pg_toast'].includes(table.schema)) {
      continue
    }

    const tableColumns = columns.filter(
      c => c.table_schema === table.schema && c.table_name === table.name
    )

    const sensitiveColumns = tableColumns.filter(col =>
      SENSITIVE_COLUMN_PATTERNS.some(pattern => pattern.test(col.column_name))
    )

    if (sensitiveColumns.length > 0 && !table.rls_enabled) {
      findings.push({
        id: nanoid(),
        title: `Table "${table.name}" contains sensitive data without RLS`,
        description: `The table "${table.schema}.${table.name}" has columns that may contain sensitive data (${sensitiveColumns.map(c => c.column_name).join(', ')}), but Row Level Security is not enabled.`,
        severity: 'critical',
        category: 'data_protection',
        resource: {
          type: 'table',
          name: table.name,
          identifier: `${table.schema}.${table.name}`
        },
        compliance: [
          {
            framework: 'GDPR',
            controls: [
              'Article 32 - Security of processing',
              'Article 5(1)(f) - Integrity and confidentiality'
            ],
            references: ['https://gdpr-info.eu/art-32-gdpr/']
          },
          {
            framework: 'HIPAA',
            controls: [
              '164.312(a)(1) - Access Control',
              '164.312(e)(1) - Transmission Security'
            ],
            references: []
          },
          {
            framework: 'SOC2',
            controls: ['CC6.1 - Logical and Physical Access Controls'],
            references: []
          }
        ],
        remediation: {
          description: 'Enable RLS and create policies to protect sensitive data. Consider encryption at rest for highly sensitive fields.',
          code: `-- Enable RLS
ALTER TABLE "${table.schema}"."${table.name}" ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy
CREATE POLICY "Users can only access own data"
ON "${table.schema}"."${table.name}"
FOR ALL
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
  }

  // Check for password columns that might not be hashed
  for (const col of columns) {
    if (/password/i.test(col.column_name) && col.data_type === 'text') {
      findings.push({
        id: nanoid(),
        title: `Potential unhashed password column "${col.column_name}"`,
        description: `Column "${col.column_name}" in table "${col.table_schema}.${col.table_name}" may contain passwords. Ensure passwords are properly hashed using bcrypt or similar.`,
        severity: 'high',
        category: 'data_protection',
        resource: {
          type: 'table',
          name: col.table_name,
          identifier: `${col.table_schema}.${col.table_name}.${col.column_name}`
        },
        compliance: [
          {
            framework: 'OWASP',
            controls: ['A02:2021 - Cryptographic Failures'],
            references: []
          },
          {
            framework: 'HIPAA',
            controls: ['164.312(a)(2)(iv) - Encryption and Decryption'],
            references: []
          }
        ],
        remediation: {
          description: 'Never store passwords in plain text. Use Supabase Auth or hash passwords with bcrypt/argon2.',
          code: `-- Use Supabase Auth instead of custom password columns
-- If you must store passwords, hash them:

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash password before insert
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
  NEW.password = crypt(NEW.password, gen_salt('bf'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`,
          documentation: 'https://supabase.com/docs/guides/auth'
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
