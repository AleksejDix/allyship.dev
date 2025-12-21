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

  // Get the framework_id from the request body
  const body = await readBody(event)
  const { framework_id } = body

  if (!framework_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Framework ID is required",
    })
  }

  // Check if program already exists for this account and framework
  const { data: existingProgram } = await supabase
    .from("programs")
    .select("id")
    .eq("account_id", accountId)
    .eq("framework_id", framework_id)
    .single()

  if (existingProgram) {
    throw createError({
      statusCode: 409,
      statusMessage: "Program already exists for this framework",
    })
  }

  // Create the program
  // The auto_populate_program_controls trigger will automatically create program_controls
  const { data, error } = await supabase
    .from("programs")
    .insert({
      account_id: accountId,
      framework_id: framework_id,
    })
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
    .single()

  if (error) {
    console.error("Database error:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create program",
      data: error,
    })
  }

  return data
})
