"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

import { themeSettingsSchema } from "./schema"

const deleteDomainSchema = z.object({
  domainId: z.string(),
  spaceId: z.string(),
})

export const deleteDomain = createServerAction()
  .input(deleteDomainSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "unauthorized",
        },
      }
    }

    const { domainId, spaceId } = input

    // Verify user has access to this space
    const space = await prisma.space.findFirst({
      where: {
        id: spaceId,
        user_id: user.id,
      },
    })

    if (!space) {
      return {
        success: false,
        error: {
          message: "Space not found",
          code: "not_found",
        },
      }
    }

    // Delete the domain and all related pages
    await prisma.domain.delete({
      where: {
        id: domainId,
      },
    })

    // Revalidate the domains list
    revalidatePath(`/spaces/${spaceId}`)

    return {
      success: true,
    }
  })

export const updateThemeSettings = createServerAction()
  .input(themeSettingsSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "unauthorized",
        },
      }
    }

    const { domainId, spaceId, theme } = input

    // Verify user has access to this space
    const space = await prisma.space.findFirst({
      where: {
        id: spaceId,
        user_id: user.id,
      },
    })

    if (!space) {
      return {
        success: false,
        error: {
          message: "Space not found",
          code: "not_found",
        },
      }
    }

    // Update domain settings
    await prisma.domain.update({
      where: {
        id: domainId,
      },
      data: {
        theme,
      },
    })

    revalidatePath(`/spaces/${spaceId}/${domainId}/settings/advanced`)

    return {
      success: true,
    }
  })
