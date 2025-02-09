import { ScanJobCreate } from "@/features/scans/components/scan-create"
import { ScanIndex } from "@/features/scans/components/scan-index"

import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"

type Props = {
  params: { space_id: string; domain_id: string; page_id: string }
}

export default async function ScansPage({ params }: Props) {
  const { page_id } = params
  const supabase = await createClient()

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
    <div className="container py-8">
      <PageHeader heading="Page Scans" />
      <div className="space-y-8">
        <ScanJobCreate pageId={page_id} variant="admin" />
        <ScanIndex scans={transformedScans} />
      </div>
    </div>
  )
}
