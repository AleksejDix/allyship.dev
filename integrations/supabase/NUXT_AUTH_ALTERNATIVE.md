# Alternative: Using nuxt-auth-utils (NOT RECOMMENDED)

This shows how you *could* use `nuxt-auth-utils` for the Supabase OAuth integration, but it's **not recommended** because:

1. It's designed for user authentication, not OAuth integrations
2. Adds extra dependency for something we already implemented
3. Requires custom provider implementation anyway
4. Our current manual implementation is cleaner and more maintainable

## Installation

```bash
yarn add nuxt-auth-utils
```

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-auth-utils'],

  runtimeConfig: {
    oauth: {
      supabase: {
        clientId: process.env.SUPABASE_CLIENT_ID,
        clientSecret: process.env.SUPABASE_CLIENT_SECRET,
        redirectURL: process.env.APP_URL + '/api/auth/supabase'
      }
    }
  }
})
```

## Custom Supabase Provider

You'd need to create a custom provider since Supabase OAuth isn't built-in:

```typescript
// server/utils/oauth-supabase.ts
import { eventHandler, getQuery, sendRedirect } from 'h3'
import { withQuery } from 'ufo'
import { defu } from 'defu'
import { createHash, randomBytes } from 'crypto'

export interface OAuthSupabaseConfig {
  clientId?: string
  clientSecret?: string
  redirectURL?: string
}

export function defineOAuthSupabaseEventHandler({
  config,
  onSuccess,
  onError
}: {
  config?: OAuthSupabaseConfig
  onSuccess: (event: any, result: { user: any; tokens: any }) => Promise<void>
  onError?: (event: any, error: Error) => Promise<void>
}) {
  return eventHandler(async (event) => {
    const query = getQuery(event)
    const runtimeConfig = useRuntimeConfig()

    const mergedConfig = defu(
      config,
      runtimeConfig.oauth?.supabase
    ) as OAuthSupabaseConfig

    if (!mergedConfig.clientId || !mergedConfig.clientSecret) {
      throw new Error('Missing Supabase OAuth configuration')
    }

    // PKCE Setup
    const codeVerifier = getCookie(event, 'supabase_code_verifier')
    const state = getCookie(event, 'supabase_state')

    // Step 1: Redirect to authorization
    if (!query.code) {
      // Generate PKCE
      const newCodeVerifier = randomBytes(32).toString('base64url')
      const codeChallenge = createHash('sha256')
        .update(newCodeVerifier)
        .digest('base64url')
      const newState = randomBytes(16).toString('hex')

      // Store in cookies
      setCookie(event, 'supabase_code_verifier', newCodeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 600
      })
      setCookie(event, 'supabase_state', newState, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 600
      })

      // Redirect to Supabase
      const authUrl = withQuery('https://api.supabase.com/v1/oauth/authorize', {
        client_id: mergedConfig.clientId,
        redirect_uri: mergedConfig.redirectURL,
        response_type: 'code',
        state: newState,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      })

      return sendRedirect(event, authUrl)
    }

    // Step 2: Handle callback
    try {
      // Verify state
      if (query.state !== state) {
        throw new Error('Invalid state parameter')
      }

      if (!codeVerifier) {
        throw new Error('Missing code verifier')
      }

      // Exchange code for token
      const basicAuth = Buffer.from(
        `${mergedConfig.clientId}:${mergedConfig.clientSecret}`
      ).toString('base64')

      const tokenResponse = await $fetch('https://api.supabase.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: query.code as string,
          redirect_uri: mergedConfig.redirectURL!,
          code_verifier: codeVerifier
        })
      })

      // Fetch user info (from Management API)
      const projects = await $fetch('https://api.supabase.com/v1/projects', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`
        }
      })

      // Clean up cookies
      deleteCookie(event, 'supabase_code_verifier')
      deleteCookie(event, 'supabase_state')

      // Call success handler
      await onSuccess(event, {
        user: { projects }, // Simplified - you'd extract org info
        tokens: tokenResponse
      })
    } catch (error) {
      if (onError) {
        await onError(event, error as Error)
      } else {
        throw error
      }
    }
  })
}
```

## Usage

```typescript
// server/api/auth/supabase.get.ts
export default defineOAuthSupabaseEventHandler({
  async onSuccess(event, { user, tokens }) {
    // Store tokens
    setCookie(event, 'supabase_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expires_in
    })

    setCookie(event, 'supabase_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30
    })

    return sendRedirect(event, '/dashboard')
  },

  onError(event, error) {
    console.error('Supabase OAuth error:', error)
    return sendRedirect(event, '/?error=auth_failed')
  }
})
```

## Frontend

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <a href="/api/auth/supabase">Connect Supabase</a>
  </div>
</template>
```

## Why This Approach is Worse

1. **More Code**: Custom provider implementation is ~100 lines
2. **Our Manual Approach**: ~80 lines total (login + callback)
3. **Extra Dependency**: Adds nuxt-auth-utils package
4. **Same Logic**: We still write PKCE, state, token exchange manually
5. **Not Maintained**: Custom provider won't get updates from nuxt-auth-utils

## Comparison

### Manual OAuth (Current - RECOMMENDED)
```
✅ Simple, direct implementation
✅ Full control over flow
✅ No extra dependencies
✅ Easy to debug
✅ Exactly what we need
```

### nuxt-auth-utils
```
❌ Need custom provider anyway
❌ Extra dependency
❌ Same amount of code
❌ Designed for user auth, not integrations
⚠️ Might help if we add more OAuth integrations later
```

## Verdict

**Stick with our manual implementation.** It's cleaner, simpler, and more appropriate for building OAuth integrations.

If we were building **multiple OAuth integrations** (Vercel, Netlify, AWS, etc.), then nuxt-auth-utils might make sense for code reuse. But for a single integration, manual is better.
