/**
 * Token refresh utilities for OAuth integrations
 *
 * Handles automatic refresh of expired access tokens using refresh tokens
 */

import { getSupabaseAdmin } from './supabase-client'
import { encryptConfig, decryptConfig } from './encryption'

interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

/**
 * Refresh an expired access token for a Supabase integration
 *
 * @param integrationId - The integration ID to refresh
 * @returns Updated integration with new tokens, or null if refresh failed
 */
export async function refreshSupabaseToken(integrationId: string) {
  const supabase = getSupabaseAdmin()

  // Get the integration
  const { data: integration, error: fetchError } = await supabase
    .from('integrations')
    .select('*')
    .eq('id', integrationId)
    .eq('integration_type', 'supabase')
    .single()

  if (fetchError || !integration) {
    console.error('Failed to fetch integration:', fetchError)
    return null
  }

  // Decrypt the config to get refresh token
  const decryptedConfig = decryptConfig(integration.config)

  if (!decryptedConfig.refresh_token) {
    console.error('No refresh token found for integration:', integrationId)
    return null
  }

  try {
    console.log('🔄 Refreshing access token for integration:', integrationId)

    const config = useRuntimeConfig()
    const tokenUrl = `${config.public.supabaseOAuthUrl}/token`

    // Create Basic Auth header (client_id:client_secret)
    const basicAuth = Buffer.from(
      `${config.supabaseClientId}:${config.supabaseClientSecret}`
    ).toString('base64')

    // Exchange refresh token for new access token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: decryptedConfig.refresh_token
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Token refresh failed:', error)

      // Mark integration as error state
      await supabase
        .from('integrations')
        .update({
          status: 'error',
          error_message: 'Failed to refresh access token. Re-authorization required.'
        })
        .eq('id', integrationId)

      return null
    }

    const tokens: RefreshTokenResponse = await response.json()

    // Update config with new tokens
    const updatedConfig = {
      ...decryptedConfig,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    }

    // Encrypt the updated config
    const encryptedConfig = encryptConfig(updatedConfig)

    // Save updated tokens to database
    const { data: updated, error: updateError } = await supabase
      .from('integrations')
      .update({
        config: encryptedConfig,
        status: 'active',
        error_message: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', integrationId)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update integration with new tokens:', updateError)
      return null
    }

    console.log('✅ Access token refreshed successfully')
    return updated
  } catch (error) {
    console.error('Error refreshing token:', error)

    // Mark integration as error state
    await supabase
      .from('integrations')
      .update({
        status: 'error',
        error_message: 'Token refresh error. Re-authorization required.'
      })
      .eq('id', integrationId)

    return null
  }
}

/**
 * Check if an access token is expired or will expire soon
 *
 * @param expiresAt - ISO timestamp when token expires
 * @param bufferMinutes - Refresh if token expires within this many minutes (default: 5)
 * @returns true if token should be refreshed
 */
export function shouldRefreshToken(expiresAt: string, bufferMinutes: number = 5): boolean {
  const expiryTime = new Date(expiresAt).getTime()
  const now = Date.now()
  const bufferMs = bufferMinutes * 60 * 1000

  return now >= (expiryTime - bufferMs)
}

/**
 * Get a valid access token for an integration, refreshing if needed
 *
 * @param integrationId - The integration ID
 * @returns Valid access token, or null if refresh failed
 */
export async function getValidAccessToken(integrationId: string): Promise<string | null> {
  const supabase = getSupabaseAdmin()

  // Get the integration
  const { data: integration, error } = await supabase
    .from('integrations')
    .select('*')
    .eq('id', integrationId)
    .single()

  if (error || !integration) {
    console.error('Failed to fetch integration:', error)
    return null
  }

  // Decrypt config
  const config = decryptConfig(integration.config)

  // Check if token needs refresh
  if (config.expires_at && shouldRefreshToken(config.expires_at)) {
    console.log('🔄 Token expired or expiring soon, refreshing...')
    const refreshed = await refreshSupabaseToken(integrationId)

    if (!refreshed) {
      return null
    }

    // Return new access token
    const newConfig = decryptConfig(refreshed.config)
    return newConfig.access_token
  }

  // Token still valid
  return config.access_token
}

/**
 * Refresh all expired tokens for active integrations
 *
 * This can be run periodically (e.g., via cron job)
 */
export async function refreshExpiredTokens() {
  const supabase = getSupabaseAdmin()

  console.log('🔄 Checking for expired tokens...')

  // Get all active Supabase integrations
  const { data: integrations, error } = await supabase
    .from('integrations')
    .select('*')
    .eq('integration_type', 'supabase')
    .eq('status', 'active')

  if (error || !integrations) {
    console.error('Failed to fetch integrations:', error)
    return
  }

  let refreshedCount = 0
  let errorCount = 0

  for (const integration of integrations) {
    const config = decryptConfig(integration.config)

    if (config.expires_at && shouldRefreshToken(config.expires_at, 10)) {
      console.log(`Refreshing token for integration ${integration.id} (${integration.name})`)

      const result = await refreshSupabaseToken(integration.id)

      if (result) {
        refreshedCount++
      } else {
        errorCount++
      }
    }
  }

  console.log(`✅ Token refresh complete: ${refreshedCount} refreshed, ${errorCount} errors`)
}
