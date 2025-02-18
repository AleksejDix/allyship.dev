"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerAction } from "zsa"

import { createClient } from "@/lib/supabase/server"

import { scanJobSchema } from "./schema"

export const create = createServerAction()
  .input(scanJobSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const { url, page_id } = input

    // Create the scan record
    const { data: scan, error: scanError } = await supabase
      .from("Scan")
      .insert({
        page_id,
        status: "pending",
        metrics: {},
      })
      .select("id")
      .single()

    if (scanError || !scan) {
      throw new Error("Failed to create scan")
    }

    try {
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
              error: functionError.message || "Edge function failed"
            }
          })
          .eq("id", scan.id)

        throw new Error("Failed to start scan: " + functionError.message)
      }

      // Revalidate and redirect
      revalidatePath("/", "layout")
      redirect(`/scans/${scan.id}`)
    } catch (error) {
      // Update scan status to failed if not already done
      await supabase
        .from("Scan")
        .update({
          status: "failed",
          metrics: {
            error: error instanceof Error ? error.message : "Unknown error occurred"
          }
        })
        .eq("id", scan.id)

      throw error
    }
  })

export const getScan = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const { id } = input
    const response = await supabase.from("Scan").select().match({ id }).single()
    return response
  })
