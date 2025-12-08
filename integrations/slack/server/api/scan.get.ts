import { SlackSecurityScanner } from '~/server/utils/scanner'
import { refreshSlackToken, isTokenExpired } from '~/server/utils/token-refresh'

/**
 * Scan Endpoint
 *
 * Runs security scan on the connected Slack workspace
 *
 * GET /api/scan
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Get tokens and team ID from cookies
  let accessToken = getCookie(event, 'slack_access_token')
  const refreshToken = getCookie(event, 'slack_refresh_token')
  const expiresAt = getCookie(event, 'slack_token_expires_at')
  const teamId = getCookie(event, 'slack_team_id')

  if (!accessToken || !teamId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated. Please connect your Slack workspace.'
    })
  }

  // Check if token is expired and refresh if needed
  if (expiresAt && isTokenExpired(expiresAt) && refreshToken) {
    console.log('Access token expired, refreshing...')

    const refreshResult = await refreshSlackToken(
      refreshToken,
      config.slackClientId,
      config.slackClientSecret
    )

    if (refreshResult.ok && refreshResult.access_token) {
      // Update access token
      accessToken = refreshResult.access_token

      // Update cookies with new tokens
      setCookie(event, 'slack_access_token', refreshResult.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: refreshResult.expires_in || 43200
      })

      if (refreshResult.refresh_token) {
        setCookie(event, 'slack_refresh_token', refreshResult.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 365
        })
      }

      if (refreshResult.expires_in) {
        const newExpiresAt = Date.now() + (refreshResult.expires_in * 1000)
        setCookie(event, 'slack_token_expires_at', newExpiresAt.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 365
        })
      }

      console.log('Token refreshed successfully')
    } else {
      throw createError({
        statusCode: 401,
        message: 'Session expired. Please reconnect your Slack workspace.'
      })
    }
  }

  try {
    console.log('Starting scan for team:', teamId)

    // Initialize scanner
    const scanner = new SlackSecurityScanner(accessToken, teamId)

    // Run scan
    const result = await scanner.scan()

    console.log('Scan completed successfully:', {
      teamName: result.teamName,
      findingsCount: result.findings.length
    })

    return result
  } catch (error) {
    console.error('Scan failed with error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Scan failed'
    })
  }
})
