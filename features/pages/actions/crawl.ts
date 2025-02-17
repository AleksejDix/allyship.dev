"use server"

import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"

const crawlSchema = z.object({
  website_id: z.string(),
  url: z.string().url(),
})

export const crawl = createServerAction()
  .input(crawlSchema)
  .handler(async ({ input }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sitemap?url=${input.url}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch sitemap")
      }

      const data = await response.json()
      const urls = data.sitemap

      const existingPages = await prisma.page.findMany({
        where: {
          website_id: input.website_id,
        },
        select: {
          name: true,
        },
      })
      const existingPathnames = new Set(existingPages.map((p) => p.name))

      const newUrls = urls.filter((url: string) => {
        const urlObj = new URL(url)
        return !existingPathnames.has(urlObj.pathname)
      })

      const createdPages = await Promise.all(
        newUrls.map(async (url: string) => {
          const urlObj = new URL(url)
          return prisma.page.create({
            data: {
              name: urlObj.pathname,
              website_id: input.website_id,
            },
          })
        })
      )

      const stats = {
        total: urls.length,
        new: createdPages.length,
        existing: urls.length - createdPages.length,
      }

      return {
        success: true,
        data: createdPages,
        stats,
      }
    } catch {
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
