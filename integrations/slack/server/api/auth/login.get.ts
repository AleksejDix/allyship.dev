/**
 * Slack OAuth Login Endpoint
 *
 * Redirects user to Slack OAuth authorization page
 *
 * GET /api/auth/login
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  const clientId = config.slackClientId
  const redirectUri = `${config.public.appUrl}/api/auth/callback`

  console.log('OAuth Login Debug:', {
    clientId,
    redirectUri,
    appUrl: config.public.appUrl
  })

  // User scopes for security scanning (NOT bot scopes!)
  const userScopes = [
    'channels:read',
    'groups:read',
    'users:read',
    'users:read.email',
    'team:read',
    'team.preferences:read'  // For external sharing settings
  ].join(',')

  // Generate state for CSRF protection
  const state = Math.random().toString(36).substring(7)

  // Store state in cookie
  setCookie(event, 'slack_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600 // 10 minutes
  })

  // Build Slack OAuth URL
  const authUrl = new URL('https://slack.com/oauth/v2/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('user_scope', userScopes) // Use user_scope, not scope!
  authUrl.searchParams.set('state', state)

  // Redirect to Slack
  return sendRedirect(event, authUrl.toString())
})
