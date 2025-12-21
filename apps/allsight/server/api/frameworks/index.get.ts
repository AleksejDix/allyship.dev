import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { featured } = getQuery(event)

  let query = supabase
    .from("frameworks")
    .select(
      "id, display_name, shorthand_name, description, status, compliance_type, jurisdiction, has_penalties, max_penalty, official_url, tags"
    )
    .eq("status", "active")

  // If featured is requested, filter to main frameworks
  if (featured === "true") {
    query = query.in("id", ["iso-27001", "soc2", "wcag-2-1-aa", "cis"])
  }

  query = query.order("display_name")

  const { data, error } = await query

  if (error) {
    console.error("Database error:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch frameworks",
      data: error,
    })
  }

  return data
})
