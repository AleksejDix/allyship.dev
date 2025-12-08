/**
 * Delete an integration
 *
 * DELETE /api/integrations/:id
 */

import { getSupabaseAdmin } from '~/server/utils/supabase-client'

export default defineEventHandler(async (event) => {
  const integrationId = getRouterParam(event, 'id')

  if (!integrationId) {
    throw createError({
      statusCode: 400,
      message: 'Integration ID is required'
    })
  }

  // TODO: Verify user has access to this integration
  const organizationId = getCookie(event, 'organization_id') || '00000000-0000-0000-0000-000000000000'

  const supabase = getSupabaseAdmin()

  // Verify integration belongs to organization
  const { data: integration } = await supabase
    .from('integrations')
    .select('organization_id')
    .eq('id', integrationId)
    .single()

  if (!integration || integration.organization_id !== organizationId) {
    throw createError({
      statusCode: 404,
      message: 'Integration not found'
    })
  }

  // Delete integration
  const { error } = await supabase
    .from('integrations')
    .delete()
    .eq('id', integrationId)

  if (error) {
    console.error('Failed to delete integration:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete integration'
    })
  }

  return {
    success: true,
    message: 'Integration deleted successfully'
  }
})
