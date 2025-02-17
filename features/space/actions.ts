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

// Create a new space
export const createSpace = createServerAction()
  .input(spaceSchema)
  .handler(async ({ input }): Promise<SpaceResponse> => {
    const supabase = await createClient()
    const { name } = input

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        error: {
          message: "You must be logged in to create a workspace",
          status: 401,
          code: "unauthorized",
        },
      }
    }

    // Check if space with same name exists for this user
    const { data: existingSpace } = await supabase
      .from("Space")
      .select()
      .eq("created_by", user.id)
      .ilike("name", name)
      .single()

    if (existingSpace) {
      return {
        error: {
          message: "A workspace with this name already exists",
          status: 400,
          code: "duplicate_space_name",
        },
      }
    }

    try {
      const { data: space, error } = await supabase
        .from("Space")
        .insert({
          name,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      revalidatePath("/", "layout")
      return { data: space }
    } catch (error) {
      return {
        error: {
          message: "Failed to create workspace",
          status: 500,
          code: "create_space_failed",
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
      error: {
        message: "Failed to fetch space",
        status: 500,
        code: "fetch_failed",
      },
    }
  }

  return { data }
}

const updateSpaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

export async function updateSpace(
  spaceId: string,
  data: z.infer<typeof updateSpaceSchema>
) {
  try {
    // Validate input
    const validated = updateSpaceSchema.parse(data)

    // Create Supabase client
    const supabase = await createClient()

    // Update the space - RLS will handle permissions
    const { data: updatedSpace, error: updateError } = await supabase
      .from("Space")
      .update({
        name: validated.name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", spaceId)
      .select()
      .single()

    if (updateError) {
      console.log("Update error:", updateError)
      return {
        success: false,
        error: {
          message: updateError.message || "Failed to update space",
          code: "update_failed",
        },
      }
    }

    // Revalidate paths
    revalidatePath(`/spaces/${spaceId}`)
    revalidatePath(`/spaces/${spaceId}/settings`)
    revalidatePath("/spaces")

    return {
      success: true,
      data: updatedSpace,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: "Invalid input",
          code: "validation_failed",
        },
      }
    }

    console.error("Unexpected error:", error)
    return {
      success: false,
      error: {
        message: "An unexpected error occurred",
        code: "internal_error",
      },
    }
  }
}

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
