import type { ScanResult, SecurityFinding } from './types'
import { checkWorkspaceSecurity } from './checks/workspace'
import { checkUserSecurity } from './checks/users'
import { checkInactiveUsers } from './checks/inactive-users'
import { checkAppPermissions } from './checks/app-permissions'
import { checkExternalSharing } from './checks/external-sharing'

/**
 * Main Slack Security Scanner
 *
 * Orchestrates all security checks and returns a comprehensive scan result
 */

export class SlackSecurityScanner {
  constructor(
    private accessToken: string,
    private teamId: string
  ) {}

  /**
   * Run full security scan on a Slack workspace
   */
  async scan(): Promise<ScanResult> {
    const findings: SecurityFinding[] = []

    try {
      // Fetch team info
      const teamInfo = await this.fetchTeamInfo()

      // Fetch users
      const users = await this.fetchUsers()

      // Run all checks in parallel
      const [
        workspaceFindings,
        userFindings,
        inactiveUserFindings,
        appPermissionFindings,
        externalSharingFindings
      ] = await Promise.all([
        checkWorkspaceSecurity(this.teamId, teamInfo.team.name, teamInfo.team),
        checkUserSecurity(this.teamId, teamInfo.team.name, users.members || []),
        checkInactiveUsers(this.teamId, teamInfo.team.name, users.members || []),
        checkAppPermissions(this.accessToken, this.teamId, teamInfo.team.name),
        checkExternalSharing(this.accessToken, this.teamId, teamInfo.team.name, teamInfo.team)
      ])

      findings.push(
        ...workspaceFindings,
        ...userFindings,
        ...inactiveUserFindings,
        ...appPermissionFindings,
        ...externalSharingFindings
      )

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
        teamId: this.teamId,
        teamName: teamInfo.team.name,
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

  private async fetchTeamInfo() {
    const response = await fetch('https://slack.com/api/team.info', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.error || 'Failed to fetch team info')
    }

    return data
  }

  private async fetchUsers() {
    const response = await fetch('https://slack.com/api/users.list', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.error || 'Failed to fetch users')
    }

    return data
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
