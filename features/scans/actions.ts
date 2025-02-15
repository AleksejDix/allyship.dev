"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"
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
    const { url } = input

    const {
      data: { user },
    } = await supabase.auth.getUser()

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

    const websiteUrl = new URL(url)

    const space = await prisma.space.findFirst({
      where: {
        user_id: user.id,
      },
    })

    if (!space) {
      return {
        success: false,
        error: {
          message: "You must be in a space to scan a website",
          status: 401,
          code: "unauthorized",
        },
      }
    }

    const domain = await prisma.domain.upsert({
      where: {
        space_id_name: {
          space_id: space.id,
          name: websiteUrl.hostname,
        },
      },
      update: {}, // No updates needed if it exists
      create: {
        name: websiteUrl.hostname,
        space_id: space.id,
      },
    })

    if (!domain) {
      return {
        success: false,
        error: {
          message: "Domain not found",
          status: 401,
          code: "unauthorized",
        },
      }
    }

    const page = await prisma.page.upsert({
      where: {
        domain_id_name: {
          domain_id: domain.id,
          name: websiteUrl.pathname,
        },
      },
      update: {},
      create: {
        domain_id: domain.id,
        name: websiteUrl.pathname,
      },
    })

    const scan = await prisma.scan.create({
      data: {
        url,
        user_id: user.id,
        status: "pending",
        page_id: page.id,
      },
      select: {
        id: true,
      },
    })

    if (!scan.id) {
      return {
        success: false,
        error: {
          message: "Something went wrong",
          status: 500,
          code: "unknown_error",
        },
      }
    }

    // Fire and forget the scan function
    supabase.functions.invoke("scan", {
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
