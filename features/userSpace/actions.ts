"use server"

import { createClient } from "@/lib/supabase/server"
import type { UserSpaceViewResponse } from "./types"

// Get all spaces for a user
export async function getUserSpaces(): Promise<UserSpaceViewResponse> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      spaces: null,
      error: {
        message: "Failed to get user",
        status: 401,
        code: "unauthorized"
      }
    }
  }

  const { data: userSpaces, error } = await supabase
    .from('UserSpaceView')
    .select()
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Supabase error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    return {
      spaces: null,
      error: {
        message: "Failed to fetch spaces",
        status: 500,
        code: "fetch_failed"
      }
    }
  }

  return { spaces: userSpaces }
}
