"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

// Create a new space
export async function createSpace(data: { name: string }) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Failed to get user")
  }

  // First ensure the user exists in the database
  await prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email || "",
    },
    update: {}, // No updates needed if user exists
  })

  const space = await prisma.space.create({
    data: {
      name: data.name,
      memberships: {
        create: {
          user_id: user.id,
          email: user.email || "",
        },
      },
    },
    include: {
      memberships: true,
    },
  })
  revalidatePath("/spaces")
  return { space }
}

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

  const spaces = await prisma.space.findMany({
    where: {
      memberships: {
        some: {
          user_id: user.id,
        },
      },
    },
  })
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
