"use server"

import { z } from "zod"
import { createServerAction } from "zsa"
import { createClient } from "@/lib/supabase/server"

const crawlSchema = z.object({
  website_id: z.string(),
  url: z.string().url(),
})

export const crawl = createServerAction()
  .input(crawlSchema)
  .handler(async ({ input }) => {
    try {
      // First verify the user has access
      const supabase = await createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return {
          success: false,
          error: {
            message: "Not authenticated",
            code: "AUTH_ERROR",
          },
        }
      }

      // Verify space ownership
      const { data: website, error: websiteError } = await supabase
        .from("Website")
        .select("space:Space(owner_id)")
        .eq("id", input.website_id)
        .single()

      if (websiteError || !website?.space?.owner_id) {
        return {
          success: false,
          error: {
            message: "Website not found",
            code: "WEBSITE_NOT_FOUND",
          },
        }
      }

      if (website.space.owner_id !== user.id) {
        return {
          success: false,
          error: {
            message: "Not authorized to crawl this website",
            code: "NOT_WEBSITE_OWNER",
          },
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sitemap?url=${input.url}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch sitemap")
      }

      const data = await response.json()
      const urls = data.sitemap

      // Get existing pages
      const { data: existingPages } = await supabase
        .from("Page")
        .select("url")
        .eq("website_id", input.website_id)

      const existingUrls = new Set(existingPages?.map(p => p.url) ?? [])

      // Filter out existing URLs
      const newUrls = urls.filter((url: string) => !existingUrls.has(url))

      // Create new pages
      const { data: createdPages, error: insertError } = await supabase
        .from("Page")
        .insert(
          newUrls.map((url: string) => ({
            url,
            website_id: input.website_id,
          }))
        )
        .select()

      if (insertError) {
        return {
          success: false,
          error: {
            message: "Failed to create pages",
            code: "CREATE_FAILED",
          },
        }
      }

      const stats = {
        total: urls.length,
        new: newUrls.length,
        existing: urls.length - newUrls.length,
      }

      return {
        success: true,
        data: createdPages,
        stats,
      }
    } catch (error) {
      console.error("[crawl] Error:", error)
      return {
        success: false,
        error: {
          message: "Failed to crawl website",
          code: "CRAWL_ERROR",
        },
      }
    }
  })
