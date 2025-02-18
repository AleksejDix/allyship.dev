"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const urlSchema = z.object({
  url: z.string().url(),
})

export async function createScan(formData: FormData | { url: string }) {
  const supabase = await createClient()

  // Parse input
  const input = typeof formData === "object" && "url" in formData
    ? formData
    : Object.fromEntries(formData)

  const result = urlSchema.safeParse(input)

  if (!result.success) {
    return {
      success: false,
      error: {
        message: "Invalid URL provided",
      },
    }
  }

  const { url } = result.data

  try {
    // Get user's personal space or create one
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: {
          message: "You must be logged in to scan a website",
        },
      }
    }

    // Get or create personal space
    const { data: space, error: spaceError } = await supabase
      .from("Space")
      .select()
      .match({ owner_id: user.id, is_personal: true })
      .single()

    if (spaceError && spaceError.code === "PGRST116") {
      // Space not found, create it
      const { data: newSpace, error: createSpaceError } = await supabase
        .from("Space")
        .insert({
          name: "Personal Space",
          owner_id: user.id,
          is_personal: true,
        })
        .select()
        .single()

      if (createSpaceError) throw createSpaceError
      if (!newSpace) throw new Error("Failed to create personal space")
    }

    const userSpace = space || (await supabase.from("Space").select().match({ owner_id: user.id, is_personal: true }).single()).data

    if (!userSpace) {
      throw new Error("Failed to get or create personal space")
    }

    // Get or create website
    const websiteUrl = new URL(url).origin
    const { data: website, error: websiteError } = await supabase
      .from("Website")
      .select()
      .match({ space_id: userSpace.id, url: websiteUrl })
      .single()

    let websiteId
    if (websiteError && websiteError.code === "PGRST116") {
      // Website not found, create it
      const { data: newWebsite, error: createWebsiteError } = await supabase
        .from("Website")
        .insert({
          url: websiteUrl,
          space_id: userSpace.id,
          user_id: user.id,
          theme: "BOTH",
        })
        .select()
        .single()

      if (createWebsiteError) throw createWebsiteError
      if (!newWebsite) throw new Error("Failed to create website")
      websiteId = newWebsite.id
    } else {
      websiteId = website?.id
    }

    if (!websiteId) {
      throw new Error("Failed to get or create website")
    }

    // Get or create page
    const { data: page, error: pageError } = await supabase
      .from("Page")
      .select()
      .match({ website_id: websiteId, url })
      .single()

    let pageId
    if (pageError && pageError.code === "PGRST116") {
      // Page not found, create it
      const { data: newPage, error: createPageError } = await supabase
        .from("Page")
        .insert({
          url,
          website_id: websiteId,
        })
        .select()
        .single()

      if (createPageError) throw createPageError
      if (!newPage) throw new Error("Failed to create page")
      pageId = newPage.id
    } else {
      pageId = page?.id
    }

    if (!pageId) {
      throw new Error("Failed to get or create page")
    }

    // Create the scan record
    const { data: scan, error: scanError } = await supabase
      .from("Scan")
      .insert({
        page_id: pageId,
        status: "pending",
        metrics: {},
      })
      .select()
      .single()

    if (scanError || !scan) {
      throw new Error("Failed to create scan")
    }

    // Trigger the edge function
    const { error: functionError } = await supabase.functions.invoke("scan", {
      body: { url, id: scan.id },
    })

    if (functionError) {
      // Update scan status to failed
      await supabase
        .from("Scan")
        .update({
          status: "failed",
          metrics: {
            error: functionError.message || "Edge function failed",
          },
        })
        .eq("id", scan.id)

      return {
        success: false,
        error: {
          message: "Failed to start scan: " + functionError.message,
        },
      }
    }

    // Return success with scan ID
    revalidatePath("/", "layout")
    return {
      success: true,
      data: {
        id: scan.id,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
    }
  }
}

export async function getScan(id: string) {
  const supabase = await createClient()
  const response = await supabase.from("Scan").select().match({ id }).single()
  return response
}
