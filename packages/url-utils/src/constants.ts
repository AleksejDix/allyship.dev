/**
 * List of invalid URL protocols for web page tracking
 */
export const INVALID_URL_PROTOCOLS = [
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
  "view-source:",
  "moz-extension:",
  "ms-browser-extension:",
  "webkit:",
] as const

/**
 * List of known country TLDs that use a third-level domain
 * This is not exhaustive but covers the most common ones
 */
export const SPECIAL_TLDS = [
  "co.uk",
  "co.jp",
  "co.kr",
  "com.au",
  "com.br",
  "com.mx",
  "com.hk",
  "co.nz",
  "co.za",
  "co.in",
  "org.uk",
  "net.au",
  "gov.uk",
  "edu.au",
] as const

/**
 * Maximum URL length supported by most browsers
 */
export const MAX_URL_LENGTH = 2048

/**
 * File extensions that should not be crawled
 */
export const NON_HTML_EXTENSIONS = [
  "jpg", "jpeg", "png", "gif", "webp", "svg", "ico",
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "zip", "rar", "tar", "gz", "7z",
  "mp3", "mp4", "avi", "mov", "wmv", "flv",
  "exe", "dmg", "pkg", "deb", "rpm",
  "json", "xml", "csv", "txt", "log",
  "css", "js", "woff", "woff2", "ttf", "eot",
] as const

/**
 * Common tracking parameters to remove
 */
export const TRACKING_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "fbclid", "gclid", "msclkid", "twclid",
  "ref", "referrer", "source",
  "_ga", "_gl", "_hsenc", "_hsmi",
  "mc_cid", "mc_eid",
] as const
