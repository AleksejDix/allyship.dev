import {
  createPage,
  createWebsite,
  getWebsite,
  listWebsites,
  type Page,
  type PageInsert,
  type Website,
  type WebsiteInsert
} from "."
import type { ApiResponse } from "../connector-utils"

/**
 * Creates a page, ensuring its parent website exists first
 * If the website doesn't exist, it will be created
 *
 * @param spaceId - The space ID where the website belongs
 * @param websiteUrl - The URL of the website
 * @param pagePath - The path of the page
 * @param pageUrl - Optional full URL of the page (if not provided, will be constructed from website URL and page path)
 * @returns ApiResponse with the created page
 */
export async function createPageWithWebsite(
  spaceId: string,
  websiteUrl: string,
  pagePath: string,
  pageUrl?: string
): Promise<ApiResponse<Page>> {
  if (!spaceId) {
    return {
      data: null,
      error: new Error("Space ID is required")
    }
  }

  if (!websiteUrl) {
    return {
      data: null,
      error: new Error("Website URL is required")
    }
  }

  if (!pagePath) {
    return {
      data: null,
      error: new Error("Page path is required")
    }
  }

  // Normalize input
  const normalizedWebsiteUrl = normalizeUrl(websiteUrl)

  // 1. Try to find website by normalized URL using list with filter
  try {
    // First, try to find the website by normalized URL
    const websitesResponse = await listWebsites({
      normalized_url: normalizedWebsiteUrl
    })

    let website: Website | null = null

    if (websitesResponse.data && websitesResponse.data.length > 0) {
      // Website exists
      website = websitesResponse.data[0]
    } else {
      // Website doesn't exist, create it
      const newWebsite: WebsiteInsert = {
        space_id: spaceId,
        url: websiteUrl,
        normalized_url: normalizedWebsiteUrl
      }

      const createResponse = await createWebsite(newWebsite)

      if (!createResponse.data) {
        return {
          data: null,
          error: new Error(
            `Failed to create website: ${createResponse.error?.message || "Unknown error"}`
          )
        }
      }

      website = createResponse.data
    }

    // Ensure website is not null (TypeScript safety)
    if (!website) {
      return {
        data: null,
        error: new Error("Failed to find or create website")
      }
    }

    // Now create the page
    const fullPageUrl =
      pageUrl ||
      `${websiteUrl}${pagePath.startsWith("/") ? "" : "/"}${pagePath}`

    const newPage: PageInsert = {
      website_id: website.id,
      url: fullPageUrl,
      path: pagePath
    }

    return await createPage(newPage)
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred")
    }
  }
}

/**
 * Simple URL normalization function - extracts hostname
 */
function normalizeUrl(url: string): string {
  try {
    // If URL doesn't have a protocol, add one for parsing
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`
    const hostname = new URL(urlWithProtocol).hostname
    // Remove www. if present
    return hostname.replace(/^www\./, "")
  } catch (error) {
    // Return original if parsing fails
    return url
  }
}
