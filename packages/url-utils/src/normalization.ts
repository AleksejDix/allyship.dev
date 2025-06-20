import { parse } from "tldts"
import { TRACKING_PARAMS } from "./constants.js"
import type { NormalizedUrl, NormalizationOptions } from "./types.js"
import { isValidPageUrl } from "./validation.js"

/**
 * Normalizes a URL with consistent rules across browsers
 *
 * Browser Compatibility:
 * - Chrome/Edge: Full support
 * - Firefox: Shows IDNs in native script
 * - Safari: May handle some Unicode characters differently
 * - Mobile: Length limitations may apply
 *
 * @param url The URL to normalize
 * @param options Normalization options
 * @returns Normalized URL object
 * @throws {Error} If URL is invalid or exceeds browser limits
 */
export function normalizeUrl(
  url: string,
  options: NormalizationOptions = {}
): NormalizedUrl {
  const {
    keepQueryParams = false,
    keepFragment = false,
    removeWww = true,
    removeTrailingSlash = true,
    sortQueryParams = true
  } = options

  // Validate URL first
  if (!isValidPageUrl(url)) {
    throw new Error("Invalid URL")
  }

  // Add protocol if missing
  const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`

  // Parse URL
  const parsedUrl = new URL(urlWithProtocol)

  // Clean hostname (remove www and convert to punycode)
  let hostname = parsedUrl.hostname.toLowerCase()
  if (removeWww) {
    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4)
    } else if (hostname.includes(".www.")) {
      hostname = hostname.replace(/\.www\./g, ".")
    }
  }

  // Get domain using tldts
  const parsed = parse(hostname)
  if (!parsed.domain) {
    throw new Error("Invalid domain")
  }

  // Clean path (normalize slashes, handle trailing slash)
  let path = parsedUrl.pathname
  if (path === "") {
    path = "/"
  } else {
    // Normalize multiple slashes
    path = path.replace(/\/{2,}/g, "/")
    // Remove trailing slash except for root path
    if (removeTrailingSlash && path !== "/" && path.endsWith("/")) {
      path = path.slice(0, -1)
    }
  }

  // Handle query parameters
  let queryString = ""
  if (keepQueryParams && parsedUrl.search) {
    const params = new URLSearchParams(parsedUrl.search)

    // Remove tracking parameters
    for (const trackingParam of TRACKING_PARAMS) {
      params.delete(trackingParam)
    }

    // Sort parameters if requested
    if (sortQueryParams) {
      const sortedParams = new URLSearchParams()
      const sortedKeys = Array.from(params.keys()).sort()
      for (const key of sortedKeys) {
        const values = params.getAll(key)
        for (const value of values) {
          sortedParams.append(key, value)
        }
      }
      if (sortedParams.toString()) {
        queryString = `?${sortedParams.toString()}`
      }
    } else {
      if (params.toString()) {
        queryString = `?${params.toString()}`
      }
    }
  }

  // Handle fragment
  let fragment = ""
  if (keepFragment && parsedUrl.hash) {
    fragment = parsedUrl.hash
  }

  // Build full URL without protocol
  const full = hostname + (path === "/" ? "" : path) + queryString + fragment

  return {
    hostname,
    domain: parsed.domain!,
    path,
    full,
    raw: url // Store the original input URL
  }
}

/**
 * Simple URL normalization that returns a string (compatible with allyship version)
 *
 * @param url The URL to normalize
 * @param keepQueryParams Whether to keep query parameters
 * @returns Normalized URL as string
 */
export function normalizeUrlString(
  url: string,
  keepQueryParams: boolean = false
): string {
  try {
    const normalized = normalizeUrl(url, { keepQueryParams })
    return normalized.full
  } catch {
    // Fallback to basic cleaning
    let cleaned = url.trim().toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")

        if (!keepQueryParams) {
      cleaned = cleaned.split('?')[0] || cleaned
    }

    // Remove fragment
    cleaned = cleaned.split('#')[0] || cleaned

    // Remove trailing slash
    if (cleaned.endsWith('/') && cleaned.length > 1) {
      cleaned = cleaned.slice(0, -1)
    }

    return cleaned
  }
}

/**
 * Normalizes a URL path for comparison
 * - Removes trailing slashes
 * - Removes duplicate slashes
 * - Decodes URI components
 * - Converts to lowercase
 */
export function normalizePath(path: string): string {
  try {
    // Decode URI components
    const decoded = decodeURIComponent(path)

    return (
      decoded
        // Convert to lowercase
        .toLowerCase()
        // Remove duplicate slashes
        .replace(/\/+/g, "/")
        // Remove trailing slash (except for root)
        .replace(/\/$/, "") || "/"
    )
  } catch {
    // If decoding fails, work with the original string
    return (
      path
        .toLowerCase()
        .replace(/\/+/g, "/")
        .replace(/\/$/, "") || "/"
    )
  }
}

/**
 * Normalizes a URL for crawling (removes query params and fragments)
 * Used by crawling functions
 */
export function normalizeUrlForCrawling(
  url: string,
  baseUrl: string
): { url: string; path: string } | null {
  try {
    const urlObj = new URL(url, baseUrl)

    // Remove fragments and query parameters for crawling
    urlObj.hash = ''
    urlObj.search = ''

    const normalizedUrl = urlObj.href
    let path = urlObj.pathname

    // Normalize path
    if (path === '/' || path === '') {
      path = '/'
    } else {
      // Remove trailing slash unless it's root
      path = path.replace(/\/$/, '')
    }

    return { url: normalizedUrl, path }
  } catch {
    return null
  }
}
