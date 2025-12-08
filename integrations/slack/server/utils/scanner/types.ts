/**
 * Security Scanner Types for Slack
 */

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export interface ComplianceMapping {
  framework: 'GDPR' | 'SOC2' | 'ISO27001' | 'HIPAA' | 'OWASP'
  control: string
  requirement: string
}

export interface SecurityFinding {
  id: string
  title: string
  description: string
  severity: Severity
  category: 'access_control' | 'authentication' | 'data_protection' | 'configuration' | 'compliance'
  resourceType: 'workspace' | 'channel' | 'user' | 'app' | 'settings'
  resourceId?: string
  resourceName?: string
  remediation: string
  compliance: ComplianceMapping[]
}

export interface ScanSummary {
  critical: number
  high: number
  medium: number
  low: number
  info: number
  total: number
}

export interface ComplianceScore {
  framework: string
  passed: number
  failed: number
  total: number
  score: number
}

export interface ScanResult {
  teamId: string
  teamName: string
  scannedAt: string
  findings: SecurityFinding[]
  summary: ScanSummary
  compliance: ComplianceScore[]
}
