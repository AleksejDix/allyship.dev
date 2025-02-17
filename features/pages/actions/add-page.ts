"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

const addPageSchema = z.object({
  url: z.string().url(),
  spaceId: z.string(),
  domainId: z.string(),
})

export const addPage = createServerAction()
  .input(addPageSchema)
  .handler(async ({ input }) => {
    console.log("🚀 Starting addPage server action with input:", input)

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("❌ No user found")
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      }
    }

    const { url, spaceId, domainId } = input

    // Verify user has access to this space
    const space = await prisma.space.findFirst({
      where: {
        id: spaceId,
        user_id: user.id,
      },
    })

    if (!space) {
      console.log("❌ Space not found for user:", user.id)
      return {
        success: false,
        error: {
          message: "Space not found",
          code: "NOT_FOUND",
        },
      }
    }

    try {
      console.log("🔍 Parsing URL:", url)
      const parsedUrl = new URL(url)

      // Get the domain from the database to verify it matches
      const domain = await prisma.domain.findUnique({
        where: {
          id: domainId,
          space_id: spaceId,
        },
      })

      if (!domain) {
        console.log("❌ Domain not found:", domainId)
        return {
          success: false,
          error: {
            message: "Domain not found or does not belong to this space",
            code: "NOT_FOUND",
          },
        }
      }

      console.log("🔍 Comparing domains:", {
        urlHostname: parsedUrl.hostname,
        domainName: domain.name,
      })

      // Enhanced domain validation with more specific error message
      if (parsedUrl.hostname !== domain.name) {
        return {
          success: false,
          error: {
            message: `URL must be from domain "${domain.name}". You provided a URL from "${parsedUrl.hostname}"`,
            code: "INVALID_DOMAIN",
          },
        }
      }

      // Check if page already exists
      const existingPage = await prisma.page.findUnique({
        where: {
          website_id_name: {
            website_id: domainId,
            name: parsedUrl.pathname,
          },
        },
      })

      if (existingPage) {
        console.log("❌ Page already exists:", existingPage)
        return {
          success: false,
          error: {
            message: `This page (${parsedUrl.pathname}) already exists for this domain`,
            code: "DUPLICATE",
          },
        }
      }

      console.log("✨ Creating page with pathname:", parsedUrl.pathname)
      // Create the page
      const page = await prisma.page.create({
        data: {
          name: parsedUrl.pathname,
          website_id: domainId,
        },
      })

      console.log("✅ Page created successfully:", page)

      // Revalidate the pages list
      revalidatePath(`/spaces/${spaceId}/${domainId}`)

      return {
        success: true,
        data: page,
      }
    } catch (error) {
      console.error("❌ Error in addPage:", error)

      // Handle unique constraint violation explicitly
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          success: false,
          error: {
            message: "This page already exists for this domain",
            code: "DUPLICATE",
          },
        }
      }

      return {
        success: false,
        error: {
          message: "Failed to add page",
          code: "UNKNOWN_ERROR",
        },
      }
    }
  })
