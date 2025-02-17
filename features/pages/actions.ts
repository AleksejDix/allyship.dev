"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerAction } from "zsa"
import { createClient } from "@/lib/supabase/server"
import type { Tables, TablesUpdate } from "@/database.types"

type Page = Tables<"Page">
type PageInsert = TablesUpdate<"Page">
type PageUpdate = TablesUpdate<"Page">

// READ - Get all pages for a website
export async function getPagesByWebsiteId(website_id: string) {
  const supabase = await createClient()

  const { data: pages, error } = await supabase
    .from("Page")
    .select()
    .eq("website_id", website_id)

  if (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch pages",
        code: "FETCH_FAILED",
      },
    }
  }

  return { success: true, data: pages }
}

// READ - Get single page
export async function getPage(id: string) {
  const supabase = await createClient()

  const { data: page, error } = await supabase
    .from("Page")
    .select()
    .eq("id", id)
    .single()

  if (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch page",
        code: "FETCH_FAILED",
      },
    }
  }

  return { success: true, data: page }
}

// CREATE - Create new page
export const createPage = createServerAction()
  .input(
    z.object({
      url: z.string().url().min(1, "URL is required"),
      website_id: z.string().min(1, "Website ID is required"),
    })
  )
  .handler(async ({ input }) => {
    const supabase = await createClient()

    // First, get the website to validate the domain
    const { data: website } = await supabase
      .from("Website")
      .select("url")
      .eq("id", input.website_id)
      .single()

    if (!website) {
      return {
        success: false,
        error: {
          message: "Website not found",
          status: 404,
          code: "website_not_found",
        },
      }
    }

    // Validate and clean URLs
    try {
      const pageUrl = new URL(input.url)
      const websiteUrl = new URL(website.url)

      if (pageUrl.hostname !== websiteUrl.hostname) {
        return {
          success: false,
          error: {
            message: "Page URL must belong to the website's domain",
            status: 400,
            code: "invalid_domain",
          },
        }
      }

      // Strip query parameters from the URL
      pageUrl.search = ""
      const cleanUrl = pageUrl.toString()

      // Check if page already exists (using cleaned URL)
      const { data: existingPage } = await supabase
        .from("Page")
        .select()
        .eq("url", cleanUrl)
        .eq("website_id", input.website_id)
        .is("deleted_at", null)
        .single()

      if (existingPage) {
        return {
          success: false,
          error: {
            message: "Page already exists for this website",
            status: 400,
            code: "page_already_exists",
          },
        }
      }

      // Create the page with cleaned URL
      const { data: page, error } = await supabase
        .from("Page")
        .insert({
          url: cleanUrl,
          website_id: input.website_id,
        })
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: {
            message: "Failed to create page",
            status: 500,
            code: "create_page_error",
          },
        }
      }

      return { success: true, data: page }
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Invalid URL format",
          status: 400,
          code: "invalid_url",
        },
      }
    }
  })

// UPDATE - Update existing page
export const updatePage = createServerAction()
  .input(
    z.object({
      id: z.string(),
      url: z.string().url().optional(),
      website_id: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    const supabase = await createClient()

    const { data: page, error } = await supabase
      .from("Page")
      .update({
        ...(input.url && { url: input.url }),
        ...(input.website_id && { website_id: input.website_id }),
      })
      .eq("id", input.id)
      .is("deleted_at", null)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: {
          message: "Failed to update page",
          code: "UPDATE_FAILED",
        },
      }
    }

    return { success: true, data: page }
  })

// DELETE - Delete page
export const deletePage = createServerAction()
  .input(
    z.object({
      id: z.string(),
      website_id: z.string(),
      space_id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    console.log("Starting page deletion", input)
    const supabase = await createClient()

    // First verify the user has access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error("Auth error:", userError)
      return {
        success: false,
        error: {
          message: "Not authenticated",
          code: "AUTH_ERROR",
        },
      }
    }
    console.log("Authenticated user:", user.id)

    // Verify space ownership
    const { data: space, error: spaceError } = await supabase
      .from("Space")
      .select("owner_id")
      .eq("id", input.space_id)
      .single()

    if (spaceError || !space) {
      console.error("Space access error:", spaceError)
      return {
        success: false,
        error: {
          message: "Space not found or no access",
          code: "SPACE_ACCESS_ERROR",
        },
      }
    }

    if (space.owner_id !== user.id) {
      console.error("User is not space owner", { userId: user.id, ownerId: space.owner_id })
      return {
        success: false,
        error: {
          message: "Not authorized to delete pages in this space",
          code: "NOT_SPACE_OWNER",
        },
      }
    }
    console.log("Space access verified")

    // Perform the hard delete
    const { data, error } = await supabase
      .from("Page")
      .delete()
      .eq("id", input.id)

    if (error) {
      console.error("Failed to delete page:", error)
      return {
        success: false,
        error: {
          message: "Failed to delete page",
          code: "DELETE_FAILED",
          details: error.message,
        },
      }
    }
    console.log("Page delete result:", { data, error })

    console.log("Page deleted successfully")

    // Revalidate the path
    revalidatePath(`/spaces/${input.space_id}/${input.website_id}/pages`)

    // Return success response
    return {
      success: true,
      data: null,
      redirect: `/spaces/${input.space_id}/${input.website_id}/pages`,
    }
  })

// RESTORE - Restore deleted page
export const restorePage = createServerAction()
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const supabase = await createClient()

    const { data: page, error } = await supabase
      .from("Page")
      .update({
        deleted_at: null,
      })
      .eq("id", input.id)
      .not("deleted_at", "is", null)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: {
          message: "Failed to restore page",
          code: "RESTORE_FAILED",
        },
      }
    }

    return { success: true, data: page }
  })
