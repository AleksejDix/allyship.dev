import fs from "fs"
import path from "path"
import { MetadataRoute } from "next"

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never"

type SitemapEntry = {
  url: string
  lastModified?: string | Date
  changeFrequency?: ChangeFrequency
  priority?: number
}

/**
 * Priority mapping for different types of content
 */
const PRIORITIES = {
  home: 1.0,
  products: 0.9,
  services: 0.9,
  blog: 0.8,
  education: 0.8,
  glossary: 0.7,
  default: 0.7,
} as const

/**
 * Protected routes that should not appear in the sitemap
 */
const PROTECTED_ROUTES = new Set(["scans", "spaces", "account"])

/**
 * Clean URL path by removing route groups and empty segments
 */
const cleanUrlPath = (urlPath: string): string => {
  return urlPath
    .split("/")
    .filter(
      (segment) =>
        !segment.startsWith("(") &&
        !segment.endsWith(")") &&
        segment !== "" &&
        !PROTECTED_ROUTES.has(segment)
    )
    .join("/")
}

/**
 * Check if a directory name represents a dynamic route
 */
const isDynamicRoute = (name: string): boolean => {
  return name.startsWith("[") && name.endsWith("]")
}

/**
 * Get priority for a given path
 */
const getPriority = (path: string): number => {
  if (path === "") return PRIORITIES.home
  const firstSegment = path.split("/")[0]
  return (
    PRIORITIES[firstSegment as keyof typeof PRIORITIES] || PRIORITIES.default
  )
}

/**
 * Ensure a date is not in the future
 */
const ensureValidDate = (date: Date): Date => {
  const now = new Date()
  return date > now ? now : date
}

/**
 * Get the last modified date for a static route
 */
const getLastModified = (route: string): Date => {
  try {
    const filePath = path.join(
      process.cwd(),
      "app",
      "(marketing)",
      route,
      "page.tsx"
    )
    if (fs.existsSync(filePath)) {
      return ensureValidDate(fs.statSync(filePath).mtime)
    }
    return new Date()
  } catch (error) {
    console.error(`Error getting last modified date for ${route}:`, error)
    return new Date()
  }
}

/**
 * Walk through directory and find all pages
 */
const getPages = (dir: string, urlPrefix: string = ""): SitemapEntry[] => {
  try {
    const baseDirectory = path.join(process.cwd(), "app", dir)
    if (!fs.existsSync(baseDirectory)) return []

    const entries: SitemapEntry[] = []
    const items = fs.readdirSync(baseDirectory)

    items.forEach((item) => {
      const itemPath = path.join(baseDirectory, item)
      const stats = fs.statSync(itemPath)

      if (stats.isDirectory()) {
        // Check if directory contains a page file
        const dirFiles = fs.readdirSync(itemPath)
        const hasPage = dirFiles.some(
          (file) => file === "page.tsx" || file === "page.mdx"
        )

        if (hasPage) {
          // Skip dynamic routes but log them
          if (isDynamicRoute(item)) {
            console.warn(
              `⚠️ Dynamic route found at /${cleanUrlPath(
                `${urlPrefix}/${item}`
              )} - This needs to be handled manually in the sitemap`
            )
            return
          }

          const cleanPath = cleanUrlPath(`${urlPrefix}/${item}`)
          if (cleanPath) {
            // Only add non-empty paths
            entries.push({
              url: `https://allyship.dev/${cleanPath}`,
              lastModified: ensureValidDate(stats.mtime),
              changeFrequency: "weekly" as const,
              priority: getPriority(cleanPath),
            })
          }
        }

        // Recursively check subdirectories
        const subDirPrefix = urlPrefix ? `${urlPrefix}/${item}` : item
        entries.push(...getPages(path.join(dir, item), subDirPrefix))
      }
    })

    return entries
  } catch (error) {
    console.error(`Error reading files from ${dir}:`, error)
    return []
  }
}

/**
 * Static routes with custom priorities and update frequencies
 */
const staticRoutes: SitemapEntry[] = [
  {
    url: "https://allyship.dev",
    lastModified: getLastModified(""),
    changeFrequency: "monthly",
    priority: PRIORITIES.home,
  },
  {
    url: "https://allyship.dev/blog",
    lastModified: getLastModified("blog"),
    changeFrequency: "daily",
    priority: PRIORITIES.blog,
  },
  {
    url: "https://allyship.dev/products",
    lastModified: getLastModified("products"),
    changeFrequency: "weekly",
    priority: PRIORITIES.products,
  },
  {
    url: "https://allyship.dev/services",
    lastModified: getLastModified("services"),
    changeFrequency: "weekly",
    priority: PRIORITIES.services,
  },
  {
    url: "https://allyship.dev/education",
    lastModified: getLastModified("education"),
    changeFrequency: "weekly",
    priority: PRIORITIES.education,
  },
  {
    url: "https://allyship.dev/glossary",
    lastModified: getLastModified("glossary"),
    changeFrequency: "weekly",
    priority: PRIORITIES.glossary,
  },
]

/**
 * Generate the sitemap by walking through the marketing directory
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Log a reminder about dynamic routes
  console.info(
    "ℹ️ Remember to handle these dynamic routes manually in your sitemap:"
  )
  console.info("- /education/courses/[...slug] (Course pages)")
  console.info("- /scans/[...id] (Scan result pages)")

  // Get all pages and remove duplicates
  const marketingPages = getPages("(marketing)")
  const allUrls = new Set(
    [...staticRoutes, ...marketingPages]
      .map((entry) => entry.url)
      .filter((url) => {
        const path = url.replace("https://allyship.dev/", "")
        return !path.split("/").some((segment) => PROTECTED_ROUTES.has(segment))
      })
  )

  return [...allUrls].map((url) => {
    const staticRoute = staticRoutes.find((route) => route.url === url)
    const marketingPage = marketingPages.find((page) => page.url === url)

    // Prefer static route configuration if available
    return (
      staticRoute ||
      marketingPage || {
        url,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: getPriority(url.replace("https://allyship.dev/", "")),
      }
    )
  })
}
