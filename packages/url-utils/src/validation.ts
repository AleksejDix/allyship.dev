import { parse } from "tldts"
import { INVALID_URL_PROTOCOLS, MAX_URL_LENGTH, NON_HTML_EXTENSIONS } from "./constants.js"
import type { ValidationResult } from "./types.js"

/**
 * Checks if a URL is valid for page tracking
 * - Must be a valid URL
 * - Must be HTTP/HTTPS
 * - Must not be a browser-specific URL
 * - Must have a valid hostname
 * - Must not exceed maximum length
 */
export function isValidPageUrl(urlString: string): boolean {
  if (!urlString?.trim()) return false

  // Check length limit
  if (urlString.length > MAX_URL_LENGTH) return false

  try {
    // Parse with tldts first to validate domain
    const parsed = parse(urlString, { detectIp: true })
    if (!parsed.domain || parsed.isIp) {
      return false
    }

    // Create URL object to validate format
    new URL(
      urlString.startsWith("http") ? urlString : `https://${urlString}`
    )

    // Check for invalid protocols
    if (
      INVALID_URL_PROTOCOLS.some((protocol) => urlString.startsWith(protocol))
    ) {
      return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * Validates a URL and returns detailed result
 */
export function validateUrl(urlString: string): ValidationResult {
  if (!urlString?.trim()) {
    return {
      isValid: false,
      error: "URL cannot be empty"
    }
  }

  if (urlString.length > MAX_URL_LENGTH) {
    return {
      isValid: false,
      error: `URL exceeds maximum length of ${MAX_URL_LENGTH} characters`
    }
  }

  try {
    // Parse with tldts first to validate domain
    const parsed = parse(urlString, { detectIp: true })
    if (!parsed.domain) {
      return {
        isValid: false,
        error: "Invalid domain"
      }
    }

    if (parsed.isIp) {
      return {
        isValid: false,
        error: "IP addresses are not supported"
      }
    }

    // Check for invalid protocols
    const invalidProtocol = INVALID_URL_PROTOCOLS.find((protocol) =>
      urlString.startsWith(protocol)
    )
    if (invalidProtocol) {
      return {
        isValid: false,
        error: `Protocol ${invalidProtocol} is not supported`
      }
    }

    // Try to create URL object
    new URL(
      urlString.startsWith("http") ? urlString : `https://${urlString}`
    )

    return {
      isValid: true
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid URL format"
    }
  }
}

/**
 * Checks if a URL points to a non-HTML resource
 */
export function isNonHtmlUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`)
    const pathname = url.pathname.toLowerCase()

    // Check if the path ends with a non-HTML extension
    const extension = pathname.split(".").pop()
    if (extension && NON_HTML_EXTENSIONS.includes(extension as any)) {
      return true
    }

    return false
  } catch {
    return false
  }
}

/**
 * Checks if a URL is a homepage (root path)
 */
export function isHomepage(url: string): boolean {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
    return urlObj.pathname === "/" || urlObj.pathname === ""
  } catch {
    return false
  }
}

/**
 * Checks if a URL should be skipped for crawling
 */
export function shouldSkipUrl(url: string): boolean {
  if (!url) return true

  // Skip non-web links
  if (
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("javascript:") ||
    url.startsWith("#") ||
    url.startsWith("data:")
  ) {
    return true
  }

  // Skip non-HTML resources
  if (isNonHtmlUrl(url)) {
    return true
  }

  return false
}
