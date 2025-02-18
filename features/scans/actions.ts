"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { CreateScanParams, CreateScanResult } from "./types"

const urlSchema = z.object({
  url: z.string().url(),
  space_id: z.string().optional(),
})

type ScanInput = z.infer<typeof urlSchema>

const parseFormData = (data: FormData | { url: string; space_id?: string }): ScanInput => {
  if (data instanceof FormData) {
    const formObject = Object.fromEntries(data)
    return {
      url: String(formObject.url || ""),
      space_id: formObject.space_id ? String(formObject.space_id) : undefined,
    }
  }
  return data
}

export async function createScan(formData: FormData | { url: string; space_id?: string }) {
  const supabase = await createClient()

  try {
    // Parse and validate input
    const input = parseFormData(formData)
    const result = urlSchema.safeParse(input)

    if (!result.success) {
      console.error("[VALIDATION ERROR]", result.error.format())
      return {
        success: false,
        error: {
          message: "Invalid URL provided",
          details: result.error.format(),
        },
      }
    }

    const { url, space_id } = result.data

    // Check user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.warn("[AUTH ERROR] User not authenticated")
      return {
        success: false,
        error: {
          message: "You must be logged in to scan a website",
        },
      }
    }

    // Get or create space (use personal space if none specified)
    let targetSpaceId = space_id
    if (!targetSpaceId) {
      const { data: personalSpace, error: spaceError } = await supabase
        .from("Space")
        .select()
        .match({ owner_id: user.id, is_personal: true })
        .single()

      if (spaceError) {
        if (spaceError.code === "PGRST116") {
          // Create personal space
          const { data: newSpace, error: createSpaceError } = await supabase
            .from("Space")
            .insert({
              name: "Personal Space",
              owner_id: user.id,
              is_personal: true,
            })
            .select()
            .single()

          if (createSpaceError) {
            console.error("[DB ERROR] Failed to create personal space", createSpaceError)
            throw createSpaceError
          }
          if (!newSpace) {
            console.error("[DB ERROR] Personal space creation returned no data")
            throw new Error("Failed to create personal space")
          }
          targetSpaceId = newSpace.id
        } else {
          console.error("[DB ERROR] Failed to fetch personal space", spaceError)
          throw spaceError
        }
      } else {
        targetSpaceId = personalSpace.id
      }
    }

    // Parse URL to get website URL (hostname) and page path
    const parsedUrl = new URL(url)
    const websiteUrl = parsedUrl.origin
    const pagePath = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash

    // 1. Create or update website
    const { data: website, error: websiteError } = await supabase
      .from("Website")
      .upsert(
        {
          url: websiteUrl,
          space_id: targetSpaceId,
          user_id: user.id,
          theme: "BOTH",
        },
        { onConflict: "url,space_id" }
      )
      .select()
      .single()

    if (websiteError) {
      console.error("[DB ERROR] Failed to create website", websiteError)
      throw websiteError
    }

    if (!website) {
      console.error("[DB ERROR] Website creation returned no data")
      throw new Error("Failed to create website")
    }

    // 2. Create or update page
    const { data: page, error: pageError } = await supabase
      .from("Page")
      .upsert(
        {
          url,
          path: pagePath,
          website_id: website.id,
        },
        { onConflict: "website_id,path" }
      )
      .select()
      .single()

    if (pageError) {
      console.error("[DB ERROR] Failed to create page", pageError)
      throw pageError
    }

    if (!page) {
      console.error("[DB ERROR] Page creation returned no data")
      throw new Error("Failed to create page")
    }

    // 3. Create scan
    const { data: scan, error: scanError } = await supabase
      .from("Scan")
      .insert({
        page_id: page.id,
        status: "pending",
        metrics: {},
      })
      .select()
      .single()

    if (scanError) {
      console.error("[DB ERROR] Failed to create scan", scanError)
      throw scanError
    }

    if (!scan) {
      console.error("[DB ERROR] Scan creation returned no data")
      throw new Error("Failed to create scan")
    }

    // Trigger the edge function
    const { error: functionError } = await supabase.functions.invoke("scan", {
      body: { url, id: scan.id },
    })

    if (functionError) {
      console.error("[EDGE FUNCTION ERROR]", {
        error: functionError,
        scanId: scan.id,
        url,
      })

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
    console.error("[UNEXPECTED ERROR]", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

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
