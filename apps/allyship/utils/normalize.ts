/**
 * @deprecated Use utils/url.ts functions instead. This file is maintained for backward compatibility.
 */

import { normalizeUrl as normalizeUrlNew, extractDomain, extractPath } from "./url"

/**
 * @deprecated Use normalizeUrl from utils/url.ts instead
 */
export function normalizeUrl(url: string): string {
  return normalizeUrlNew(url)
}

/**
 * @deprecated Use normalizeUrl from utils/url.ts instead
 */
export function normalizePath(url: string): string {
  return extractPath(url)
}

/**
 * @deprecated Use normalizeUrl from utils/url.ts instead
 */
export function normalizeHostname(url: string): string {
  return extractDomain(url)
}

/**
 * @deprecated Use functions from utils/url.ts instead
 */
export function compareHostnames(url1: string, url2: string): boolean {
  return extractDomain(url1) === extractDomain(url2)
}

/**
 * @deprecated Use functions from utils/url.ts instead
 */
export function compareUrls(url1: string, url2: string): boolean {
  return normalizeUrlNew(url1) === normalizeUrlNew(url2)
}

/**
 * @deprecated Use functions from utils/url.ts instead
 */
export function comparePaths(path1: string, path2: string): boolean {
  return extractPath(path1) === extractPath(path2)
}
