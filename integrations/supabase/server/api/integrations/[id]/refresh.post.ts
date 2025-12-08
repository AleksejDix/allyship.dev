/**
 * Refresh access token for an integration
 *
 * POST /api/integrations/:id/refresh
 */

import { refreshSupabaseToken } from '~/server/utils/token-refresh'

export default defineEventHandler(async (event) => {
  const integrationId = getRouterParam(event, 'id')

  if (!integrationId) {
    throw createError({
      statusCode: 400,
      message: 'Integration ID is required'
    })
  }

  console.log('🔄 Manual token refresh requested for:', integrationId)

  const result = await refreshSupabaseToken(integrationId)

  if (!result) {
    throw createError({
      statusCode: 500,
      message: 'Failed to refresh access token. The refresh token may be invalid or expired.'
    })
  }

  return {
    success: true,
    message: 'Access token refreshed successfully',
    integration: {
      id: result.id,
      name: result.name,
      status: result.status,
      updated_at: result.updated_at
    }
  }
})
