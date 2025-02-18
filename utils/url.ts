import normalizeUrlPkg from "normalize-url"

/**
 * Normalizes a URL using consistent rules:
 * - Converts to lowercase
 * - Adds https:// if no protocol
 * - Removes www.
 * - Removes default ports (80/443)
 * - Removes trailing slashes
 * - Sorts query parameters
 * - Removes fragments (#)
 * - Handles URL encoding consistently
 *
 * @example
 * normalizeUrl("WWW.Apollo.io/products/?b=2&a=1#section")
 * // => "https://apollo.io/products?a=1&b=2"
 */
export function normalizeUrl(url: string): string {
  try {
    // Handle empty/invalid input
    if (!url?.trim()) {
      return ""
    }

    return normalizeUrlPkg(url.trim(), {
      defaultProtocol: "https",
      stripHash: true,
      stripWWW: true,
      removeTrailingSlash: true,
      sortQueryParameters: true,
      stripTextFragment: true,
      removeSingleSlash: true,
      removeExplicitPort: true,
    })
  } catch (error) {
    console.error("URL normalization error:", error)
    // Return cleaned but unnormalized URL as fallback
    return url.trim().toLowerCase()
  }
}

/**
 * Extracts the domain from a URL
 * Handles both normalized and unnormalized URLs
 */
export function extractDomain(url: string): string {
  try {
    const normalized = normalizeUrl(url)
    const urlObj = new URL(normalized)
    return urlObj.hostname
  } catch (error) {
    console.error("Domain extraction error:", error)
    return ""
  }
}

/**
 * Extracts the path from a URL
 * Returns "/" for homepage
 */
export function extractPath(url: string): string {
  try {
    const normalized = normalizeUrl(url)
    const urlObj = new URL(normalized)
    return urlObj.pathname || "/"
  } catch (error) {
    console.error("Path extraction error:", error)
    return "/"
  }
}

/**
 * Creates a display-friendly version of a URL
 * Removes protocol and trailing slashes
 */
export function getDisplayUrl(url: string): string {
  try {
    return normalizeUrl(url)
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
  } catch (error) {
    console.error("Display URL error:", error)
    return url.trim()
  }
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
