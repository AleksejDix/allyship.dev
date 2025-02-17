"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerAction } from "zsa"

import { createClient } from "@/lib/supabase/server"

import { scanJobSchema } from "./schema"

type ActionResponse =
  | {
      success: true
      data: {
        id: string
      }
    }
  | {
      success: false
      error: {
        message: string
        status: number
        code: string
      }
    }

export const create = createServerAction()
  .input(scanJobSchema)
  .handler(async ({ input }): Promise<ActionResponse> => {
    const supabase = await createClient()
    const { url, page_id } = input

    // Create the scan
    const { data: scan, error: scanError } = await supabase
      .from("Scan")
      .insert({
        page_id,
        status: "pending",
      })
      .select("id")
      .single()

    if (scanError || !scan) {
      return {
        success: false,
        error: {
          message: "Failed to create scan",
          status: 500,
          code: "create_failed",
        },
      }
    }

    // Fire and forget the scan function
    await supabase.functions.invoke("scan", {
      body: { url, id: scan.id },
    })

    revalidatePath("/", "layout")

    // Redirect immediately after scan creation
    redirect(`/scans/${scan.id}`)

    // This return is only for TypeScript - the redirect will prevent this from executing
    return {
      success: true,
      data: {
        id: scan.id,
      },
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
