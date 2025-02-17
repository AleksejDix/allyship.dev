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

    // Trigger the edge function
    await supabase.functions.invoke("scan", {
      body: { url, id: scan.id },
    })

    // Revalidate and redirect
    revalidatePath("/", "layout")
    redirect(`/scans/${scan.id}`)
  })

export const getScan = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const { id } = input
    const response = await supabase.from("Scan").select().match({ id }).single()
    return response
  })
