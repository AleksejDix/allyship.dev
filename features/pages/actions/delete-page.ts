"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

const deletePageSchema = z.object({
  pageId: z.string(),
  spaceId: z.string(),
  domainId: z.string(),
})

export const deletePage = createServerAction()
  .input(deletePageSchema)
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
          code: "UNAUTHORIZED",
        },
      }
    }

    const { pageId, spaceId, domainId } = input

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
          code: "NOT_FOUND",
        },
      }
    }

    // Delete the page
    await prisma.page.delete({
      where: {
        id: pageId,
      },
    })

    // Revalidate the pages list and domain pages
    revalidatePath(`/spaces/${spaceId}/${domainId}`)
    revalidatePath(`/spaces/${spaceId}/${domainId}/pages`)

    return {
      success: true,
    }
  })
