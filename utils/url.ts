import normalizeUrlPkg from "normalize-url"

/**
 * Normalizes a URL using consistent rules:
 * - Converts to lowercase
 * - Removes protocol (http/https)
 * - Removes www.
 * - Removes default ports (80/443)
 * - Removes trailing slashes
 * - Removes fragments (#)
 * - Handles URL encoding consistently
 *
 * @param url The URL to normalize
 * @param keepQueryParams Whether to keep query parameters (default: false)
 * @returns The normalized URL
 *
 * @example
 * // For websites (with query params)
 * normalizeUrl("WWW.Apollo.io/products/?b=2&a=1#section", true)
 * // => "apollo.io/products?a=1&b=2"
 *
 * // For pages (without query params)
 * normalizeUrl("WWW.Apollo.io/products/?b=2&a=1#section")
 * // => "apollo.io/products"
 */
export function normalizeUrl(url: string, keepQueryParams: boolean = false): string {
  try {
    // Handle empty/invalid input
    if (!url?.trim()) {
      return ""
    }

    // First normalize with the package
    const normalized = normalizeUrlPkg(url.trim(), {
      defaultProtocol: "https",
      stripHash: true,
      stripWWW: true,
      removeTrailingSlash: true,
      sortQueryParameters: keepQueryParams, // Only sort if we're keeping them
      stripTextFragment: true,
      removeSingleSlash: true,
      removeExplicitPort: true,
      removeQueryParameters: keepQueryParams ? [] : [/.*/], // Remove all query params unless keepQueryParams is true
    })

    // Then remove the protocol
    return normalized.replace(/^https?:\/\//, "")
  } catch (error) {
    console.error("URL normalization error:", error)
    // Return cleaned but unnormalized URL as fallback
    let cleaned = url.trim().toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")

    if (!keepQueryParams) {
      cleaned = cleaned.split('?')[0]
    }
    return cleaned
  }
}

/**
 * Extracts the domain from a URL
 * Handles both normalized and unnormalized URLs
 */
export function extractDomain(url: string): string {
  try {
    // Add protocol if missing for URL parsing
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`
    const urlObj = new URL(urlWithProtocol)
    return urlObj.hostname.toLowerCase().replace(/^www\./, '')
  } catch (error) {
    console.error("Domain extraction error:", error)
    return url.trim().toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(/[/?#]/)[0]
  }
}

/**
 * Extracts the path from a URL, removing query parameters and fragments
 * Returns "/" for homepage
 */
export function extractPath(url: string): string {
  try {
    // Add protocol if missing for URL parsing
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`
    const urlObj = new URL(urlWithProtocol)
    const path = urlObj.pathname || "/"
    // Remove trailing slash unless it's just "/"
    return path === "/" ? path : path.replace(/\/$/, "")
  } catch (error) {
    console.error("Path extraction error:", error)
    // Fallback: try to extract path portion after domain
    const withoutProtocol = url.replace(/^https?:\/\//, "")
    const pathPart = withoutProtocol.split(/[?#]/)[0].split("/").slice(1).join("/")
    return pathPart ? `/${pathPart}` : "/"
  }
}

/**
 * Creates a display-friendly version of a URL
 * Removes protocol and trailing slashes
 */
export function getDisplayUrl(url: string): string {
  return normalizeUrl(url, true) // Keep query params for display
}

/**
 * Checks if a URL is the homepage of its domain
 */
export function isHomepage(url: string): boolean {
  return extractPath(url) === "/"
}

/**
 * Validates that a child URL belongs to a parent domain
 */
export function isUrlUnderDomain(childUrl: string, parentDomain: string): boolean {
  try {
    const childDomain = extractDomain(childUrl)
    const normalizedParentDomain = extractDomain(parentDomain)
    return childDomain === normalizedParentDomain
  } catch (error) {
    console.error("URL domain check error:", error)
    return false
  }
}
