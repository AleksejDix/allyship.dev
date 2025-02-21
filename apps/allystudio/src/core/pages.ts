import {
  extractDomain,
  extractPath,
  normalizeUrl as normalizeUrlUtil
} from "@/utils/url"

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
    const hostname = extractDomain(url)

    const { data: website, error } = await supabase
      .from("Website")
      .select()
      .ilike("url", `%${hostname}%`)
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

export async function connectPageToAllyship(url: string, websiteId: string) {
  try {
    console.log("[connectPageToAllyship] Starting with:", { url, websiteId })

    // First verify the user has access
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error("[connectPageToAllyship] Auth error:", authError)
      return {
        success: false,
        error: {
          message: "Not authenticated",
          code: "AUTH_ERROR"
        }
      }
    }
    console.log("[connectPageToAllyship] Authenticated user:", user.id)

    // Verify website ownership and get domain
    const { data: website, error: websiteError } = await supabase
      .from("Website")
      .select("url, user_id")
      .eq("id", websiteId)
      .single()

    if (websiteError || !website) {
      console.error("[connectPageToAllyship] Website error:", websiteError)
      return {
        success: false,
        error: {
          message: "Website not found",
          code: "WEBSITE_NOT_FOUND"
        }
      }
    }
    console.log("[connectPageToAllyship] Found website:", website)

    if (website.user_id !== user.id) {
      console.error("[connectPageToAllyship] User mismatch:", {
        websiteUserId: website.user_id,
        userId: user.id
      })
      return {
        success: false,
        error: {
          message: "Not authorized to create pages for this website",
          code: "NOT_WEBSITE_OWNER"
        }
      }
    }

    // Validate URL domain matches website domain
    if (!compareHostnames(url, website.url)) {
      console.error("[connectPageToAllyship] Domain mismatch:", {
        pageUrl: url,
        websiteUrl: website.url
      })
      return {
        success: false,
        error: {
          message: "Page URL must be from the same domain as the website",
          code: "DOMAIN_MISMATCH"
        }
      }
    }
    console.log("[connectPageToAllyship] Domain validation passed")

    const normalized_url = normalizeUrlUtil(url)
    const path = extractPath(url)
    console.log("[connectPageToAllyship] Normalized data:", {
      normalized_url,
      path
    })

    // Create the page
    const { data: page, error: pageError } = await supabase
      .from("Page")
      .insert({
        url,
        website_id: websiteId,
        path,
        normalized_url
      })
      .select()
      .single()

    if (pageError) {
      console.error("[connectPageToAllyship] Page creation error:", pageError)
      return {
        success: false,
        error: {
          message: "Failed to create page",
          code: "CREATE_FAILED"
        }
      }
    }

    console.log("[connectPageToAllyship] Successfully created page:", page)
    return { success: true, data: page }
  } catch (error) {
    console.error("[connectPageToAllyship] Unexpected error:", error)
    return {
      success: false,
      error: {
        message: "Invalid URL or connection failed",
        code: "CONNECTION_FAILED"
      }
    }
  }
}

export async function getPageByUrl(url: string) {
  try {
    const normalizedUrl = normalizeUrlUtil(url)

    const { data: page, error } = await supabase
      .from("Page")
      .select(
        `
        *,
        website:Website(*)
      `
      )
      .eq("normalized_url", normalizedUrl)
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
