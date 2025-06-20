import { normalizeUrl } from "./normalization.js"
import type { NormalizedUrl } from "./types.js"

/**
 * Extracts the domain from a URL string (without subdomains)
 * @throws {Error} If URL is invalid for page tracking
 */
export function extractDomain(urlString: string): string {
  return normalizeUrl(urlString).domain
}

/**
 * Extracts the full hostname from a URL string (including subdomains)
 * @throws {Error} If URL is invalid for page tracking
 */
export function extractHostname(urlString: string): string {
  return normalizeUrl(urlString).hostname
}

/**
 * Extracts the path from a URL string
 * @throws {Error} If URL is invalid for page tracking
 */
export function extractPath(urlString: string): string {
  return normalizeUrl(urlString).path
}

/**
 * Creates a display-friendly version of a URL
 * Removes protocol and keeps query params for display
 */
export function getDisplayUrl(url: string): string {
  try {
    const normalized = normalizeUrl(url, { keepQueryParams: true })
    return normalized.full
  } catch {
    // Fallback for display
    return url.replace(/^https?:\/\//, "")
  }
}

/**
 * Extracts all URL components in one call
 */
export function extractUrlComponents(url: string): NormalizedUrl {
  return normalizeUrl(url)
}
