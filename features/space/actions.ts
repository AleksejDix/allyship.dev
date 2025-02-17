"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerAction } from "zsa"

import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/database.types"
import type { SpaceResponse, SpaceWithRelations } from "./types"
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
export async function getSpace(id: string): Promise<SpaceResponse<SpaceWithRelations>> {
  const supabase = await createClient()

  const { data: space, error } = await supabase
    .from("Space")
    .select(`
      *,
      domains:Domain!space_id(*),
      owner:User!inner(*),
      memberships:Membership!space_id(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    return {
      error: {
        message: "Failed to get space",
        status: 500,
        code: "fetch_failed"
      }
    }
  }

  return { data: space }
}

// Update a space
export async function updateSpace(
  id: string,
  data: Database["public"]["Tables"]["Space"]["Update"]
): Promise<SpaceResponse> {
  const supabase = await createClient()

  const { data: space, error } = await supabase
    .from("Space")
    .update(data)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return {
      error: {
        message: "Failed to update space",
        status: 500,
        code: "update_failed"
      }
    }
  }

  return { data: space }
}
