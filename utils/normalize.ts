/**
 * URL Normalization Utilities
 *
 * These functions handle normalizing URLs and paths for consistent storage and comparison.
 * All functions assume valid URL input - wrap in try/catch when using with user input.
 */

/**
 * Normalizes a URL by:
 * 1. Converting to lowercase
 * 2. Removing protocol (http/https)
 * 3. Removing 'www.' prefix
 * 4. Removing trailing slashes
 * 5. Removing query parameters
 * 6. Removing hash fragments
 *
 * @example
 * normalizeUrl('HTTPS://WWW.Example.com/Path/?query=1#hash')
 * // Returns: 'example.com/path'
 */
export function normalizeUrl(url: string): string {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
  const path = urlObj.pathname.replace(/\/$/, '');
  return `${hostname}${path}`;
}

/**
 * Normalizes a URL path by:
 * 1. Converting to lowercase
 * 2. Removing trailing slashes
 * 3. Removing query parameters
 * 4. Removing hash fragments
 *
 * @example
 * normalizePath('/Blog/Post/?query=1#hash/')
 * // Returns: '/blog/post'
 */
export function normalizePath(url: string): string {
  const urlObj = new URL(url);
  return urlObj.pathname.toLowerCase().replace(/\/$/, '');
}

/**
 * Extracts and normalizes the hostname from a URL by:
 * 1. Converting to lowercase
 * 2. Removing 'www.' prefix
 *
 * @example
 * normalizeHostname('HTTPS://WWW.Example.com/path')
 * // Returns: 'example.com'
 */
export function normalizeHostname(url: string): string {
  const urlObj = new URL(url);
  return urlObj.hostname.toLowerCase().replace(/^www\./, '');
}

/**
 * Compares two URLs for hostname equality after normalization
 *
 * @example
 * compareHostnames('https://www.example.com', 'http://example.com')
 * // Returns: true
 */
export function compareHostnames(url1: string, url2: string): boolean {
  return normalizeHostname(url1) === normalizeHostname(url2);
}

/**
 * Compares two URLs for complete equality after normalization
 *
 * @example
 * compareUrls('https://www.example.com/path/', 'http://example.com/path')
 * // Returns: true
 */
export function compareUrls(url1: string, url2: string): boolean {
  return normalizeUrl(url1) === normalizeUrl(url2);
}

/**
 * Compares two paths for equality after normalization
 *
 * @example
 * comparePaths('/path/to/page/', '/Path/To/Page')
 * // Returns: true
 */
export function comparePaths(path1: string, path2: string): boolean {
  return normalizePath(path1) === normalizePath(path2);
}
