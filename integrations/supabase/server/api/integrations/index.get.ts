/**
 * List all integrations for current user's organization
 *
 * GET /api/integrations
 *
 * Returns list of integrations (credentials are NOT decrypted for security)
 */

import { getSupabaseAdmin } from '~/server/utils/supabase-client'

export default defineEventHandler(async (event) => {
  // TODO: Get organization_id from authenticated user session
  // For now, use valid UUID placeholder from cookie
  const organizationId = getCookie(event, 'organization_id') || '00000000-0000-0000-0000-000000000000'

  const supabase = getSupabaseAdmin()

  const { data, error} = await supabase
    .from('integrations')
    .select('id, integration_type, name, status, error_message, last_checked_at, created_at, updated_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch integrations:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch integrations'
    })
  }

  return {
    integrations: data || [],
    count: data?.length || 0
  }
})
