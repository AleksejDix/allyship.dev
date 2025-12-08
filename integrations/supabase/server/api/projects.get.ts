/**
 * Get Supabase Projects
 *
 * Uses the stored access token to fetch user's Supabase projects
 * from the Management API
 */
export default defineEventHandler(async (event) => {
  // Get access token from cookie
  const accessToken = getCookie(event, 'supabase_access_token')

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated. Please connect your Supabase account.'
    })
  }

  // Call Supabase Management API to list projects
  const response = await fetch('https://api.supabase.com/v1/projects', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    // If token expired, we should refresh it
    // TODO: Implement token refresh logic
    throw createError({
      statusCode: response.status,
      message: 'Failed to fetch projects from Supabase'
    })
  }

  const projects = await response.json()
  return projects
})
