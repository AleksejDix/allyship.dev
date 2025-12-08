import type { SecurityFinding } from '../types'
import { nanoid } from 'nanoid'

/**
 * App Permissions Security Checks
 *
 * Checks for apps with excessive or risky permissions
 */

export async function checkAppPermissions(
  accessToken: string,
  teamId: string,
  teamName: string
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  try {
    // Fetch installed apps (requires admin.apps:read scope)
    const appsResponse = await fetch('https://slack.com/api/apps.permissions.scopes.list', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const appsData = await appsResponse.json()

    // If we don't have permission, skip this check
    if (!appsData.ok) {
      console.log('Cannot check app permissions:', appsData.error)
      return findings
    }

    const apps = appsData.scopes || []

    // Check for apps with sensitive permissions
    const sensitiveScopes = [
      'files:read',
      'files:write',
      'channels:history',
      'groups:history',
      'im:history',
      'mpim:history',
      'users:read.email',
      'admin'
    ]

    const appsWithSensitiveScopes = apps.filter((app: any) => {
      const appScopes = [...(app.scopes?.user || []), ...(app.scopes?.bot || [])]
      return appScopes.some((scope: string) =>
        sensitiveScopes.some(sensitive => scope.includes(sensitive))
      )
    })

    if (appsWithSensitiveScopes.length > 0) {
      findings.push({
        id: nanoid(),
        title: `${appsWithSensitiveScopes.length} Apps with Sensitive Permissions`,
        description: `Found ${appsWithSensitiveScopes.length} apps with access to sensitive data (files, message history, emails, admin). Review these apps to ensure they're necessary and trustworthy.`,
        severity: appsWithSensitiveScopes.length > 5 ? 'high' : 'medium',
        category: 'access_control',
        resourceType: 'workspace',
        resourceId: teamId,
        resourceName: teamName,
        remediation: 'Go to Workspace Settings > Apps > Manage and review apps with sensitive permissions. Remove apps that are no longer needed.',
        compliance: [
          {
            framework: 'SOC2',
            control: 'CC6.6',
            requirement: 'Logical access security measures'
          },
          {
            framework: 'GDPR',
            control: 'Article 32',
            requirement: 'Security of processing'
          },
          {
            framework: 'ISO27001',
            control: 'A.9.4.1',
            requirement: 'Information access restriction'
          }
        ]
      })
    }

    // Check total number of installed apps
    if (apps.length > 50) {
      findings.push({
        id: nanoid(),
        title: `${apps.length} Apps Installed`,
        description: `Workspace has ${apps.length} apps installed. Large numbers of apps increase the attack surface and make security management difficult.`,
        severity: 'low',
        category: 'configuration',
        resourceType: 'workspace',
        resourceId: teamId,
        resourceName: teamName,
        remediation: 'Review and remove unused or unnecessary apps to reduce security risks.',
        compliance: [
          {
            framework: 'SOC2',
            control: 'CC6.6',
            requirement: 'Logical access security measures'
          }
        ]
      })
    }

  } catch (error) {
    console.error('Error checking app permissions:', error)
  }

  return findings
}
