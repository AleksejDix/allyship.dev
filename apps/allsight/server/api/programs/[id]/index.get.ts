import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  // Get the program ID from the route parameters
  const { id: programId } = getRouterParams(event)

  if (!programId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Program ID is required",
    })
  }

  // Fetch the program with framework details and account info
  const { data: program, error: programError } = await supabase
    .from("programs")
    .select(
      `
      id,
      account_id,
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
    .eq("id", programId)
    .single()

  if (programError) {
    console.error("Database error:", programError)

    if (programError.code === "PGRST116") {
      throw createError({
        statusCode: 404,
        statusMessage: "Program not found",
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch program",
      data: programError,
    })
  }

  // Fetch program controls with control details
  const { data: programControls, error: controlsError } = await supabase
    .from("program_controls")
    .select(
      `
      id,
      created_at,
      control:controls (
        id,
        name,
        description,
        is_production_ready
      )
    `
    )
    .eq("program_id", programId)
    .order("control(id)")

  if (controlsError) {
    console.error("Database error fetching controls:", controlsError)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch program controls",
      data: controlsError,
    })
  }

  return {
    ...program,
    controls: programControls,
  }
})
