"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function index() {
  const memberships = await prisma.membership.findMany({
    include: {
      user: true,
    },
  })

  return memberships
}

export async function create(spaceId: string, email: string) {
  await prisma.membership.create({
    data: {
      space_id: spaceId,
      email: email,
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
