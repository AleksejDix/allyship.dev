import { createHash, randomBytes } from 'crypto'

/**
 * OAuth Login Endpoint
 *
 * Step 1: Generate PKCE challenge and redirect user to Supabase OAuth
 *
 * Flow:
 * 1. User clicks "Connect Supabase"
 * 2. We generate a random code_verifier (for PKCE security)
 * 3. Hash it to create code_challenge
 * 4. Store verifier in session/cookie
 * 5. Redirect to Supabase with challenge
 * 6. User authorizes
 * 7. Supabase redirects back to /api/auth/callback with authorization code
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Generate PKCE code verifier (random string)
  const codeVerifier = randomBytes(32).toString('base64url')

  // Create code challenge (SHA256 hash of verifier)
  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64url')

  // Generate random state for CSRF protection
  const state = randomBytes(16).toString('hex')

  // Store code_verifier and state in cookie (need them for callback)
  setCookie(event, 'oauth_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600 // 10 minutes
  })

  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600
  })

  // Build Supabase OAuth authorization URL
  const authUrl = new URL(`${config.public.supabaseOAuthUrl}/authorize`)
  authUrl.searchParams.set('client_id', config.supabaseClientId!)
  authUrl.searchParams.set('redirect_uri', `${config.public.appUrl}/api/auth/callback`)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('code_challenge', codeChallenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')

  // Optional: Request specific scopes (once Supabase supports fine-grained permissions)
  // authUrl.searchParams.set('scope', 'read:projects read:api_keys')

  // Redirect user to Supabase authorization page
  return sendRedirect(event, authUrl.toString())
})
