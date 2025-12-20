import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  // Get the request body
  const body = await readBody(event)

  const { name, slug } = body

  if (!name || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: name and slug are required",
    })
  }

  const { data, error } = await supabase.rpc("create_account", {
    name,
    slug,
  } as any)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create account",
      data: error,
    })
  }

  return data
})
