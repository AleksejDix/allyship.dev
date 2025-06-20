import {
  extractDomain,
  extractPath,
  normalizeUrl as normalizeUrlUtil
} from "@allystudio/url-utils"

import { supabase } from "./supabase"

// Normalize URL by removing protocol, www, trailing slashes, and converting to lowercase
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    let normalized = parsed.hostname.replace(/^www\./, "") + parsed.pathname
    normalized = normalized.replace(/\/$/, "") // Remove trailing slash
    return normalized.toLowerCase()
  } catch (error) {
    return url.toLowerCase()
  }
}

// Compare two hostnames to see if they match (ignoring www and protocol)
function compareHostnames(url1: string, url2: string): boolean {
  try {
    const domain1 = extractDomain(url1)
    const domain2 = extractDomain(url2)
    return domain1 === domain2
  } catch (error) {
    return false
  }
}

export async function getWebsiteForUrl(url: string) {
  try {
    // Get authenticated user
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError) {
      return {
        success: false,
        error: {
          message: "Not authenticated",
          code: "AUTH_ERROR"
        }
      }
    }

    // Get user's personal space
    const { data: space, error: spaceError } = await supabase
      .from("Space")
      .select()
      .eq("owner_id", user.id)
      .eq("is_personal", true)
      .single()

    if (spaceError) {
      return {
        success: false,
        error: {
          message: "Personal space not found",
          code: "SPACE_NOT_FOUND"
        }
      }
    }

    const hostname = extractDomain(url)
    const normalized_hostname = normalizeUrl(hostname)

    const { data: website, error } = await supabase
      .from("Website")
      .select()
      .eq("normalized_url", normalized_hostname)
      .eq("space_id", space.id)
      .single()

    if (error) {
      return {
        success: false,
        error: {
          message: "Website not found",
          code: "WEBSITE_NOT_FOUND"
        }
      }
    }

    return { success: true, data: website }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Invalid URL",
        code: "INVALID_URL"
      }
    }
  }
}

export async function connectPageToAllyship(url: string) {
  try {
    // Get authenticated user
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("Auth error:", authError)
      return {
        success: false,
        error: { message: "Not authenticated", code: "AUTH_ERROR" }
      }
    }

    // Get user's personal space
    const { data: space, error: spaceError } = await supabase
      .from("Space")
      .select()
      .eq("owner_id", user.id)
      .eq("is_personal", true)
      .single()

    if (spaceError) {
      console.error("Failed to get user's personal space:", spaceError)
      return {
        success: false,
        error: { message: "Failed to get personal space", code: "SPACE_ERROR" }
      }
    }

    // Get or create website for this domain in the user's space
    const hostname = extractDomain(url)
    const normalized_hostname = normalizeUrl(hostname)

    // First try to get existing website
    const { data: existingWebsite } = await supabase
      .from("Website")
      .select()
      .eq("normalized_url", normalized_hostname)
      .eq("space_id", space.id)
      .single()

    // Create website if it doesn't exist
    const website =
      existingWebsite ||
      (await (async () => {
        const { data: newWebsite, error: createError } = await supabase
          .from("Website")
          .insert({
            url: hostname,
            normalized_url: normalized_hostname,
            space_id: space.id,
            theme: "BOTH"
          })
          .select()
          .single()

        if (createError) {
          console.error("Failed to create website:", createError)
          return null
        }

        return newWebsite
      })())

    if (!website) {
      return {
        success: false,
        error: {
          message: "Failed to get/create website",
          code: "WEBSITE_ERROR"
        }
      }
    }

    // Check if page already exists
    const normalized_url = normalizeUrl(url)
    const { data: existingPage } = await supabase
      .from("Page")
      .select()
      .eq("normalized_url", normalized_url)
      .eq("website_id", website.id)
      .single()

    if (existingPage) {
      return { success: true, data: existingPage }
    }

    // Create the page
    const path = extractPath(url)
    const { data: page, error: pageError } = await supabase
      .from("Page")
      .insert({
        url,
        website_id: website.id,
        path,
        normalized_url
      })
      .select()
      .single()

    if (pageError) {
      console.error("Failed to create page:", pageError)
      return {
        success: false,
        error: { message: "Failed to create page", code: "PAGE_ERROR" }
      }
    }

    return { success: true, data: page }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      error: { message: "Unexpected error occurred", code: "UNKNOWN_ERROR" }
    }
  }
}

export async function getPageByUrl(url: string) {
  try {
    // Get authenticated user
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError) {
      return {
        success: false,
        error: {
          message: "Not authenticated",
          code: "AUTH_ERROR"
        }
      }
    }

    // Get user's personal space
    const { data: space, error: spaceError } = await supabase
      .from("Space")
      .select()
      .eq("owner_id", user.id)
      .eq("is_personal", true)
      .single()

    if (spaceError) {
      return {
        success: false,
        error: {
          message: "Personal space not found",
          code: "SPACE_NOT_FOUND"
        }
      }
    }

    const normalizedUrl = normalizeUrlUtil(url)

    const { data: page, error } = await supabase
      .from("Page")
      .select(
        `
        *,
        website:Website!inner(*)
      `
      )
      .eq("normalized_url", normalizedUrl)
      .eq("website.space_id", space.id)
      .single()

    if (error) {
      return {
        success: false,
        error: {
          message: "Page not found",
          code: "PAGE_NOT_FOUND"
        }
      }
    }

    return { success: true, data: page }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to check page",
        code: "CHECK_FAILED"
      }
    }
  }
}
