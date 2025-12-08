/**
 * Slack OAuth Callback Endpoint
 *
 * Handles the OAuth callback from Slack and exchanges code for access token
 *
 * GET /api/auth/callback?code=...&state=...
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const code = query.code as string
  const state = query.state as string

  // Verify state (CSRF protection)
  const storedState = getCookie(event, 'slack_oauth_state')

  if (!state || state !== storedState) {
    throw createError({
      statusCode: 400,
      message: 'Invalid state parameter'
    })
  }

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'No authorization code provided'
    })
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: config.slackClientId,
        client_secret: config.slackClientSecret,
        code,
        redirect_uri: `${config.public.appUrl}/api/auth/callback`
      })
    })

    const data = await tokenResponse.json()

    if (!data.ok) {
      throw new Error(data.error || 'Token exchange failed')
    }

    console.log('OAuth token response:', {
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      expiresIn: data.expires_in,
      teamId: data.team?.id,
      tokenType: data.token_type,
      scope: data.scope,
      authedUser: data.authed_user
    })

    // Slack OAuth v2 returns authed_user.access_token for user tokens
    const userAccessToken = data.authed_user?.access_token || data.access_token

    console.log('Using access token:', {
      hasUserToken: !!data.authed_user?.access_token,
      hasRootToken: !!data.access_token,
      usingToken: userAccessToken ? 'user' : 'root'
    })

    // Store access token in cookie
    setCookie(event, 'slack_access_token', userAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: data.expires_in || 43200 // Use Slack's expiry or default to 12 hours
    })

    // Store refresh token if provided (for rotating tokens)
    const refreshToken = data.authed_user?.refresh_token || data.refresh_token
    if (refreshToken) {
      setCookie(event, 'slack_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365 // 1 year
      })
    }

    // Store token expiration time
    const expiresIn = data.authed_user?.expires_in || data.expires_in
    if (expiresIn) {
      const expiresAt = Date.now() + (expiresIn * 1000)
      setCookie(event, 'slack_token_expires_at', expiresAt.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365
      })
    }

    // Store team info
    setCookie(event, 'slack_team_id', data.team.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365
    })

    // Store team name for display
    if (data.team.name) {
      setCookie(event, 'slack_team_name', data.team.name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365
      })
    }

    // Clean up state cookie
    deleteCookie(event, 'slack_oauth_state')

    // Redirect to dashboard
    return sendRedirect(event, '/dashboard')
  } catch (error) {
    console.error('OAuth callback error:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Authentication failed'
    })
  }
})
