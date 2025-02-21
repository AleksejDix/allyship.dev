import { supabase } from "./supabase"

export async function getWebsiteForUrl(url: string) {
  try {
    const hostname = new URL(url).hostname

    // Get website by domain
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
    // Check authentication
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

    // Create the page
    const { data: page, error: pageError } = await supabase
      .from("Page")
      .insert({
        url,
        website_id: websiteId,
        path: new URL(url).pathname,
        normalized_url: url.toLowerCase()
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
