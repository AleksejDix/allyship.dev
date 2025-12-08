import type { SecurityFinding } from '../types'
import { nanoid } from 'nanoid'

/**
 * User Security Checks
 *
 * Checks for user-level security issues
 */

export async function checkUserSecurity(
  teamId: string,
  teamName: string,
  users: any[]
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  // Count users without 2FA
  const usersWithout2FA = users.filter(u => !u.deleted && !u.is_bot && !u.has_2fa)

  if (usersWithout2FA.length > 0) {
    findings.push({
      id: nanoid(),
      title: `${usersWithout2FA.length} Users Without 2FA`,
      description: `Found ${usersWithout2FA.length} active users who have not enabled two-factor authentication.`,
      severity: usersWithout2FA.length > 5 ? 'high' : 'medium',
      category: 'authentication',
      resourceType: 'workspace',
      resourceId: teamId,
      resourceName: teamName,
      remediation: 'Encourage or require users to enable 2FA in their account settings',
      compliance: [
        {
          framework: 'SOC2',
          control: 'CC6.1',
          requirement: 'Logical and physical access controls'
        },
        {
          framework: 'GDPR',
          control: 'Article 32',
          requirement: 'Security of processing'
        }
      ]
    })
  }

  // Check for guest users
  const guestUsers = users.filter(u => !u.deleted && u.is_restricted)

  if (guestUsers.length > 0) {
    findings.push({
      id: nanoid(),
      title: `${guestUsers.length} Guest Users Found`,
      description: `Found ${guestUsers.length} guest users in workspace. Ensure they have appropriate access restrictions.`,
      severity: 'info',
      category: 'access_control',
      resourceType: 'workspace',
      resourceId: teamId,
      resourceName: teamName,
      remediation: 'Review guest user access and ensure they only have access to necessary channels',
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
