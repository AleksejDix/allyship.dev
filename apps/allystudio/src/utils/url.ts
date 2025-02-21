/**
 * Normalizes a URL using consistent rules:
 * - Converts to lowercase
 * - Removes protocol (http/https)
 * - Removes www.
 * - Removes default ports (80/443)
 * - Removes trailing slashes
 * - Removes fragments (#)
 * - Handles URL encoding consistently
 */
export function normalizeUrl(url: string): string {
  try {
    // Handle empty/invalid input
    if (!url?.trim()) {
      return ""
    }

    // Add protocol if missing for URL parsing
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`
    const urlObj = new URL(urlWithProtocol)

    // Build normalized URL
    let normalized = urlObj.hostname.toLowerCase().replace(/^www\./, "")
    const path = urlObj.pathname === "/" ? "" : urlObj.pathname
    normalized += path.replace(/\/$/, "") // Remove trailing slash unless it's just "/"

    return normalized
  } catch (error) {
    console.error("URL normalization error:", error)
    // Return cleaned but unnormalized URL as fallback
    return url
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("?")[0]
      .split("#")[0]
      .replace(/\/$/, "")
  }
}

/**
 * Extracts the domain from a URL
 * Handles both normalized and unnormalized URLs
 */
export function extractDomain(url: string): string {
  try {
    // Add protocol if missing for URL parsing
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`
    const urlObj = new URL(urlWithProtocol)
    return urlObj.hostname.toLowerCase().replace(/^www\./, "")
  } catch (error) {
    console.error("Domain extraction error:", error)
    return url
      .trim()
      .toLowerCase()
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
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`
    const urlObj = new URL(urlWithProtocol)
    const path = urlObj.pathname || "/"
    // Remove trailing slash unless it's just "/"
    return path === "/" ? path : path.replace(/\/$/, "")
  } catch (error) {
    console.error("Path extraction error:", error)
    // Fallback: try to extract path portion after domain
    const withoutProtocol = url.replace(/^https?:\/\//, "")
    const pathPart = withoutProtocol
      .split(/[?#]/)[0]
      .split("/")
      .slice(1)
      .join("/")
    return pathPart ? `/${pathPart}` : "/"
  }
}
