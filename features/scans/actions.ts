"use server"

import { revalidatePath } from "next/cache"
import { isAuthApiError } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { createServerAction } from "zsa"
import { scanJobSchema } from "./schema"
import { redirect } from "next/navigation"
import { z } from "zod"

export const create = createServerAction()
  .input(scanJobSchema)
  .handler(async ({ input }) => {

    const supabase = await createClient()

    const { url } = input

    const { data: { user } } = await supabase.auth.getUser()

    // if redirect to login
    if (!user) {
      return {
        success: false,
        error: {
          message: "You must be logged in to scan a website",
          status: 401,
          code: "unauthorized",
        },
      }
    }

    // upsert to supabase scan table
    const { data, error } = await supabase.from("scan").insert([
      { url, user_id: user?.id, status: "pending" },
    ]).select("id").single()

    if (error) {
      if (isAuthApiError(error)) {
        const { message, code, status } = error
        return {
          success: false,
          error: {
            message,
            status,
            code,
          },
        }
      }
      return {
        success: false,
        error: {
          message: "Something went wrong",
          status: 500,
          code: "unknown_error",
        },
      }
    }


    // if no id, return error
    if (!data.id) {
      return {
        success: false,
        error: {
          message: "Something went wrong",
          status: 500,
          code: "unknown_error",
        },
      }
    }


    supabase.functions.invoke("scan", {
      body: { url, id: data.id }
    });


    revalidatePath("/", "layout") // Revalidate the layout to reflect changes
    redirect("/scans/" + data.id)
  })

export const getScan = createServerAction().input(z.object({ id: z.string() })).handler(async ({ input }) => {
  const supabase = await createClient()
  const { id } = input
  const response = await supabase.from("scan").select().match({ id }).single()
  return response
})
