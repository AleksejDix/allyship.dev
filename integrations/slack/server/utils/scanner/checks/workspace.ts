import type { SecurityFinding } from '../types'
import { nanoid } from 'nanoid'

/**
 * Workspace Security Checks
 *
 * Checks workspace-level security settings
 */

export async function checkWorkspaceSecurity(
  teamId: string,
  teamName: string,
  teamInfo: any
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  // Check if 2FA is enforced
  if (!teamInfo.two_factor_auth_required) {
    findings.push({
      id: nanoid(),
      title: '2FA Not Enforced',
      description: 'Two-factor authentication is not required for all workspace members. This increases the risk of account compromise.',
      severity: 'high',
      category: 'authentication',
      resourceType: 'workspace',
      resourceId: teamId,
      resourceName: teamName,
      remediation: 'Go to Workspace Settings > Authentication > Require 2FA for all members',
      compliance: [
        {
          framework: 'SOC2',
          control: 'CC6.1',
          requirement: 'Logical and physical access controls'
        },
        {
          framework: 'ISO27001',
          control: 'A.9.4.2',
          requirement: 'Secure log-on procedures'
        }
      ]
    })
  }

  // Check if email domain restrictions are in place
  if (!teamInfo.email_domain || teamInfo.email_domain === '') {
    findings.push({
      id: nanoid(),
      title: 'No Email Domain Restrictions',
      description: 'Workspace does not restrict sign-ups to specific email domains. Anyone with an invite link can join.',
      severity: 'medium',
      category: 'access_control',
      resourceType: 'workspace',
      resourceId: teamId,
      resourceName: teamName,
      remediation: 'Go to Workspace Settings > Permissions > Restrict to email domains',
      compliance: [
        {
          framework: 'SOC2',
          control: 'CC6.2',
          requirement: 'Authorization mechanisms'
        }
      ]
    })
  }

  return findings
}
