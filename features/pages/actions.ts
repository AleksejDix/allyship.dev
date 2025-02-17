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
    .is("deleted_at", null)

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
    .is("deleted_at", null)
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

    // Check if page already exists
    const { data: existingPage } = await supabase
      .from("Page")
      .select()
      .eq("url", input.url)
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

    const { data: page, error } = await supabase
      .from("Page")
      .insert({
        url: input.url,
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

// DELETE - Soft delete page
export const deletePage = createServerAction()
  .input(
    z.object({
      id: z.string(),
      website_id: z.string(),
      space_id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from("Page")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", input.id)
      .is("deleted_at", null)

    if (error) {
      return {
        success: false,
        error: {
          message: "Failed to delete page",
          code: "DELETE_FAILED",
        },
      }
    }

    revalidatePath(`/spaces/${input.space_id}/${input.website_id}/pages`)
    redirect(`/spaces/${input.space_id}/${input.website_id}/pages`)
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
