"use server"

import { revalidatePath } from "next/cache"
import { createServerAction } from "zsa"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/database.types"
import type { SpaceResponse } from "./types"
import { spaceSchema } from "./schema"

// First, let's define our response types
type SuccessResponse<T> = {
  success: true
  data: T
}

type ErrorResponse = {
  success: false
  error: {
    message: string
    code: string
    status?: number
  }
}

type ActionResponse<T> = SuccessResponse<T> | ErrorResponse

// Create a new space
export const createSpace = createServerAction()
  .input(spaceSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const { name } = input

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "unauthorized",
          status: 401,
        },
      }
    }

    try {
      const { data: space, error } = await supabase
        .from("Space")
        .insert({
          name,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: {
            message: "Failed to create workspace",
            code: "create_space_failed",
            status: 500,
          },
        }
      }

      revalidatePath("/", "layout")
      return { success: true, data: space }
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to create workspace",
          code: "create_space_failed",
          status: 500,
        },
      }
    }
  })

// Get a single space by ID
export async function getSpace(spaceId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("Space")
    .select()
    .eq("id", spaceId)
    .single()

  if (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch space",
        code: "fetch_failed",
        status: 500,
      },
    }
  }

  return { success: true, data }
}

export async function getSpaces() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("Space").select()

  if (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch spaces",
        code: "fetch_failed",
        status: 500,
      },
    }
  }
  return { success: true, data }
}

const updateSpaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  id: z.string().min(1, "ID is required"),
})

// Create a server action for updating spaces
export const updateSpaceAction = createServerAction()
  .input(updateSpaceSchema)
  .handler(async ({ input }) => {
    try {
      const supabase = await createClient()

      // Update the space - RLS will handle permissions
      const { data: updatedSpace, error: updateError } = await supabase
        .from("Space")
        .update({
          name: input.name,
        })
        .eq("id", input.id)
        .select()
        .single()

      // Revalidate paths
      revalidatePath(`/spaces/${input.id}`)
      revalidatePath(`/spaces/${input.id}/settings`)
      revalidatePath("/spaces")

      return {
        success: true,
        data: updatedSpace,
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      return {
        success: false,
        error: {
          message: "An unexpected error occurred",
          code: "internal_error",
          status: 500,
        },
      }
    }
  })

// Type for the space data to be used across components
export interface SpaceData {
  id: string
  name: string
  domain_count: number
  member_count: number
  created_at: string
  updated_at: string
  // Add other fields as needed
}

const deleteSpaceSchema = z.object({
  id: z.string().min(1, "ID is required"),
})


export const deleteSpaceAction = createServerAction()
  .input(deleteSpaceSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const { data, error } = await supabase.from("Space").delete().eq("id", input.id)


    revalidatePath("/spaces")
    redirect("/spaces")


    if (error) {
      return {
        success: false,
        error: {
          message: "Failed to delete space",
          code: "delete_space_failed",
          status: 500,
        },
      }
    }

    return {
      success: true,
      data,
    }
  })
