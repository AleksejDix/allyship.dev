"use server"

import { revalidatePath } from "next/cache"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

import { spaceSchema } from "./schema"

export const createSpace = createServerAction()
  .input(spaceSchema)
  .handler(async ({ input }): Promise<ActionResponse> => {
    const supabase = await createClient()
    const { name } = input

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: {
          message: "You must be logged in to create a workspace",
          status: 401,
          code: "unauthorized",
        },
      }
    }

    // Check if space with same name exists for this user
    const existingSpace = await prisma.space.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Case insensitive comparison
        },
        user_id: user.id,
      },
    })

    if (existingSpace) {
      return {
        success: false,
        error: {
          message: "A workspace with this name already exists",
          status: 400,
          code: "duplicate_space_name",
        },
      }
    }

    try {
      const space = await prisma.space.create({
        data: {
          name,
          user_id: user.id,
        },
      })

      revalidatePath("/", "layout")
      return {
        success: true,
        data: space,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to create workspace",
          status: 500,
          code: "create_space_failed",
        },
      }
    }
  })

// Get a single space by ID
export async function getSpace(id: string) {
  const space = await prisma.space.findUnique({
    where: { id },
  })
  return { space }
}

// Get all spaces for a user
export async function getSpaces() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Failed to get user")
  }

  const spaces = await prisma.space.findMany()
  return { spaces }
}

// Update a space
export async function updateSpace(
  id: string,
  data: {
    name: string
  }
) {
  const space = await prisma.space.update({
    where: { id },
    data: {
      name: data.name,
    },
  })
  return { space }
}

// Delete a space
export async function deleteSpace(id: string) {
  const space = await prisma.space.delete({
    where: { id },
  })
  return { space }
}
