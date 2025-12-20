import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const accountId = getRouterParam(event, "id")

  if (!accountId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Account ID is required",
    })
  }

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  try {
    // Call the delete_account RPC function
    const { error } = await supabase.rpc("delete_account", {
      account_id: accountId,
    } as any)

    if (error) {
      console.error("Delete account error:", error)
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to delete account",
      })
    }

    return { success: true, message: "Account deleted successfully" }
  } catch (err) {
    console.error("Unexpected error deleting account:", err)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete account",
    })
  }
})
