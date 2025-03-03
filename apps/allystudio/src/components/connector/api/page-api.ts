import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database.types"

import { checkAuth, handleApiError, type ApiResponse } from "./connector-utils"

export type Page = Database["public"]["Tables"]["Page"]["Row"]
export type PageInsert = Database["public"]["Tables"]["Page"]["Insert"]

// Read operation
export async function fetchPagesForWebsite(
  websiteId: string
): Promise<ApiResponse<Page[]>> {
  try {
    // Validate input
    if (!websiteId) {
      throw new Error("Website ID is required")
    }

    // Check authentication
    const { user, error: authError } = await checkAuth(supabase)
    if (authError) throw authError

    // Fetch data
    const { data, error } = await supabase
      .from("Page")
      .select("*")
      .eq("website_id", websiteId)
      .order("path", { ascending: true })

    // Handle database errors
    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("You don't have permission to view these pages")
      }
      throw error
    }

    return { data: data || [], error: null }
  } catch (error) {
    return handleApiError<Page[]>(error, "fetching", "pages", { websiteId })
  }
}

// Legacy function name for backwards compatibility
export const readPages = fetchPagesForWebsite

// Create operation
export async function createPage(
  pageData: PageInsert
): Promise<ApiResponse<Page>> {
  try {
    // Validate input
    if (!pageData || !pageData.website_id || !pageData.path) {
      throw new Error("Valid page data with website_id and path is required")
    }

    // Check authentication
    const { user, error: authError } = await checkAuth(supabase)
    if (authError) throw authError

    // Create page
    const { data, error } = await supabase
      .from("Page")
      .insert([pageData])
      .select()
      .single()

    if (error) {
      // Handle common errors
      if (error.code === "23505") {
        throw new Error("This page already exists for this website")
      } else if (error.code === "23503") {
        throw new Error("The referenced website doesn't exist")
      }
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return handleApiError<Page>(error, "creating", "page", {
      websiteId: pageData?.website_id,
      pagePath: pageData?.path
    })
  }
}

// Update operation
export async function updatePage(
  pageId: string,
  pageData: Partial<PageInsert>
): Promise<ApiResponse<Page>> {
  try {
    // Validate input
    if (!pageId) {
      throw new Error("Page ID is required")
    }

    if (!pageData || Object.keys(pageData).length === 0) {
      throw new Error("Update data is required")
    }

    // Check authentication
    const { user, error: authError } = await checkAuth(supabase)
    if (authError) throw authError

    // Update page
    const { data, error } = await supabase
      .from("Page")
      .update(pageData)
      .eq("id", pageId)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("You don't have permission to update this page")
      } else if (error.code === "23503") {
        throw new Error("The referenced website doesn't exist")
      }
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return handleApiError<Page>(error, "updating", "page", {
      pageId,
      updateFields: Object.keys(pageData || {})
    })
  }
}

// Delete operation
export async function deletePage(
  pageId: string
): Promise<ApiResponse<boolean>> {
  try {
    // Validate input
    if (!pageId) {
      throw new Error("Page ID is required")
    }

    // Check authentication
    const { user, error: authError } = await checkAuth(supabase)
    if (authError) throw authError

    // Delete page
    const { error } = await supabase.from("Page").delete().eq("id", pageId)

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("You don't have permission to delete this page")
      }
      throw error
    }

    return { data: true, error: null }
  } catch (error) {
    return handleApiError<boolean>(error, "deleting", "page", { pageId })
  }
}
