"use server"

import { z } from "zod"
import { createServerAction } from "zsa"

import { logDebug, logError, logInfo } from "@/lib/logger"
import { prisma } from "@/lib/prisma"

const crawlSchema = z.object({
  domain_id: z.string(),
  url: z.string().url(),
})

export const crawl = createServerAction()
  .input(crawlSchema)
  .handler(async ({ input }) => {
    logInfo("Starting crawl operation", { input })
    try {
      logDebug("Validating input", { input })

      logInfo("Initiating sitemap fetch", { url: input.url })
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sitemap?url=${input.url}`
      )

      if (!response.ok) {
        logError("Sitemap fetch failed", {
          status: response.status,
          statusText: response.statusText,
          url: input.url,
          domainId: input.domain_id,
        })
        throw new Error("Failed to fetch sitemap")
      }

      const data = await response.json()
      const urls = data.sitemap
      logInfo("Sitemap fetched successfully", {
        urlCount: urls.length,
        domainId: input.domain_id,
        firstFewUrls: urls.slice(0, 3),
      })

      logDebug("Fetching existing pages", { domainId: input.domain_id })
      const existingPages = await prisma.page.findMany({
        where: {
          domain_id: input.domain_id,
        },
        select: {
          name: true,
        },
      })
      const existingPathnames = new Set(existingPages.map((p) => p.name))
      logInfo("Retrieved existing pages", {
        existingCount: existingPages.length,
        domainId: input.domain_id,
        sampleExistingPages: Array.from(existingPathnames).slice(0, 3),
      })

      logDebug("Filtering out existing URLs", {
        totalUrls: urls.length,
        existingUrls: existingPathnames.size,
      })
      const newUrls = urls.filter((url: string) => {
        const urlObj = new URL(url)
        return !existingPathnames.has(urlObj.pathname)
      })
      logInfo("Identified new URLs for creation", {
        newUrlCount: newUrls.length,
        domainId: input.domain_id,
        sampleNewUrls: newUrls.slice(0, 3),
      })

      logInfo("Beginning page creation", {
        count: newUrls.length,
        domainId: input.domain_id,
      })
      const createdPages = await Promise.all(
        newUrls.map(async (url: string) => {
          const urlObj = new URL(url)
          logDebug("Creating page", {
            pathname: urlObj.pathname,
            domainId: input.domain_id,
          })
          return prisma.page.create({
            data: {
              name: urlObj.pathname,
              domain_id: input.domain_id,
            },
          })
        })
      )
      logInfo("Pages created successfully", {
        createdCount: createdPages.length,
        domainId: input.domain_id,
        sampleCreatedPages: createdPages.slice(0, 3).map((p) => p.name),
      })

      const stats = {
        total: urls.length,
        new: createdPages.length,
        existing: urls.length - createdPages.length,
      }
      logInfo("Crawl operation completed successfully", {
        stats,
        domainId: input.domain_id,
      })

      return {
        success: true,
        data: createdPages,
        stats,
      }
    } catch (error) {
      logError("Crawl operation failed", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        input,
      })
      return {
        success: false,
        error: {
          message: "Failed to crawl website",
          status: 500,
          code: "crawl_error",
        },
      }
    }
  })
