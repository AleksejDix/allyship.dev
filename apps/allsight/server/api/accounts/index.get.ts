import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  // Get query parameters
  const query = getQuery(event)

  // Define filter handlers for different parameter types
  const filterHandlers = {
    id: {
      field: "id",
      getValue: async (value: any) => String(value),
      useRpc: false,
      single: true, // Return single record
    },
    slug: {
      useRpc: true,
      rpcName: "get_account_by_slug",
      single: true, // Return single record
    },
    me: {
      field: "primary_owner_user_id",
      getValue: async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
          })
        }
        return user.id
      },
      useRpc: false,
      single: true, // Return single record
    },
  } as const

  // Build dynamic query with filters
  let dbQuery = supabase.from("basejump.accounts").select("*")
  let isSingle = false

  // Apply filters dynamically
  for (const [param, handler] of Object.entries(filterHandlers)) {
    const value = query[param]
    if ((param === "me" && value === "true") || (param !== "me" && value)) {
      // Check if this handler uses RPC or direct query
      if (handler.useRpc && "rpcName" in handler) {
        // Use RPC approach
        console.log(`Calling RPC ${handler.rpcName} with slug:`, String(value))
        const { data, error } = await supabase.rpc(handler.rpcName, {
          slug: String(value),
        } as any)
        console.log("RPC response:", { data, error })

        if (error) {
          console.error("Database error:", error)
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch account",
            data: error,
          })
        }

        if (!data) {
          console.log(
            "RPC returned no data - account not found or no permission"
          )
          throw createError({
            statusCode: 404,
            statusMessage: "Account not found",
          })
        }

        console.log("RPC returned data:", data)
        return data
      } else {
        // Use direct query approach
        const filterValue = await handler.getValue(value)
        dbQuery = dbQuery.eq(handler.field, filterValue)
        if (handler.single) isSingle = true
      }
    }
  }

  // Execute direct query if no RPC was used
  if (isSingle) {
    // Filters were applied, execute the filtered query
    const { data, error } = await dbQuery.single()

    if (error) {
      console.error("Database error:", error)

      // Check if this is a "not found" error vs actual database error
      if (
        error.code === "PGRST116" ||
        error.message?.includes("No rows found")
      ) {
        throw createError({
          statusCode: 404,
          statusMessage: "Account not found",
        })
      }

      // Otherwise it's a real database error
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch account",
        data: error,
      })
    }

    return data
  } else {
    // No filters applied, get all accounts using RPC for proper permissions
    const { data, error } = await supabase.rpc("get_accounts")

    if (error) {
      console.error("Database error:", error)
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch accounts",
        data: error,
      })
    }

    return data
  }
})
