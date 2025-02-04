import { ScanIndex } from "@/features/scans/components/scan-index"

import { createClient } from "@/lib/supabase/server"

export default async function ScansPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("scan")
    .select("id, url, status, created_at")
    .order("created_at", { ascending: false })

  return (
    <div className="container">
      <ScanIndex scans={data ?? []} />
    </div>
  )
}
