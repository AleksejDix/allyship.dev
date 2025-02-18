"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerAction } from "zsa"

import { createClient } from "@/lib/supabase/server"


const deleteWebsiteSchema = z.object({
  websiteId: z.string(),
  spaceId: z.string(),
})

const createWebsiteSchema = z.object({
  url: z.string(),
  space_id: z.string(),
})

export const createWebsite = createServerAction()
  .input(createWebsiteSchema)
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

    const { url, space_id } = input

    const { data, error } = await supabase.from("Website").insert({
      url,
      space_id,
    })

    console.log(data, error)

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    revalidatePath(`/spaces/${space_id}/websites`)

    return {
      success: true,
      data,
    }
  })

export const websiteDelete = createServerAction()
  .input(deleteWebsiteSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "unauthorized",
        },
      }
    }

    const { websiteId, spaceId } = input

    // Delete the domain - RLS policies will ensure user has access
    const {  error: deleteError } = await supabase
      .from("Website")
      .delete()
      .match({ id: websiteId, space_id: spaceId })


    if (deleteError) {
      return {
        success: false,
        error: {
          message: deleteError.message,
          code: deleteError.code,
        },
      }
    }

    // Revalidate the domains list
    revalidatePath(`/spaces/${spaceId}`)

    return {
      success: true,
    }
  })
