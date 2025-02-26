import { parse } from "tldts"

// Add Vitest type declaration
declare global {
  interface ImportMeta {
    readonly vitest?: typeof import("vitest")
  }
}

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
 * List of known country TLDs that use a third-level domain
 * This is not exhaustive but covers the most common ones
 */
const SPECIAL_TLDS = [
  "co.uk",
  "co.jp",
  "co.kr",
  "com.au",
  "com.br",
  "com.mx",
  "com.hk"
]

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
 * Checks if a URL is valid for page tracking
 * - Must be a valid URL
 * - Must be HTTP/HTTPS
 * - Must not be a browser-specific URL
 * - Must have a valid hostname
 */
export function isValidPageUrl(urlString: string): boolean {
  if (!urlString?.trim()) return false

  try {
    // Parse with tldts first to validate domain
    const parsed = parse(urlString, { detectIp: true })
    if (!parsed.domain || parsed.isIp) {
      return false
    }

    // Create URL object to validate format
    const url = new URL(
      urlString.startsWith("http") ? urlString : `https://${urlString}`
    )

    // Check for invalid protocols
    if (
      INVALID_URL_PROTOCOLS.some((protocol) => urlString.startsWith(protocol))
    ) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}

/**
 * Normalizes a URL with consistent rules across browsers
 *
 * Browser Compatibility:
 * - Chrome/Edge: Full support
 * - Firefox: Shows IDNs in native script
 * - Safari: May handle some Unicode characters differently
 * - Mobile: Length limitations may apply
 *
 * @throws {Error} If URL exceeds browser-specific length limits
 * @throws {Error} If URL contains invalid characters for specific browsers
 */
export function normalizeUrl(url: string): NormalizedUrl {
  const MAX_URL_LENGTH = 2048 // Common limit
  if (url.length > MAX_URL_LENGTH) {
    throw new Error("URL exceeds maximum length")
  }

  // Validate URL first
  if (!isValidPageUrl(url)) {
    throw new Error("Invalid URL")
  }

  // Add protocol if missing
  const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`

  // Parse URL
  const parsedUrl = new URL(urlWithProtocol)

  // Clean hostname (remove www and convert to punycode)
  let hostname = parsedUrl.hostname.toLowerCase()
  if (hostname.startsWith("www.")) {
    hostname = hostname.slice(4)
  } else if (hostname.includes(".www.")) {
    hostname = hostname.replace(/\.www\./g, ".")
  }

  // Get domain using tldts
  const parsed = parse(hostname)
  if (!parsed.domain) {
    throw new Error("Invalid domain")
  }

  // Clean path (normalize slashes, handle trailing slash)
  let path = parsedUrl.pathname
  if (path === "") {
    path = "/"
  } else {
    // Normalize multiple slashes
    path = path.replace(/\/{2,}/g, "/")
    // Remove trailing slash except for root path
    if (path !== "/" && path.endsWith("/")) {
      path = path.slice(0, -1)
    }
  }

  // Build full URL without protocol
  const full = hostname + (path === "/" ? "" : path)

  return {
    hostname,
    domain: parsed.domain,
    path,
    full,
    raw: url // Store the original input URL
  }
}

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
 * Normalizes a URL path for comparison
 * - Removes trailing slashes
 * - Removes duplicate slashes
 * - Decodes URI components
 * - Converts to lowercase
 */
export function normalizePath(path: string): string {
  try {
    // Decode URI components
    const decoded = decodeURIComponent(path)

    return (
      decoded
        // Convert to lowercase
        .toLowerCase()
        // Remove duplicate slashes
        .replace(/\/+/g, "/")
        // Remove trailing slash
        .replace(/\/$/, "")
        // Ensure path starts with slash
        .replace(/^([^/])/, "/$1")
    )
  } catch (error) {
    // If decoding fails, return original path normalized
    return path
      .toLowerCase()
      .replace(/\/+/g, "/")
      .replace(/\/$/, "")
      .replace(/^([^/])/, "/$1")
  }
}

/**
 * Compares two URL paths for equality after normalization
 */
export function compareUrlPaths(path1?: string, path2?: string): boolean {
  if (!path1 || !path2) return false

  // Normalize both paths
  const normalized1 = normalizePath(path1)
  const normalized2 = normalizePath(path2)

  // Simple string comparison
  return normalized1 === normalized2
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe("URL validation", () => {
    it("should validate correct URLs", () => {
      expect(isValidPageUrl("https://google.com")).toBe(true)
      expect(isValidPageUrl("http://google.com")).toBe(true)
      expect(isValidPageUrl("google.com")).toBe(true)
      expect(isValidPageUrl("store.google.com")).toBe(true)
      expect(isValidPageUrl("www.google.com")).toBe(true)
      expect(isValidPageUrl("www3.google.com")).toBe(true)
      expect(isValidPageUrl("ww1.google.com")).toBe(true)
      expect(isValidPageUrl("subdomain.www.google.com")).toBe(true)
    })

    it("should reject invalid URLs", () => {
      expect(isValidPageUrl("")).toBe(false)
      expect(isValidPageUrl("chrome://settings")).toBe(false)
      expect(isValidPageUrl("localhost")).toBe(false)
      expect(isValidPageUrl("127.0.0.1")).toBe(false)
      expect(isValidPageUrl("::1")).toBe(false)
      expect(isValidPageUrl(".com")).toBe(false)
      expect(isValidPageUrl("http://.com")).toBe(false)
      expect(isValidPageUrl("http://..com")).toBe(false)
    })
  })

  describe("URL normalization", () => {
    it("should handle basic URLs", () => {
      const result = normalizeUrl("https://google.com")
      expect(result).toEqual({
        hostname: "google.com",
        domain: "google.com",
        path: "/",
        full: "google.com",
        raw: "https://google.com"
      })
    })

    it("should handle various www prefixes", () => {
      // Standard www
      expect(normalizeUrl("https://www.google.com")).toEqual({
        hostname: "google.com",
        domain: "google.com",
        path: "/",
        full: "google.com",
        raw: "https://www.google.com"
      })

      // Numbered www
      expect(normalizeUrl("https://www2.google.com")).toEqual({
        hostname: "www2.google.com",
        domain: "google.com",
        path: "/",
        full: "www2.google.com",
        raw: "https://www2.google.com"
      })

      // www with subdomain
      expect(normalizeUrl("https://app.www.google.com")).toEqual({
        hostname: "app.google.com",
        domain: "google.com",
        path: "/",
        full: "app.google.com",
        raw: "https://app.www.google.com"
      })
    })

    it("should handle SPA routes", () => {
      // React-style routes
      expect(normalizeUrl("https://app.com/users/123/profile")).toEqual({
        hostname: "app.com",
        domain: "app.com",
        path: "/users/123/profile",
        full: "app.com/users/123/profile",
        raw: "https://app.com/users/123/profile"
      })

      // Hash-based routes
      expect(normalizeUrl("https://app.com/#/users/123")).toEqual({
        hostname: "app.com",
        domain: "app.com",
        path: "/",
        full: "app.com",
        raw: "https://app.com/#/users/123"
      })

      // Query param routes
      expect(normalizeUrl("https://app.com/page?route=/users/123")).toEqual({
        hostname: "app.com",
        domain: "app.com",
        path: "/page",
        full: "app.com/page",
        raw: "https://app.com/page?route=/users/123"
      })
    })

    it("should handle multiple subdomains", () => {
      expect(normalizeUrl("https://a.b.c.google.com/path")).toEqual({
        hostname: "a.b.c.google.com",
        domain: "google.com",
        path: "/path",
        full: "a.b.c.google.com/path",
        raw: "https://a.b.c.google.com/path"
      })
    })

    it("should handle paths with special characters", () => {
      expect(normalizeUrl("https://google.com/path with spaces")).toEqual({
        hostname: "google.com",
        domain: "google.com",
        path: "/path%20with%20spaces",
        full: "google.com/path%20with%20spaces",
        raw: "https://google.com/path with spaces"
      })

      expect(normalizeUrl("https://google.com/path/with/emoji/🎉")).toEqual({
        hostname: "google.com",
        domain: "google.com",
        path: "/path/with/emoji/%F0%9F%8E%89",
        full: "google.com/path/with/emoji/%F0%9F%8E%89",
        raw: "https://google.com/path/with/emoji/🎉"
      })
    })

    it("should handle complex country TLDs", () => {
      // UK government domain
      expect(normalizeUrl("https://service.gov.uk")).toEqual({
        hostname: "service.gov.uk",
        domain: "service.gov.uk",
        path: "/",
        full: "service.gov.uk",
        raw: "https://service.gov.uk"
      })

      // Japanese prefecture domain
      expect(normalizeUrl("https://city.tokyo.jp")).toEqual({
        hostname: "city.tokyo.jp",
        domain: "city.tokyo.jp",
        path: "/",
        full: "city.tokyo.jp",
        raw: "https://city.tokyo.jp"
      })

      // Australian education domain
      expect(normalizeUrl("https://school.edu.au")).toEqual({
        hostname: "school.edu.au",
        domain: "school.edu.au",
        path: "/",
        full: "school.edu.au",
        raw: "https://school.edu.au"
      })
    })

    it("should handle internationalized domain names (IDNs)", () => {
      // Japanese domains
      expect(normalizeUrl("https://グーグル.jp")).toEqual({
        hostname: "xn--qcka1pmc.jp",
        domain: "xn--qcka1pmc.jp",
        path: "/",
        full: "xn--qcka1pmc.jp",
        raw: "https://グーグル.jp"
      })

      expect(normalizeUrl("https://日本.jp")).toEqual({
        hostname: "xn--wgv71a.jp",
        domain: "xn--wgv71a.jp",
        path: "/",
        full: "xn--wgv71a.jp",
        raw: "https://日本.jp"
      })

      // Russian domains
      expect(normalizeUrl("https://яндекс.рф")).toEqual({
        hostname: "xn--d1acpjx3f.xn--p1ai",
        domain: "xn--d1acpjx3f.xn--p1ai",
        path: "/",
        full: "xn--d1acpjx3f.xn--p1ai",
        raw: "https://яндекс.рф"
      })

      expect(normalizeUrl("https://мир.рф/путь")).toEqual({
        hostname: "xn--h1ahn.xn--p1ai",
        domain: "xn--h1ahn.xn--p1ai",
        path: "/%D0%BF%D1%83%D1%82%D1%8C",
        full: "xn--h1ahn.xn--p1ai/%D0%BF%D1%83%D1%82%D1%8C",
        raw: "https://мир.рф/путь"
      })

      // Mixed IDN with Latin subdomains
      expect(normalizeUrl("https://store.グーグル.jp")).toEqual({
        hostname: "store.xn--qcka1pmc.jp",
        domain: "xn--qcka1pmc.jp",
        path: "/",
        full: "store.xn--qcka1pmc.jp",
        raw: "https://store.グーグル.jp"
      })
    })

    it("should handle IDN paths and query parameters", () => {
      // Japanese path
      expect(normalizeUrl("https://example.com/商品/新着")).toEqual({
        hostname: "example.com",
        domain: "example.com",
        path: "/%E5%95%86%E5%93%81/%E6%96%B0%E7%9D%80",
        full: "example.com/%E5%95%86%E5%93%81/%E6%96%B0%E7%9D%80",
        raw: "https://example.com/商品/新着"
      })

      // Russian path
      expect(normalizeUrl("https://example.com/каталог/книги")).toEqual({
        hostname: "example.com",
        domain: "example.com",
        path: "/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%BA%D0%BD%D0%B8%D0%B3%D0%B8",
        full: "example.com/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%BA%D0%BD%D0%B8%D0%B3%D0%B8",
        raw: "https://example.com/каталог/книги"
      })
    })
  })

  describe("URL extraction helpers", () => {
    it("should extract domain from complex URLs", () => {
      expect(extractDomain("https://a.b.c.d.google.com")).toBe("google.com")
      expect(extractDomain("https://www3.google.com")).toBe("google.com")
      expect(extractDomain("https://app.www.google.co.uk")).toBe("google.co.uk")
      expect(extractDomain("https://my.app.tokyo.jp")).toBe("app.tokyo.jp")
    })

    it("should extract hostname with various www prefixes", () => {
      expect(extractHostname("https://www.google.com")).toBe("google.com")
      expect(extractHostname("https://www2.google.com")).toBe("www2.google.com")
      expect(extractHostname("https://www-dev.google.com")).toBe(
        "www-dev.google.com"
      )
      expect(extractHostname("https://app.www.google.com")).toBe(
        "app.google.com"
      )
    })

    it("should extract path from SPA routes", () => {
      expect(extractPath("https://app.com/users/123/profile")).toBe(
        "/users/123/profile"
      )
      expect(extractPath("https://app.com/#/users/123")).toBe("/")
      expect(extractPath("https://app.com/page?route=/users/123")).toBe("/page")
      expect(
        extractPath("https://app.com/path//with///multiple////slashes")
      ).toBe("/path/with/multiple/slashes")
    })

    it("should extract domain", () => {
      expect(extractDomain("https://www.store.google.com")).toBe("google.com")
      expect(extractDomain("https://google.com")).toBe("google.com")
      expect(extractDomain("google.co.uk")).toBe("google.co.uk")
    })

    it("should extract hostname", () => {
      expect(extractHostname("https://www.store.google.com")).toBe(
        "store.google.com"
      )
      expect(extractHostname("https://google.com")).toBe("google.com")
      expect(extractHostname("store.google.co.uk")).toBe("store.google.co.uk")
    })

    it("should extract path", () => {
      expect(extractPath("https://google.com")).toBe("/")
      expect(extractPath("https://google.com/")).toBe("/")
      expect(extractPath("https://google.com/path/")).toBe("/path")
      expect(extractPath("https://google.com/path/to/page")).toBe(
        "/path/to/page"
      )
    })

    it("should extract domain from IDN URLs", () => {
      expect(extractDomain("https://www.グーグル.jp")).toBe("xn--qcka1pmc.jp")
      expect(extractDomain("https://store.яндекс.рф")).toBe(
        "xn--d1acpjx3f.xn--p1ai"
      )
      expect(extractDomain("https://www.書店.jp")).toBe("xn--hxt89p.jp")
    })

    it("should extract hostname from IDN URLs", () => {
      expect(extractHostname("https://www.グーグル.jp")).toBe("xn--qcka1pmc.jp")
      expect(extractHostname("https://store.яндекс.рф")).toBe(
        "store.xn--d1acpjx3f.xn--p1ai"
      )
      expect(extractHostname("https://news.書店.jp")).toBe("news.xn--hxt89p.jp")
    })

    it("should extract path from IDN URLs", () => {
      expect(extractPath("https://example.com/商品/新着")).toBe(
        "/%E5%95%86%E5%93%81/%E6%96%B0%E7%9D%80"
      )
      expect(extractPath("https://example.com/каталог/книги")).toBe(
        "/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%BA%D0%BD%D0%B8%D0%B3%D0%B8"
      )
    })

    it("should throw on invalid URLs", () => {
      expect(() => extractDomain("")).toThrow()
      expect(() => extractHostname("chrome://settings")).toThrow()
      expect(() => extractPath("localhost")).toThrow()
    })
  })

  describe("normalizePath", () => {
    it("removes trailing slashes", () => {
      expect(normalizePath("/path/")).toBe("/path")
      expect(normalizePath("/path///")).toBe("/path")
    })

    it("removes duplicate slashes", () => {
      expect(normalizePath("//path")).toBe("/path")
      expect(normalizePath("/path//subpath")).toBe("/path/subpath")
    })

    it("decodes URI components", () => {
      expect(normalizePath("/%C3%BCber")).toBe("/über")
      expect(normalizePath("/caf%C3%A9")).toBe("/café")
    })

    it("converts to lowercase", () => {
      expect(normalizePath("/Path")).toBe("/path")
      expect(normalizePath("/PATH/SubPath")).toBe("/path/subpath")
    })

    it("ensures path starts with slash", () => {
      expect(normalizePath("path")).toBe("/path")
      expect(normalizePath("path/subpath")).toBe("/path/subpath")
    })

    it("handles empty and root paths", () => {
      expect(normalizePath("")).toBe("")
      expect(normalizePath("/")).toBe("")
    })
  })

  describe("compareUrlPaths", () => {
    it("compares paths ignoring trailing slashes", () => {
      expect(compareUrlPaths("/path", "/path/")).toBe(true)
      expect(compareUrlPaths("/path///", "/path")).toBe(true)
    })

    it("compares paths ignoring case", () => {
      expect(compareUrlPaths("/Path", "/path")).toBe(true)
      expect(compareUrlPaths("/PATH/subpath", "/path/SubPath")).toBe(true)
    })

    it("compares encoded and decoded paths", () => {
      expect(compareUrlPaths("/%C3%BCber", "/über")).toBe(true)
      expect(compareUrlPaths("/caf%C3%A9", "/café")).toBe(true)
    })

    it("returns false for undefined paths", () => {
      expect(compareUrlPaths(undefined, "/path")).toBe(false)
      expect(compareUrlPaths("/path", undefined)).toBe(false)
      expect(compareUrlPaths(undefined, undefined)).toBe(false)
    })
  })
}
