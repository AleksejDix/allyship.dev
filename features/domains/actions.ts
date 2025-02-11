"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerAction } from "zsa"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { normalizeDomainName } from "@/lib/utils"

export async function getDomainsBySpaceId(spaceId: string) {
  return prisma.domain.findMany({
    where: { space_id: spaceId },
    orderBy: {
      name: "asc",
    },
  })
}

export const create = createServerAction()
  .input(
    z.object({
      name: z.string().url().min(1, "Domain name is required"),
      space_id: z.string().min(1, "Space ID is required"),
    })
  )
  .handler(async ({ input }) => {
    const normalizedDomainName = normalizeDomainName(input.name)

    // Check if domain already exists
    const existingDomain = await prisma.domain.findFirst({
      where: {
        name: normalizedDomainName,
        space_id: input.space_id,
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

    const domain = await prisma.domain.create({
      data: {
        name: normalizedDomainName,
        space_id: input.space_id,
      },
    })

    // Revalidate the domains list
    revalidatePath(`/spaces/${input.space_id}`)

    return { success: true, data: domain }
  })

export type DomainWithScreenshots = {
  id: string
  name: string
  latestScreenshots: {
    light: string | null
    dark: string | null
  } | null
}

export async function getDomainsWithLatestScreenshots(
  spaceId: string
): Promise<DomainWithScreenshots[]> {
  const supabase = await createClient()

  const { data: domains } = await supabase
    .from("Domain")
    .select(
      `
      *,
      pages:Page (
        scans:Scan (
          screenshot_light,
          screenshot_dark,
          created_at,
          status
        )
      )
    `
    )
    .eq("space_id", spaceId)
    .order("name", { ascending: true })

  // Process to get latest screenshot for each domain
  return (
    domains?.map((domain) => {
      const allScans = domain.pages.flatMap((page) => page.scans)
      const latestScan = allScans
        .filter((scan) => scan.status === "completed")
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]

      return {
        id: domain.id,
        name: domain.name,
        latestScreenshots: latestScan
          ? {
              light: latestScan.screenshot_light,
              dark: latestScan.screenshot_dark,
            }
          : null,
      }
    }) ?? []
  )
}

export const deleteDomain = createServerAction()
  .input(
    z.object({
      domainId: z.string(),
      spaceId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from("Domain")
      .delete()
      .eq("id", input.domainId)

    if (error) {
      return {
        success: false,
        error: {
          message: "Failed to delete domain",
          code: "DELETE_FAILED",
        },
      }
    }

    revalidatePath(`/spaces/${input.spaceId}`)
    redirect(`/spaces/${input.spaceId}`)
  })
