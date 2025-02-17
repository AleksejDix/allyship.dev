"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// Get all spaces for a user
export async function getUserSpaces() {
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

  const { data, error } = await supabase
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

  return { data }
}

export async function getUserSpace(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      space: null,
      error: {
        message: "Failed to get user",
        status: 401,
        code: "unauthorized"
      }
    }
  }

  const { data, error } = await supabase
    .from('UserSpaceView')
    .select()
    .eq('space_id', id)
    .single()

  return { data, error }
}

// Delete a space
export async function deleteUserSpace(id: string): Promise<{
  success: boolean
  error?: {
    message: string
    status: number
    code: string
  }
}> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      error: {
        message: "You must be logged in to delete a workspace",
        status: 401,
        code: "unauthorized"
      }
    }
  }

  // Delete the space - RLS will handle permission checks
  const { error: deleteError } = await supabase
    .from('Space')
    .delete()
    .eq('id', id)

  if (deleteError) {
    // If RLS blocks the delete, it means user doesn't have permission
    if (deleteError.code === "42501") { // Permission denied
      return {
        success: false,
        error: {
          message: "You don't have permission to delete this workspace",
          status: 403,
          code: "forbidden"
        }
      }
    }

    console.error("Delete error:", deleteError)
    return {
      success: false,
      error: {
        message: "Failed to delete workspace",
        status: 500,
        code: "delete_failed"
      }
    }
  }

  revalidatePath('/spaces')
  return { success: true }
}
