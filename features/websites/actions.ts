"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerAction } from "zsa"

import { createClient } from "@/lib/supabase/server"
import { normalizeUrl, extractPath } from "@/utils/url"


const deleteWebsiteSchema = z.object({
  websiteId: z.string(),
  spaceId: z.string(),
})

const createWebsiteSchema = z.object({
  url: z.string().transform((val, ctx) => {
    try {
      return normalizeUrl(val)
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid URL format",
      })
      return z.NEVER
    }
  }),
  space_id: z.string(),
})

const normalizeUrlsSchema = z.object({
  spaceId: z.string(),
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

    try {
      // URL is already normalized from the schema transform
      const normalized_url = url

      const { data, error } = await supabase.from("Website").insert({
        url: normalized_url, // Use normalized URL for both fields
        normalized_url,
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
    } catch (e) {
      return {
        success: false,
        error: {
          message: "Invalid URL provided",
          code: "INVALID_URL",
        },
      }
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

export const normalizeUrls = createServerAction()
  .input(normalizeUrlsSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "unauthorized",
        },
      }
    }

    // First get all websites in the space
    const { data: websites, error: websitesError } = await supabase
      .from("Website")
      .select("id, url")
      .eq("space_id", input.spaceId)

    if (websitesError) {
      return {
        success: false,
        error: {
          message: "Failed to fetch websites",
          code: "FETCH_ERROR",
        },
      }
    }

    // Update each website with normalized URL
    const websiteUpdates = websites.map(async (website) => {
      try {
        const normalized_url = normalizeUrl(website.url)
        return supabase
          .from("Website")
          .update({ normalized_url })
          .eq("id", website.id)
      } catch (e) {
        console.error(`Failed to normalize website URL ${website.url}:`, e)
        return null
      }
    })

    // Get all pages for each website
    const pageUpdates = await Promise.all(
      websites.map(async (website) => {
        const { data: pages, error: pagesError } = await supabase
          .from("Page")
          .select("id, url")
          .eq("website_id", website.id)

        if (pagesError) {
          console.error(`Failed to fetch pages for website ${website.id}:`, pagesError)
          return []
        }

        return pages.map(async (page) => {
          try {
            const normalized_url = normalizeUrl(page.url)
            const path = extractPath(page.url)
            return supabase
              .from("Page")
              .update({ normalized_url, path })
              .eq("id", page.id)
          } catch (e) {
            console.error(`Failed to normalize page URL ${page.url}:`, e)
            return null
          }
        })
      })
    )

    // Wait for all updates to complete
    await Promise.all([
      ...websiteUpdates,
      ...pageUpdates.flat(),
    ])

    revalidatePath(`/spaces/${input.spaceId}`)

    return {
      success: true,
    }
  })
