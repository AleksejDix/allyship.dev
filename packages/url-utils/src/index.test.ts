import { describe, it, expect } from "vitest"
import {
  normalizeUrl,
  normalizeUrlString,
  extractDomain,
  extractHostname,
  extractPath,
  compareUrls,
  compareHostnames,
  compareUrlPaths,
  isValidPageUrl,
  validateUrl,
  isHomepage,
  isUrlUnderDomain,
  getDisplayUrl
} from "./index.js"

describe("URL Normalization", () => {
  it("normalizes basic URLs", () => {
    const result = normalizeUrl("https://google.com")
    expect(result).toEqual({
      hostname: "google.com",
      domain: "google.com",
      path: "/",
      full: "google.com",
      raw: "https://google.com"
    })
  })

  it("removes www prefix", () => {
    expect(normalizeUrl("https://www.google.com")).toEqual({
      hostname: "google.com",
      domain: "google.com",
      path: "/",
      full: "google.com",
      raw: "https://www.google.com"
    })
  })

  it("handles subdomains with www", () => {
    expect(normalizeUrl("https://www2.google.com")).toEqual({
      hostname: "www2.google.com",
      domain: "google.com",
      path: "/",
      full: "www2.google.com",
      raw: "https://www2.google.com"
    })
  })

  it("removes embedded www", () => {
    expect(normalizeUrl("https://app.www.google.com")).toEqual({
      hostname: "app.google.com",
      domain: "google.com",
      path: "/",
      full: "app.google.com",
      raw: "https://app.www.google.com"
    })
  })

  it("handles paths correctly", () => {
    expect(normalizeUrl("https://app.com/users/123/profile")).toEqual({
      hostname: "app.com",
      domain: "app.com",
      path: "/users/123/profile",
      full: "app.com/users/123/profile",
      raw: "https://app.com/users/123/profile"
    })
  })

  it("removes fragments by default", () => {
    expect(normalizeUrl("https://app.com/#/users/123")).toEqual({
      hostname: "app.com",
      domain: "app.com",
      path: "/",
      full: "app.com",
      raw: "https://app.com/#/users/123"
    })
  })

  it("removes query params by default", () => {
    expect(normalizeUrl("https://app.com/page?route=/users/123")).toEqual({
      hostname: "app.com",
      domain: "app.com",
      path: "/page",
      full: "app.com/page",
      raw: "https://app.com/page?route=/users/123"
    })
  })

  it("handles complex subdomains", () => {
    expect(normalizeUrl("https://a.b.c.google.com/path")).toEqual({
      hostname: "a.b.c.google.com",
      domain: "google.com",
      path: "/path",
      full: "a.b.c.google.com/path",
      raw: "https://a.b.c.google.com/path"
    })
  })

  it("handles URLs with spaces", () => {
    expect(normalizeUrl("https://google.com/path with spaces")).toEqual({
      hostname: "google.com",
      domain: "google.com",
      path: "/path%20with%20spaces",
      full: "google.com/path%20with%20spaces",
      raw: "https://google.com/path with spaces"
    })
  })

  it("handles URLs with emoji", () => {
    expect(normalizeUrl("https://google.com/path/with/emoji/🎉")).toEqual({
      hostname: "google.com",
      domain: "google.com",
      path: "/path/with/emoji/%F0%9F%8E%89",
      full: "google.com/path/with/emoji/%F0%9F%8E%89",
      raw: "https://google.com/path/with/emoji/🎉"
    })
  })

  it("handles special TLDs", () => {
    expect(normalizeUrl("https://service.gov.uk")).toEqual({
      hostname: "service.gov.uk",
      domain: "service.gov.uk",
      path: "/",
      full: "service.gov.uk",
      raw: "https://service.gov.uk"
    })
  })

  it("handles international domains", () => {
    expect(normalizeUrl("https://グーグル.jp")).toEqual({
      hostname: "xn--qcka1pmc.jp",
      domain: "xn--qcka1pmc.jp",
      path: "/",
      full: "xn--qcka1pmc.jp",
      raw: "https://グーグル.jp"
    })
  })

  it("keeps query params when requested", () => {
    const result = normalizeUrl("https://example.com?b=2&a=1", { keepQueryParams: true })
    expect(result.full).toBe("example.com?a=1&b=2")
  })

  it("removes tracking parameters even when keeping query params", () => {
    const result = normalizeUrl("https://example.com?utm_source=test&param=value", { keepQueryParams: true })
    expect(result.full).toBe("example.com?param=value")
  })
})

describe("String Normalization", () => {
  it("normalizes to string format", () => {
    expect(normalizeUrlString("https://www.google.com/path")).toBe("google.com/path")
  })

  it("keeps query params when requested", () => {
    expect(normalizeUrlString("https://example.com?a=1&b=2", true)).toBe("example.com?a=1&b=2")
  })

  it("handles invalid URLs gracefully", () => {
    expect(normalizeUrlString("not-a-url")).toBe("not-a-url")
  })
})

describe("URL Extraction", () => {
  it("extracts domain correctly", () => {
    expect(extractDomain("https://a.b.c.d.google.com")).toBe("google.com")
    expect(extractDomain("https://www3.google.com")).toBe("google.com")
    expect(extractDomain("https://app.www.google.co.uk")).toBe("google.co.uk")
  })

  it("extracts hostname correctly", () => {
    expect(extractHostname("https://www.google.com")).toBe("google.com")
    expect(extractHostname("https://www2.google.com")).toBe("www2.google.com")
    expect(extractHostname("https://app.www.google.com")).toBe("app.google.com")
  })

  it("extracts path correctly", () => {
    expect(extractPath("https://app.com/users/123/profile")).toBe("/users/123/profile")
    expect(extractPath("https://app.com/#/users/123")).toBe("/")
    expect(extractPath("https://app.com/page?route=/users/123")).toBe("/page")
    expect(extractPath("https://google.com")).toBe("/")
    expect(extractPath("https://google.com/")).toBe("/")
    expect(extractPath("https://google.com/path/")).toBe("/path")
  })
})

describe("URL Comparison", () => {
  it("compares URLs correctly", () => {
    expect(compareUrls("https://google.com", "https://www.google.com")).toBe(true)
    expect(compareUrls("https://google.com/path", "https://google.com/path?param=1")).toBe(true)
    expect(compareUrls("https://google.com/path", "https://google.com/other")).toBe(false)
  })

  it("compares hostnames correctly", () => {
    expect(compareHostnames("https://google.com", "https://www.google.com")).toBe(true)
    expect(compareHostnames("https://google.com", "https://yahoo.com")).toBe(false)
  })

  it("compares paths correctly", () => {
    expect(compareUrlPaths("/path", "/path/")).toBe(true)
    expect(compareUrlPaths("/path", "/other")).toBe(false)
    expect(compareUrlPaths(undefined, undefined)).toBe(true)
    expect(compareUrlPaths("/path", undefined)).toBe(false)
  })

  it("checks domain membership", () => {
    expect(isUrlUnderDomain("https://sub.google.com/path", "google.com")).toBe(true)
    expect(isUrlUnderDomain("https://google.com/path", "yahoo.com")).toBe(false)
  })
})

describe("URL Validation", () => {
  it("validates URLs correctly", () => {
    expect(isValidPageUrl("https://google.com")).toBe(true)
    expect(isValidPageUrl("google.com")).toBe(true)
    expect(isValidPageUrl("")).toBe(false)
    expect(isValidPageUrl("chrome://settings")).toBe(false)
    expect(isValidPageUrl("localhost")).toBe(false)
  })

  it("provides detailed validation results", () => {
    const valid = validateUrl("https://google.com")
    expect(valid.isValid).toBe(true)

    const invalid = validateUrl("")
    expect(invalid.isValid).toBe(false)
    expect(invalid.error).toBe("URL cannot be empty")
  })

  it("identifies homepages", () => {
    expect(isHomepage("https://google.com")).toBe(true)
    expect(isHomepage("https://google.com/")).toBe(true)
    expect(isHomepage("https://google.com/search")).toBe(false)
  })
})

describe("Display URLs", () => {
  it("creates display-friendly URLs", () => {
    expect(getDisplayUrl("https://example.com?param=value")).toBe("example.com?param=value")
    expect(getDisplayUrl("https://www.example.com/path")).toBe("example.com/path")
  })
})
