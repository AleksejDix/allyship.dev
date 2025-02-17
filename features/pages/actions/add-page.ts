"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerAction } from "zsa"
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
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
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

    // Verify user has access to this space (RLS will handle this automatically)
    const { data: space, error: spaceError } = await supabase
      .from("Space")
      .select()
      .match({ id: spaceId })
      .single()

    if (spaceError || !space) {
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
      const { data: domain, error: domainError } = await supabase
        .from("Domain")
        .select()
        .match({ id: domainId, space_id: spaceId })
        .single()

      if (domainError || !domain) {
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
      const { data: existingPage } = await supabase
        .from("Page")
        .select()
        .match({
          website_id: domainId,
          name: parsedUrl.pathname,
        })
        .single()

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
      const { data: page, error: insertError } = await supabase
        .from("Page")
        .insert({
          name: parsedUrl.pathname,
          website_id: domainId,
        })
        .select()
        .single()

      if (insertError) {
        // Handle unique constraint violation
        if (insertError.code === "23505") {
          return {
            success: false,
            error: {
              message: "This page already exists for this domain",
              code: "DUPLICATE",
            },
          }
        }

        throw insertError
      }

      console.log("✅ Page created successfully:", page)

      // Revalidate the pages list
      revalidatePath(`/spaces/${spaceId}/${domainId}`)

      return {
        success: true,
        data: page,
      }
    } catch (error) {
      console.error("❌ Error in addPage:", error)
      return {
        success: false,
        error: {
          message: "Failed to add page",
          code: "UNKNOWN_ERROR",
        },
      }
    }
  })
