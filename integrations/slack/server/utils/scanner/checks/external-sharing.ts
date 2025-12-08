import type { SecurityFinding } from '../types'
import { nanoid } from 'nanoid'

/**
 * External Sharing Security Checks
 *
 * Checks for external sharing and guest access settings
 */

export async function checkExternalSharing(
  accessToken: string,
  teamId: string,
  teamName: string,
  teamInfo: any
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  try {
    // Check if external sharing is enabled
    // Note: This info comes from team.info API call

    // Check for shared channels (Slack Connect)
    const conversationsResponse = await fetch('https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=1000', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const conversationsData = await conversationsResponse.json()

    if (conversationsData.ok) {
      const channels = conversationsData.channels || []

      // Check for externally shared channels
      const externalChannels = channels.filter((ch: any) => ch.is_ext_shared || ch.is_shared)

      if (externalChannels.length > 0) {
        findings.push({
          id: nanoid(),
          title: `${externalChannels.length} Externally Shared Channels`,
          description: `Found ${externalChannels.length} channels shared with external organizations via Slack Connect. Ensure these are properly reviewed and necessary.`,
          severity: 'medium',
          category: 'data_protection',
          resourceType: 'workspace',
          resourceId: teamId,
          resourceName: teamName,
          remediation: 'Review externally shared channels and ensure only necessary channels are shared. Monitor what data is shared with external parties.',
          compliance: [
            {
              framework: 'GDPR',
              control: 'Article 28',
              requirement: 'Processor obligations'
            },
            {
              framework: 'SOC2',
              control: 'CC6.7',
              requirement: 'Transmission of data'
            },
            {
              framework: 'ISO27001',
              control: 'A.13.2.1',
              requirement: 'Information transfer policies'
            }
          ]
        })
      }

      // Check for public channels with sensitive names
      const publicChannels = channels.filter((ch: any) => !ch.is_private)
      const sensitiveKeywords = ['secret', 'confidential', 'private', 'internal', 'password', 'api-key', 'credentials']

      const publicChannelsWithSensitiveNames = publicChannels.filter((ch: any) => {
        const name = ch.name?.toLowerCase() || ''
        return sensitiveKeywords.some(keyword => name.includes(keyword))
      })

      if (publicChannelsWithSensitiveNames.length > 0) {
        findings.push({
          id: nanoid(),
          title: `${publicChannelsWithSensitiveNames.length} Public Channels with Sensitive Names`,
          description: `Found ${publicChannelsWithSensitiveNames.length} public channels with names suggesting sensitive content (${publicChannelsWithSensitiveNames.map((ch: any) => '#' + ch.name).join(', ')}). These should likely be private.`,
          severity: 'high',
          category: 'data_protection',
          resourceType: 'workspace',
          resourceId: teamId,
          resourceName: teamName,
          remediation: 'Convert these channels to private or rename them to avoid exposing sensitive information.',
          compliance: [
            {
              framework: 'GDPR',
              control: 'Article 32',
              requirement: 'Security of processing'
            },
            {
              framework: 'SOC2',
              control: 'CC6.1',
              requirement: 'Logical and physical access controls'
            }
          ]
        })
      }

      // Check for overly large public channels
      const largePublicChannels = publicChannels.filter((ch: any) =>
        ch.num_members && ch.num_members > 100
      )

      if (largePublicChannels.length > 10) {
        findings.push({
          id: nanoid(),
          title: `${largePublicChannels.length} Large Public Channels`,
          description: `Found ${largePublicChannels.length} public channels with over 100 members. Consider if all these channels need to be public or if some should be restricted.`,
          severity: 'info',
          category: 'configuration',
          resourceType: 'workspace',
          resourceId: teamId,
          resourceName: teamName,
          remediation: 'Review large public channels and ensure they don\'t contain sensitive information that should be restricted.',
          compliance: [
            {
              framework: 'SOC2',
              control: 'CC6.1',
              requirement: 'Logical and physical access controls'
            }
          ]
        })
      }
    }

    // Check for file sharing settings
    const teamPrefsResponse = await fetch('https://slack.com/api/team.preferences.list', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const teamPrefsData = await teamPrefsResponse.json()

    if (teamPrefsData.ok && teamPrefsData.allow_message_deletion === false) {
      findings.push({
        id: nanoid(),
        title: 'Message Deletion Disabled',
        description: 'Users cannot delete their own messages. While this helps with compliance and audit trails, it may prevent users from removing accidentally shared sensitive information.',
        severity: 'info',
        category: 'configuration',
        resourceType: 'workspace',
        resourceId: teamId,
        resourceName: teamName,
        remediation: 'Consider if this policy is appropriate for your security requirements. Balance between audit trails and user privacy.',
        compliance: [
          {
            framework: 'SOC2',
            control: 'CC7.2',
            requirement: 'System monitoring'
          }
        ]
      })
    }

  } catch (error) {
    console.error('Error checking external sharing:', error)
  }

  return findings
}
