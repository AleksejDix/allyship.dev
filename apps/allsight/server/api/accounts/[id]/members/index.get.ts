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

  const { data, error } = await supabase.rpc("get_account_members", {
    account_id: accountId,
  } as any)

  if (error) {
    console.error("Database error:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch account members",
      data: error,
    })
  }

  return data
})
