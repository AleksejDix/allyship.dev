import type { SecurityFinding } from '../types'
import { nanoid } from 'nanoid'

/**
 * Authentication & Authorization Checks
 *
 * Scans for:
 * - Weak password policies
 * - MFA not enforced
 * - Anonymous sign-in enabled
 * - Weak JWT expiry
 */

export async function checkAuth(
  projectId: string,
  projectName: string,
  authConfig: any
): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = []

  // Check if anonymous sign-in is enabled
  if (authConfig?.DISABLE_SIGNUP === false) {
    findings.push({
      id: nanoid(),
      title: 'Public sign-up is enabled',
      description: 'Anyone can create an account on this project. Consider restricting sign-ups to invited users only, or implement additional verification steps.',
      severity: 'medium',
      category: 'authentication',
      resource: {
        type: 'config',
        name: 'Auth Configuration',
        identifier: 'auth.signup'
      },
      compliance: [
        {
          framework: 'OWASP',
          controls: ['A07:2021 - Identification and Authentication Failures'],
          references: ['https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/']
        },
        {
          framework: 'SOC2',
          controls: ['CC6.1 - Logical and Physical Access Controls'],
          references: []
        }
      ],
      remediation: {
        description: 'Disable public sign-ups and use invite-only registration, or add email verification and CAPTCHA.',
        documentation: 'https://supabase.com/docs/guides/auth/auth-signup'
      },
      metadata: {
        projectId,
        projectName,
        scannedAt: new Date().toISOString()
      }
    })
  }

  // Check password minimum length
  if (authConfig?.PASSWORD_MIN_LENGTH && authConfig.PASSWORD_MIN_LENGTH < 8) {
    findings.push({
      id: nanoid(),
      title: 'Weak password policy',
      description: `Minimum password length is set to ${authConfig.PASSWORD_MIN_LENGTH} characters. NIST recommends at least 8 characters.`,
      severity: 'high',
      category: 'authentication',
      resource: {
        type: 'config',
        name: 'Password Policy',
        identifier: 'auth.password_policy'
      },
      compliance: [
        {
          framework: 'OWASP',
          controls: ['A07:2021 - Identification and Authentication Failures'],
          references: []
        },
        {
          framework: 'HIPAA',
          controls: ['164.308(a)(5)(ii)(D) - Password Management'],
          references: []
        }
      ],
      remediation: {
        description: 'Set minimum password length to at least 8 characters, preferably 12+.',
        documentation: 'https://supabase.com/docs/guides/auth/auth-password'
      },
      metadata: {
        projectId,
        projectName,
        scannedAt: new Date().toISOString()
      }
    })
  }

  // Check JWT expiry (should be reasonably short)
  if (authConfig?.JWT_EXP && authConfig.JWT_EXP > 3600) {
    const hours = Math.floor(authConfig.JWT_EXP / 3600)
    findings.push({
      id: nanoid(),
      title: 'Long JWT expiration time',
      description: `JWT tokens expire after ${hours} hours. Shorter expiration times reduce the risk of token theft.`,
      severity: 'low',
      category: 'authentication',
      resource: {
        type: 'config',
        name: 'JWT Configuration',
        identifier: 'auth.jwt_expiry'
      },
      compliance: [
        {
          framework: 'OWASP',
          controls: ['A07:2021 - Identification and Authentication Failures'],
          references: []
        }
      ],
      remediation: {
        description: 'Consider reducing JWT expiration to 1 hour or less, and implement refresh token rotation.',
        documentation: 'https://supabase.com/docs/guides/auth/sessions'
      },
      metadata: {
        projectId,
        projectName,
        scannedAt: new Date().toISOString()
      }
    })
  }

  // Check if MFA is available but not enforced
  if (authConfig?.MFA_ENABLED === false) {
    findings.push({
      id: nanoid(),
      title: 'Multi-factor authentication not enabled',
      description: 'MFA provides an additional layer of security against compromised passwords. Consider enabling and encouraging MFA for users.',
      severity: 'medium',
      category: 'authentication',
      resource: {
        type: 'config',
        name: 'MFA Configuration',
        identifier: 'auth.mfa'
      },
      compliance: [
        {
          framework: 'SOC2',
          controls: ['CC6.1 - Logical and Physical Access Controls'],
          references: []
        },
        {
          framework: 'HIPAA',
          controls: ['164.312(a)(2)(i) - User Authentication'],
          references: []
        }
      ],
      remediation: {
        description: 'Enable MFA for your application and encourage or require users to set it up.',
        documentation: 'https://supabase.com/docs/guides/auth/auth-mfa'
      },
      metadata: {
        projectId,
        projectName,
        scannedAt: new Date().toISOString()
      }
    })
  }

  return findings
}
