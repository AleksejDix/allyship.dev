"use server"

import { urlSchema } from "@/features/sitemap/types"
import { createServerAction } from "zsa"

import { env } from "@/env.mjs"

// Create the server action
// Server action to fetch the sitemap
export const getSitemap = createServerAction()
  .input(urlSchema)
  .handler(async ({ input }) => {
    try {
      // Call the /api/sitemap endpoint
      const response = await fetch(
        env.NEXT_PUBLIC_APP_URL + "/api/sitemap?url=" + input.url
      )

      if (!response.ok) {
        throw new Error("Failed to fetch sitemap from API")
      }

      const data = await response.json()
      return data // Return the sitemap
    } catch (error) {
      console.error("Error in server action:", error)
      throw new Error("An error occurred while fetching the sitemap")
    }
  })
