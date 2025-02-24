const INVALID_URL_PROTOCOLS = [
  "chrome:",
  "chrome-extension:",
  "about:",
  "edge:",
  "brave:",
  "firefox:",
  "opera:",
  "safari:",
  "data:",
  "file:",
  "ftp:",
  "view-source:"
]

/**
 * Checks if a URL is valid for page tracking
 * - Must be a valid URL
 * - Must be HTTP/HTTPS
 * - Must not be a browser-specific URL
 * - Must have a valid hostname
 */
export function isValidPageUrl(urlString: string): boolean {
  if (!urlString?.trim()) return false

  try {
    const url = new URL(
      urlString.startsWith("http") ? urlString : `https://${urlString}`
    )

    // Check for invalid protocols
    if (
      INVALID_URL_PROTOCOLS.some((protocol) => urlString.startsWith(protocol))
    ) {
      return false
    }

    // Must have a valid hostname (not localhost or IP address)
    const hostname = url.hostname.toLowerCase()
    if (
      hostname === "localhost" ||
      hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/) || // IPv4
      hostname.includes("::") || // IPv6
      !hostname.includes(".") // Must have at least one dot
    ) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}

/**
 * Normalizes a URL using consistent rules:
 * - Validates URL is trackable
 * - Converts to lowercase
 * - Removes protocol (http/https)
 * - Removes www.
 * - Removes trailing slashes
 * - Removes fragments (#)
 * @throws {Error} If URL is invalid for page tracking
 */
export function normalizeUrl(urlString: string): string {
  if (!isValidPageUrl(urlString)) {
    throw new Error("Invalid URL for page tracking")
  }

  const url = new URL(
    urlString.startsWith("http") ? urlString : `https://${urlString}`
  )

  let normalized = url.hostname.toLowerCase().replace(/^www\./, "")
  const path = url.pathname === "/" ? "" : url.pathname
  normalized += path.replace(/\/$/, "") // Remove trailing slash unless it's just "/"

  return normalized
}

/**
 * Extracts the domain from a URL string
 * @throws {Error} If URL is invalid for page tracking
 */
export function extractDomain(urlString: string): string {
  if (!isValidPageUrl(urlString)) {
    throw new Error("Invalid URL for page tracking")
  }

  const url = new URL(
    urlString.startsWith("http") ? urlString : `https://${urlString}`
  )
  return url.hostname.replace(/^www\./, "")
}

/**
 * Extracts the path from a URL string
 * @throws {Error} If URL is invalid for page tracking
 */
export function extractPath(urlString: string): string {
  if (!isValidPageUrl(urlString)) {
    throw new Error("Invalid URL for page tracking")
  }

  const url = new URL(
    urlString.startsWith("http") ? urlString : `https://${urlString}`
  )
  return url.pathname || "/"
}
