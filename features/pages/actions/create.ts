"use server"

import { createServerAction } from "zsa"
import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/database.types"
import { createPageSchema } from "../schemas"
import { compareHostnames } from "@/features/common/utils/url"

type Page = Tables<"Page">

export const createPage = createServerAction()
  .input(createPageSchema)
  .handler(async ({ input }) => {
    console.log("[createPage] Starting with input:", input)
    const supabase = await createClient()

    // First verify the user has access
    console.log("[createPage] Verifying user authentication")
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error("[createPage] Authentication error:", userError)
      return {
        success: false,
        error: {
          message: "Not authenticated",
          code: "AUTH_ERROR",
        },
      }
    }
    console.log("[createPage] User authenticated:", user.id)

    // Verify space ownership and get website domain
    console.log("[createPage] Verifying space ownership and domain for website:", input.website_id)
    const { data: website, error: websiteError } = await supabase
      .from("Website")
      .select(`
        url,
        space:Space!Domain_space_id_fkey(owner_id)
      `)
      .eq("id", input.website_id)
      .single()

    if (websiteError || !website?.space?.owner_id) {
      console.error("[createPage] Website/space error:", websiteError)
      return {
        success: false,
        error: {
          message: "Website not found",
          code: "WEBSITE_NOT_FOUND",
        },
      }
    }
    console.log("[createPage] Found website with domain:", website.url)

    if (website.space.owner_id !== user.id) {
      console.error("[createPage] User is not space owner. User:", user.id, "Owner:", website.space.owner_id)
      return {
        success: false,
        error: {
          message: "Not authorized to create pages in this space",
          code: "NOT_SPACE_OWNER",
        },
      }
    }

    // Validate URL domain matches website domain
    try {
      if (!compareHostnames(input.url, website.url)) {
        console.error("[createPage] Domain mismatch. Page:", input.url, "Website:", website.url)
        return {
          success: false,
          error: {
            message: `Page URL must be from the same domain as the website`,
            code: "DOMAIN_MISMATCH",
          },
        }
      }
      console.log("[createPage] Domain validation passed")
    } catch (e) {
      console.error("[createPage] Invalid URL:", e)
      return {
        success: false,
        error: {
          message: "Invalid URL provided",
          code: "INVALID_URL",
        },
      }
    }

    // Create the page
    console.log("[createPage] Creating new page with URL:", input.url)
    const { data: page, error } = await supabase
      .from("Page")
      .insert({
        url: input.url,
        website_id: input.website_id,
      })
      .select()
      .single()

    if (error) {
      console.error("[createPage] Failed to create page:", error)
      return {
        success: false,
        error: {
          message: "Failed to create page",
          code: "CREATE_FAILED",
        },
      }
    }

    console.log("[createPage] Successfully created page:", page)
    return { success: true, data: page }
  })
