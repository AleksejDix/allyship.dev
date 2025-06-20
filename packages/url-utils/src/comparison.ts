import { extractDomain, extractPath } from "./extraction.js"
import { normalizeUrl, normalizeUrlString, normalizePath } from "./normalization.js"
import type { ComparisonOptions } from "./types.js"

/**
 * Compares two URLs for equality
 */
export function compareUrls(
  url1: string,
  url2: string,
  options: ComparisonOptions = {}
): boolean {
  const {
    ignoreQueryParams = true,
    ignoreFragment = true,
    ignoreCase = true
  } = options

  try {
    const normalized1 = normalizeUrl(url1, {
      keepQueryParams: !ignoreQueryParams,
      keepFragment: !ignoreFragment
    })
    const normalized2 = normalizeUrl(url2, {
      keepQueryParams: !ignoreQueryParams,
      keepFragment: !ignoreFragment
    })

    const full1 = ignoreCase ? normalized1.full.toLowerCase() : normalized1.full
    const full2 = ignoreCase ? normalized2.full.toLowerCase() : normalized2.full

    return full1 === full2
  } catch {
    // Fallback comparison
    const clean1 = normalizeUrlString(url1, !ignoreQueryParams)
    const clean2 = normalizeUrlString(url2, !ignoreQueryParams)

    if (ignoreCase) {
      return clean1.toLowerCase() === clean2.toLowerCase()
    }
    return clean1 === clean2
  }
}

/**
 * Compares two hostnames for equality
 */
export function compareHostnames(url1: string, url2: string): boolean {
  try {
    return extractDomain(url1) === extractDomain(url2)
  } catch {
    return false
  }
}

/**
 * Compares two URL paths for equality
 */
export function compareUrlPaths(path1?: string, path2?: string): boolean {
  if (!path1 && !path2) return true
  if (!path1 || !path2) return false

  try {
    const normalizedPath1 = extractPath(path1)
    const normalizedPath2 = extractPath(path2)
    return normalizedPath1 === normalizedPath2
  } catch {
    // Fallback path comparison
    return normalizePath(path1) === normalizePath(path2)
  }
}

/**
 * Checks if a URL belongs to a specific domain
 */
export function isUrlUnderDomain(childUrl: string, parentDomain: string): boolean {
  try {
    const childDomain = extractDomain(childUrl)
    const normalizedParentDomain = extractDomain(parentDomain)
    return childDomain === normalizedParentDomain
  } catch {
    return false
  }
}

/**
 * Checks if a URL belongs to the same domain as another URL
 */
export function isSameDomain(url1: string, url2: string): boolean {
  return compareHostnames(url1, url2)
}
