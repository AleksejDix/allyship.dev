import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  // Get the account ID from the route parameters
  const { id: accountId } = getRouterParams(event)

  if (!accountId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Account ID is required",
    })
  }

  // Query programs with framework details
  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      id,
      created_at,
      framework:frameworks (
        id,
        display_name,
        shorthand_name,
        description,
        jurisdiction,
        countries_active,
        status,
        compliance_type,
        has_penalties,
        max_penalty,
        official_url,
        tags
      )
    `
    )
    .eq("account_id", accountId)

  if (error) {
    console.error("Database error:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch account programs",
      data: error,
    })
  }

  return data
})
