/**
 * Represents a normalized URL with its components
 */
export interface NormalizedUrl {
  /** Full hostname including subdomains (e.g., "store.google.com") */
  hostname: string
  /** Root domain without subdomains (e.g., "google.com") */
  domain: string
  /** Path without trailing slash (e.g., "/products") */
  path: string
  /** Full URL without protocol, query params, or fragments */
  full: string
  /** Original input URL as provided to the normalizeUrl function */
  raw: string
}

/**
 * Options for URL normalization
 */
export interface NormalizationOptions {
  /** Whether to keep query parameters (default: false) */
  keepQueryParams?: boolean
  /** Whether to keep fragments/hash (default: false) */
  keepFragment?: boolean
  /** Whether to remove www prefix (default: true) */
  removeWww?: boolean
  /** Whether to remove trailing slash (default: true) */
  removeTrailingSlash?: boolean
  /** Whether to sort query parameters (default: true when keeping them) */
  sortQueryParams?: boolean
}

/**
 * Result of URL validation
 */
export interface ValidationResult {
  /** Whether the URL is valid */
  isValid: boolean
  /** Error message if invalid */
  error?: string
  /** Normalized URL if valid */
  normalized?: NormalizedUrl
}

/**
 * Options for URL comparison
 */
export interface ComparisonOptions {
  /** Whether to ignore query parameters (default: true) */
  ignoreQueryParams?: boolean
  /** Whether to ignore fragments (default: true) */
  ignoreFragment?: boolean
  /** Whether to ignore case (default: true) */
  ignoreCase?: boolean
}
