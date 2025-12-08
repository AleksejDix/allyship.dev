/**
 * Slack Token Refresh Utility
 *
 * Handles automatic token refresh when access token expires
 */

interface RefreshTokenResponse {
  ok: boolean
  access_token?: string
  refresh_token?: string
  expires_in?: number
  error?: string
}

export async function refreshSlackToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<RefreshTokenResponse> {
  try {
    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    })

    const data = await response.json()

    if (!data.ok) {
      console.error('Token refresh failed:', data.error)
      return { ok: false, error: data.error }
    }

    return {
      ok: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in
    }
  } catch (error) {
    console.error('Token refresh error:', error)
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Check if access token is expired or about to expire
 */
export function isTokenExpired(expiresAt: string | number): boolean {
  const expirationTime = typeof expiresAt === 'string' ? parseInt(expiresAt) : expiresAt
  const now = Date.now()
  const bufferTime = 5 * 60 * 1000 // 5 minutes buffer

  return now >= (expirationTime - bufferTime)
}
