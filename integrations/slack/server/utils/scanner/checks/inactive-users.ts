import type { SecurityFinding } from '../types'
import { nanoid } from 'nanoid'

/**
 * Inactive Users Security Checks
 *
 * Checks for inactive or stale user accounts
 */

export async function checkInactiveUsers(
  teamId: string,
  teamName: string,
  users: any[]
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  // Filter out deleted users and bots
  const activeUsers = users.filter(u => !u.deleted && !u.is_bot)

  // Check for users who haven't updated their profile recently (stale accounts)
  const now = Date.now() / 1000 // Convert to Unix timestamp
  const sixMonthsAgo = now - (6 * 30 * 24 * 60 * 60) // 6 months in seconds
  const oneYearAgo = now - (365 * 24 * 60 * 60) // 1 year in seconds

  const inactiveUsers = activeUsers.filter(u => {
    const lastUpdated = u.updated || u.profile?.updated || 0
    return lastUpdated < oneYearAgo && lastUpdated > 0
  })

  if (inactiveUsers.length > 0) {
    findings.push({
      id: nanoid(),
      title: `${inactiveUsers.length} Inactive User Accounts`,
      description: `Found ${inactiveUsers.length} user accounts that haven't been updated in over a year. Inactive accounts pose a security risk and should be deactivated.`,
      severity: inactiveUsers.length > 10 ? 'high' : 'medium',
      category: 'access_control',
      resourceType: 'workspace',
      resourceId: teamId,
      resourceName: teamName,
      remediation: 'Review inactive users and deactivate accounts that are no longer needed. Go to Workspace Settings > Members and deactivate unused accounts.',
      compliance: [
        {
          framework: 'SOC2',
          control: 'CC6.3',
          requirement: 'User access reviews'
        },
        {
          framework: 'ISO27001',
          control: 'A.9.2.5',
          requirement: 'Review of user access rights'
        },
        {
          framework: 'GDPR',
          control: 'Article 5',
          requirement: 'Data minimization'
        }
      ]
    })
  }

  // Check for deactivated users that still exist
  const deactivatedUsers = users.filter(u => u.deleted && !u.is_bot)

  if (deactivatedUsers.length > 20) {
    findings.push({
      id: nanoid(),
      title: `${deactivatedUsers.length} Deactivated User Accounts`,
      description: `Workspace has ${deactivatedUsers.length} deactivated user accounts. Consider removing these accounts to reduce clutter and potential security risks.`,
      severity: 'low',
      category: 'access_control',
      resourceType: 'workspace',
      resourceId: teamId,
      resourceName: teamName,
      remediation: 'Clean up deactivated user accounts periodically to maintain good workspace hygiene.',
      compliance: [
        {
          framework: 'SOC2',
          control: 'CC6.3',
          requirement: 'User access reviews'
        }
      ]
    })
  }

  // Check for users without profile photos (potential fake/incomplete accounts)
  const usersWithoutPhotos = activeUsers.filter(u => {
    return !u.profile?.image_72 || u.profile?.image_72.includes('gravatar')
  })

  if (usersWithoutPhotos.length > 5) {
    findings.push({
      id: nanoid(),
      title: `${usersWithoutPhotos.length} Users Without Profile Photos`,
      description: `Found ${usersWithoutPhotos.length} active users without profile photos. This could indicate incomplete account setup or potential security risks.`,
      severity: 'info',
      category: 'compliance',
      resourceType: 'workspace',
      resourceId: teamId,
      resourceName: teamName,
      remediation: 'Encourage users to complete their profiles with photos for better identification and security.',
      compliance: [
        {
          framework: 'SOC2',
          control: 'CC6.1',
          requirement: 'User identification and authentication'
        }
      ]
    })
  }

  return findings
}
