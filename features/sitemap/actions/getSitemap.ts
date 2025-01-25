"use server"

import { urlSchema } from "@/features/sitemap/types"
import { createServerAction } from "zsa"

// Create the server action
// Server action to fetch the sitemap
export const getSitemap = createServerAction()
  .input(urlSchema)
  .handler(async ({ input }) => {
    try {
      console.log(input)
      // Call the /api/sitemap endpoint
      const response = await fetch(
        "http://localhost:3000/api/sitemap?url=" + input.url
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
