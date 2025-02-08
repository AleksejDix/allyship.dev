"use server"

import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"

export async function getPagesByDomainId(domain_id: string) {
  return prisma.page.findMany({
    where: { domain_id },
  })
}

export const create = createServerAction()
  .input(
    z.object({
      name: z.string().url().min(1, "Domain name is required"),
      domain_id: z.string().min(1, "Domain ID is required"),
    })
  )
  .handler(async ({ input }) => {
    // Check if domain already exists
    const existingDomain = await prisma.page.findFirst({
      where: {
        name: input.name,
        domain_id: input.domain_id,
      },
    })

    if (existingDomain) {
      return {
        success: false,
        error: {
          message: "Domain already exists in this space",
          status: 400,
          code: "domain_already_exists",
        },
      }
    }

    const page = await prisma.page.create({
      data: {
        name: input.name,
        domain_id: input.domain_id,
      },
    })

    return { success: true, data: page }
  })
