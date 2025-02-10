import { PageHeader } from "@/features/domain/components/page-header"
import { PageNavigation } from "@/features/pages/components/page-navigation"
import { ScanJobCreate } from "@/features/scans/components/scan-create"
import { ScanIndex } from "@/features/scans/components/scan-index"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

type Props = {
  params: { space_id: string; domain_id: string; page_id: string }
}

export default async function ScansPage({ params }: Props) {
  const { page_id, space_id, domain_id } = params
  const supabase = await createClient()

  const page = await prisma.page.findUnique({
    where: {
      id: page_id,
    },
    select: {
      id: true,
      name: true,
      domain: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!page) {
    throw new Error("Page not found")
  }

  const { data: scans } = await supabase
    .from("Scan")
    .select("*")
    .eq("page_id", page_id)
    .order("created_at", { ascending: false })

  // Transform the data to match the expected type
  const transformedScans =
    scans?.map((scan) => ({
      id: scan.id,
      url: scan.url,
      user_id: scan.user_id,
      status: scan.status,
      created_at: scan.created_at ? new Date(scan.created_at) : null,
      metrics: scan.metrics || null,
      page_id: scan.page_id,
      screenshot_light: scan.screenshot_light,
      screenshot_dark: scan.screenshot_dark,
    })) || []

  return (
    <>
      <PageNavigation
        space_id={space_id}
        domain_id={domain_id}
        page_id={page_id}
      />

      <PageHeader title="Scans" description={`Manage scans for ${page.name}`} />

      <div className="space-y-6 py-6">
        <div className="container space-y-6">
          <ScanJobCreate pageId={page_id} variant="admin" />
          <ScanIndex scans={transformedScans} />
        </div>
      </div>
    </>
  )
}
