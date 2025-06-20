// Types
export type {
  NormalizedUrl,
  NormalizationOptions,
  ValidationResult,
  ComparisonOptions
} from "./types.js"

// Constants
export {
  INVALID_URL_PROTOCOLS,
  SPECIAL_TLDS,
  MAX_URL_LENGTH,
  NON_HTML_EXTENSIONS,
  TRACKING_PARAMS
} from "./constants.js"

// Validation functions
export {
  isValidPageUrl,
  validateUrl,
  isNonHtmlUrl,
  isHomepage,
  shouldSkipUrl
} from "./validation.js"

// Normalization functions
export {
  normalizeUrl,
  normalizeUrlString,
  normalizePath,
  normalizeUrlForCrawling
} from "./normalization.js"

// Extraction functions
export {
  extractDomain,
  extractHostname,
  extractPath,
  getDisplayUrl,
  extractUrlComponents
} from "./extraction.js"

// Comparison functions
export {
  compareUrls,
  compareHostnames,
  compareUrlPaths,
  isUrlUnderDomain,
  isSameDomain
} from "./comparison.js"
