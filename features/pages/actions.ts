"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export async function getPagesByDomainId(website_id: string) {
  return prisma.page.findMany({
    where: { website_id },
  })
}

export const create = createServerAction()
  .input(
    z.object({
      name: z.string().url().min(1, "Domain name is required"),
      website_id: z.string().min(1, "Domain ID is required"),
    })
  )
  .handler(async ({ input }) => {
    // Check if domain already exists
    const existingDomain = await prisma.page.findFirst({
      where: {
        name: input.name,
        website_id: input.website_id,
      },
    })

    if (existingDomain) {
      return {
        success: false,
        error: {
          message: "Domain already exists in this space",
          status: 400,
          code: "domain_already_exists",
        },
      }
    }

    const page = await prisma.page.create({
      data: {
        name: input.name,
        website_id: input.website_id,
      },
    })

    return { success: true, data: page }
  })

const addPageUrlSchema = z.object({
  url: z.string().url(),
})

type AddPageUrlInput = z.infer<typeof addPageUrlSchema>

export async function createPageFromUrl(
  spaceId: string,
  domainId: string,
  input: AddPageUrlInput
) {
  try {
    const validatedData = addPageUrlSchema.parse(input)
    const url = new URL(validatedData.url)

    // Check if page already exists
    const existingPage = await prisma.page.findFirst({
      where: {
        website_id: domainId,
        name: validatedData.url,
      },
    })

    if (existingPage) {
      return {
        success: false,
        error: {
          message: "A page with this URL already exists",
          status: 400,
          code: "page_url_exists",
        },
      }
    }

    const page = await prisma.page.create({
      data: {
        name: url.pathname === "/" ? "Homepage" : url.pathname,
        website_id: domainId,
      },
    })

    return {
      success: true,
      data: page,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: "Invalid URL format",
          status: 400,
          code: "invalid_url_format",
        },
      }
    }

    return {
      success: false,
      error: {
        message: "Failed to create page",
        status: 500,
        code: "create_page_error",
      },
    }
  }
}

export const deletePage = createServerAction()
  .input(
    z.object({
      pageId: z.string(),
      spaceId: z.string(),
      domainId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from("Page")
      .delete()
      .eq("id", input.pageId)

    if (error) {
      return {
        success: false,
        error: {
          message: "Failed to delete page",
          code: "DELETE_FAILED",
        },
      }
    }

    revalidatePath(`/spaces/${input.spaceId}/${input.domainId}/pages`)
    redirect(`/spaces/${input.spaceId}/${input.domainId}/pages`)
  })
