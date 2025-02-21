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
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return {
        success: false,
        error: {
          message: "Not authenticated",
          code: "AUTH_ERROR"
        }
      }
    }

    const normalizedUrl = normalizeUrlUtil(url)

    const { data: page, error: pageError } = await supabase
      .from("Page")
      .insert({
        url,
        website_id: websiteId,
        path: extractPath(url),
        normalized_url: normalizedUrl
      })
      .select()
      .single()

    if (pageError) {
      return {
        success: false,
        error: {
          message: "Failed to create page",
          code: "CREATE_FAILED"
        }
      }
    }

    return { success: true, data: page }
  } catch (error) {
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
