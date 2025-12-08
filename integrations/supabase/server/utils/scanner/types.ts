/**
 * Security Scanner Types
 */

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info'

export type ComplianceFramework =
  | 'GDPR'
  | 'SOC2'
  | 'ISO27001'
  | 'HIPAA'
  | 'OWASP'
  | 'CIS'

export interface SecurityFinding {
  id: string
  title: string
  description: string
  severity: SeverityLevel
  category: SecurityCategory
  resource: {
    type: 'project' | 'table' | 'policy' | 'function' | 'extension' | 'config'
    name: string
    identifier: string
  }
  compliance: {
    framework: ComplianceFramework
    controls: string[]
    references: string[]
  }[]
  remediation: {
    description: string
    code?: string
    documentation?: string
  }
  metadata: {
    projectId: string
    projectName: string
    scannedAt: string
  }
}

export type SecurityCategory =
  | 'access_control'      // RLS, policies, permissions
  | 'authentication'      // Auth config, JWT, MFA
  | 'data_protection'     // Encryption, PII handling
  | 'api_security'        // API keys, CORS, rate limiting
  | 'configuration'       // Database config, extensions
  | 'audit_logging'       // Logging, monitoring
  | 'network_security'    // SSL, IP restrictions

export interface ScanResult {
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
  compliance: {
    framework: ComplianceFramework
    passed: number
    failed: number
    total: number
    score: number // 0-100
  }[]
}

export interface SupabaseProject {
  id: string
  name: string
  organization_id: string
  region: string
  created_at: string
  status: string
  database: {
    host: string
    version: string
  }
}

export interface SupabaseTable {
  id: number
  schema: string
  name: string
  rls_enabled: boolean
  rls_forced: boolean
  replica_identity: string
  bytes: number
  size: string
  live_rows_estimate: number
  dead_rows_estimate: number
}

export interface SupabasePolicy {
  id: number
  schema: string
  table: string
  name: string
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL'
  roles: string[]
  command: string
  permissive: boolean
  definition: string
  check: string | null
}
