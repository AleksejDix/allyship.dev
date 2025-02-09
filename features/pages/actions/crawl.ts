"use server"

import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"

const crawlSchema = z.object({
  domain_id: z.string(),
  url: z.string().url(),
})

export const crawl = createServerAction()
  .input(crawlSchema)
  .handler(async ({ input }) => {
    console.log({ input })
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sitemap?url=${input.url}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch sitemap")
      }

      const data = await response.json()
      const urls = data.sitemap

      // Create pages for each URL
      const createdPages = await Promise.all(
        urls.map(async (url: string) => {
          const urlObj = new URL(url)
          return prisma.page.upsert({
            where: {
              domain_id_name: {
                domain_id: input.domain_id,
                name: urlObj.pathname,
              },
            },
            update: {},
            create: {
              name: urlObj.pathname,
              domain_id: input.domain_id,
            },
          })
        })
      )

      return {
        success: true,
        data: createdPages,
      }
    } catch (error) {
      console.error("Error crawling:", error)
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
