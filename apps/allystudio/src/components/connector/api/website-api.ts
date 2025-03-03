import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database.types"

import { checkAuth, handleApiError, type ApiResponse } from "./connector-utils"

export type Website = Database["public"]["Tables"]["Website"]["Row"]
export type WebsiteInsert = Database["public"]["Tables"]["Website"]["Insert"]

// Read operation
export async function fetchWebsitesForSpace(
  spaceId: string
): Promise<ApiResponse<Website[]>> {
  try {
    // Validate input
    if (!spaceId) {
      throw new Error("Space ID is required")
    }

    // Check authentication
    const { user, error: authError } = await checkAuth(supabase)
    if (!user || authError) throw authError

    // Fetch data
    const { data, error } = await supabase
      .from("Website")
      .select("*")
      .eq("space_id", spaceId)
      .order("normalized_url", { ascending: false })

    // Handle database errors
    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("You don't have permission to view these websites")
      }
      throw error
    }

    return { data: data || [], error: null }
  } catch (error) {
    return handleApiError<Website[]>(error, "fetching", "websites", { spaceId })
  }
}

// Legacy function name for backwards compatibility
export const readWebsites = fetchWebsitesForSpace

// Create operation
export async function createWebsite(
  websiteData: WebsiteInsert
): Promise<ApiResponse<Website>> {
  try {
    // Validate input
    if (!websiteData || !websiteData.space_id || !websiteData.url) {
      throw new Error("Valid website data with space_id and url is required")
    }

    // Check authentication
    const { user, error: authError } = await checkAuth(supabase)
    if (authError) throw authError

    // Create website
    const { data, error } = await supabase
      .from("Website")
      .insert([websiteData])
      .select()
      .single()

    if (error) {
      // Handle common errors
      if (error.code === "23505") {
        throw new Error("This website already exists in this space")
      }
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return handleApiError<Website>(error, "creating", "website", {
      websiteUrl: websiteData?.url,
      spaceId: websiteData?.space_id
    })
  }
}

// Update operation
export async function updateWebsite(
  websiteId: string,
  websiteData: Partial<WebsiteInsert>
): Promise<ApiResponse<Website>> {
  try {
    // Validate input
    if (!websiteId) {
      throw new Error("Website ID is required")
    }

    if (!websiteData || Object.keys(websiteData).length === 0) {
      throw new Error("Update data is required")
    }

    // Check authentication
    const { user, error: authError } = await checkAuth(supabase)
    if (authError) throw authError

    // Update website
    const { data, error } = await supabase
      .from("Website")
      .update(websiteData)
      .eq("id", websiteId)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("You don't have permission to update this website")
      }
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return handleApiError<Website>(error, "updating", "website", {
      websiteId,
      updateFields: Object.keys(websiteData || {})
    })
  }
}

// Delete operation
export async function deleteWebsite(
  websiteId: string
): Promise<ApiResponse<boolean>> {
  try {
    // Validate input
    if (!websiteId) {
      throw new Error("Website ID is required")
    }

    // Check authentication
    const { user, error: authError } = await checkAuth(supabase)
    if (authError) throw authError

    // Delete website
    const { error } = await supabase
      .from("Website")
      .delete()
      .eq("id", websiteId)

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("You don't have permission to delete this website")
      }
      throw error
    }

    return { data: true, error: null }
  } catch (error) {
    return handleApiError<boolean>(error, "deleting", "website", { websiteId })
  }
}
