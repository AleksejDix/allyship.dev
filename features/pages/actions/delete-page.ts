"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerAction } from "zsa"

import { createClient } from "@/lib/supabase/server"

const deletePageSchema = z.object({
  pageId: z.string(),
  spaceId: z.string(),
  websiteId: z.string(),
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

    const { pageId, spaceId, websiteId } = input

    // Verify user has access to this space
    const { data: space } = await supabase
      .from("Space")
      .select()
      .match({ id: spaceId, owner_id: user.id })
      .single()

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
    const { error } = await supabase
      .from("Page")
      .delete()
      .match({ id: pageId })

    if (error) {
      return {
        success: false,
        error: {
          message: "Failed to delete page",
          code: "DELETE_FAILED",
        },
      }
    }

    // Revalidate the pages list and website pages
    revalidatePath(`/spaces/${spaceId}/${websiteId}`)
    revalidatePath(`/spaces/${spaceId}/${websiteId}/pages`)

    return {
      success: true,
    }
  })
