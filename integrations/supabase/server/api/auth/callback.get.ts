/**
 * OAuth Callback Endpoint
 *
 * Step 2: Exchange authorization code for access token
 *
 * Flow:
 * 1. Supabase redirects here with authorization code
 * 2. Verify state matches (CSRF protection)
 * 3. Exchange code + code_verifier for access_token
 * 4. Save integration to database with encrypted credentials
 * 5. Redirect to dashboard
 */

import { getSupabaseAdmin } from '~/server/utils/supabase-client'
import { encryptConfig } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  console.log('🔵 OAuth callback received')

  const config = useRuntimeConfig()
  const query = getQuery(event)

  console.log('Query params:', { hasCode: !!query.code, hasState: !!query.state })

  // Get authorization code and state from query params
  const code = query.code as string
  const state = query.state as string

  if (!code) {
    console.error('❌ Missing authorization code')
    throw createError({
      statusCode: 400,
      message: 'Missing authorization code'
    })
  }

  // Verify state matches (prevent CSRF attacks)
  const storedState = getCookie(event, 'oauth_state')
  if (state !== storedState) {
    throw createError({
      statusCode: 400,
      message: 'Invalid state parameter'
    })
  }

  // Get code_verifier from cookie
  const codeVerifier = getCookie(event, 'oauth_code_verifier')
  if (!codeVerifier) {
    throw createError({
      statusCode: 400,
      message: 'Missing code verifier'
    })
  }

  // Exchange authorization code for access token
  const tokenUrl = `${config.public.supabaseOAuthUrl}/token`

  // Create Basic Auth header (client_id:client_secret)
  const basicAuth = Buffer.from(
    `${config.supabaseClientId}:${config.supabaseClientSecret}`
  ).toString('base64')

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${config.public.appUrl}/api/auth/callback`,
      code_verifier: codeVerifier
    })
  })

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text()
    console.error('Token exchange failed:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to exchange authorization code'
    })
  }

  const tokens = await tokenResponse.json()

  // tokens contains:
  // - access_token: Use this to call Supabase Management API
  // - refresh_token: Use this to get new access tokens
  // - expires_in: When access token expires (usually 3600 = 1 hour)
  // - token_type: "Bearer"

  // Fetch user's projects to get project details for naming
  let projectName = 'Supabase Project'
  let projectId = ''

  try {
    const projectsResponse = await fetch('https://api.supabase.com/v1/projects', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    if (projectsResponse.ok) {
      const projects = await projectsResponse.json()
      if (projects && projects.length > 0) {
        // Use first project for now (in production, let user choose)
        projectName = projects[0].name
        projectId = projects[0].id
      }
    }
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  }

  // Prepare integration config with credentials
  const integrationConfig = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    project_id: projectId,
    project_name: projectName,
    expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    token_type: tokens.token_type
  }

  // Encrypt sensitive fields
  const encryptedConfig = encryptConfig(integrationConfig)

  // Save integration to database
  // TODO: Get actual organization_id from user session
  // For now, use a valid UUID placeholder - you'll need to implement user auth first
  const organizationId = getCookie(event, 'organization_id') || '00000000-0000-0000-0000-000000000000'

  try {
    console.log('💾 Saving integration to database...')
    console.log('Organization ID:', organizationId)
    console.log('Project name:', projectName)

    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('integrations')
      .insert({
        organization_id: organizationId,
        integration_type: 'supabase',
        name: projectName,
        config: encryptedConfig,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Failed to save integration:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to save integration to database'
      })
    }

    console.log('✅ Integration saved successfully! ID:', data.id)

    // Store integration ID in cookie for convenience
    setCookie(event, 'supabase_integration_id', data.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
  } catch (err) {
    console.error('Database error:', err)
    // Continue even if DB save fails (for testing)
  }

  // Also store in cookies for backward compatibility with manual scanner
  setCookie(event, 'supabase_access_token', tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokens.expires_in
  })

  // Clean up temporary OAuth cookies
  deleteCookie(event, 'oauth_code_verifier')
  deleteCookie(event, 'oauth_state')

  // Redirect to dashboard
  return sendRedirect(event, '/dashboard?integration=success')
})
