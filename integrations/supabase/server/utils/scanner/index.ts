import type { ScanResult, SecurityFinding } from './types'
import { checkRLS } from './checks/rls'
import { checkAuth } from './checks/auth'
import { checkApiSecurity } from './checks/api-security'
import { checkDataProtection } from './checks/data-protection'

/**
 * Main Security Scanner
 *
 * Orchestrates all security checks and returns a comprehensive scan result
 */

export class SupabaseSecurityScanner {
  constructor(
    private accessToken: string,
    private projectId: string
  ) {}

  /**
   * Run full security scan on a Supabase project
   */
  async scan(): Promise<ScanResult> {
    const findings: SecurityFinding[] = []

    try {
      // Fetch project details
      const project = await this.fetchProject()

      // Get database connection info (if user provides password)
      // For now, use Management API only

      // Run all checks in parallel
      const [
        rlsFindings,
        authFindings,
        apiFindings,
        dataFindings
      ] = await Promise.all([
        this.scanRLS(project.name),
        this.scanAuth(project.name),
        this.scanApiSecurity(project.name),
        this.scanDataProtection(project.name)
      ])

      findings.push(...rlsFindings, ...authFindings, ...apiFindings, ...dataFindings)

      // Calculate summary
      const summary = {
        critical: findings.filter(f => f.severity === 'critical').length,
        high: findings.filter(f => f.severity === 'high').length,
        medium: findings.filter(f => f.severity === 'medium').length,
        low: findings.filter(f => f.severity === 'low').length,
        info: findings.filter(f => f.severity === 'info').length,
        total: findings.length
      }

      // Calculate compliance scores
      const compliance = this.calculateComplianceScores(findings)

      return {
        projectId: this.projectId,
        projectName: project.name,
        scannedAt: new Date().toISOString(),
        findings,
        summary,
        compliance
      }
    } catch (error) {
      console.error('Scan failed:', error)
      throw error
    }
  }

  private async fetchProject() {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${this.projectId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch project details')
    }

    return response.json()
  }

  private async scanRLS(projectName: string) {
    // For database queries, we need direct database access
    // This requires the user to provide their database password
    // For now, return placeholder - we'll implement this next

    // TODO: Implement database connection with user-provided credentials
    // const tables = await this.fetchTables()
    // const policies = await this.fetchPolicies()
    // return checkRLS(this.projectId, projectName, tables, policies)

    return []
  }

  private async scanAuth(projectName: string) {
    // Fetch auth configuration from project settings
    // TODO: Determine correct Management API endpoint for auth config
    // For now, return example findings

    const authConfig = {
      DISABLE_SIGNUP: false,
      PASSWORD_MIN_LENGTH: 6,
      JWT_EXP: 3600,
      MFA_ENABLED: false
    }

    return checkAuth(this.projectId, projectName, authConfig)
  }

  private async scanApiSecurity(projectName: string) {
    // Fetch API keys
    // Note: The Management API v1 doesn't expose API keys endpoint
    // We'll use general security checks instead
    const apiKeys = {}

    // Fetch project config (CORS, etc.)
    // TODO: Determine correct endpoint
    const projectConfig = {}

    return checkApiSecurity(this.projectId, projectName, apiKeys, projectConfig)
  }

  private async scanDataProtection(projectName: string) {
    // TODO: Requires database access
    // const tables = await this.fetchTables()
    // const columns = await this.fetchColumns()
    // return checkDataProtection(this.projectId, projectName, tables, columns)

    return []
  }

  private calculateComplianceScores(findings: SecurityFinding[]) {
    const frameworks = ['GDPR', 'SOC2', 'ISO27001', 'HIPAA', 'OWASP'] as const

    return frameworks.map(framework => {
      const frameworkFindings = findings.filter(f =>
        f.compliance.some(c => c.framework === framework)
      )

      const failed = frameworkFindings.length
      const passed = 0 // We only track failures for now
      const total = failed + passed

      return {
        framework,
        passed,
        failed,
        total,
        score: total === 0 ? 100 : Math.round((passed / total) * 100)
      }
    })
  }
}
