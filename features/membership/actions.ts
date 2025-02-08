"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export async function index() {
  const memberships = await prisma.membership.findMany({
    include: {
      user: true,
    },
  })

  return memberships
}

export async function create(spaceId: string) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Failed to get user")
  }

  await prisma.membership.create({
    data: {
      space_id: spaceId,
      user_id: user.id,
    },
  })
}

export async function remove(formData: FormData) {
  const id = formData.get("id")

  await prisma.membership.delete({
    where: {
      id: id as string,
    },
  })

  revalidatePath("/spaces")
}
