import { SupabaseSecurityScanner } from '~/server/utils/scanner'

/**
 * Scan Endpoint
 *
 * Runs security scan on a specific Supabase project
 *
 * GET /api/scan/{projectId}
 */
export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId')

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required'
    })
  }

  // Get access token from cookie
  const accessToken = getCookie(event, 'supabase_access_token')

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated. Please connect your Supabase account.'
    })
  }

  try {
    // Initialize scanner
    const scanner = new SupabaseSecurityScanner(accessToken, projectId)

    // Run scan
    const result = await scanner.scan()

    return result
  } catch (error) {
    console.error('Scan failed:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Scan failed'
    })
  }
})
