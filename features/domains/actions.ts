"use server"

import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"
import { normalizeDomainName } from "@/lib/utils"

export async function getDomainsBySpaceId(spaceId: string) {
  return prisma.domain.findMany({
    where: { space_id: spaceId },
    orderBy: {
      name: "asc",
    },
  })
}

export const create = createServerAction()
  .input(
    z.object({
      name: z.string().url().min(1, "Domain name is required"),
      space_id: z.string().min(1, "Space ID is required"),
    })
  )
  .handler(async ({ input }) => {
    const normalizedDomainName = normalizeDomainName(input.name)

    // Check if domain already exists
    const existingDomain = await prisma.domain.findFirst({
      where: {
        name: normalizedDomainName,
        space_id: input.space_id,
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

    const domain = await prisma.domain.create({
      data: {
        name: normalizedDomainName,
        space_id: input.space_id,
      },
    })

    return { success: true, data: domain }
  })
