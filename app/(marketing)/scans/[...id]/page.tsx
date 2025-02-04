// import { getScan } from "@/features/scans/actions"
// import { TestEngine } from "@/features/scans/components/test-engine"
import { ScanShow } from "@/features/scans/components/scan-show"

import { createClient } from "@/lib/supabase/server"

export const revalidate = 0

export default async function ScanPage({ params }: { params: { id: string } }) {
  const [id] = await params.id
  const supabase = await createClient()
  const { data } = await supabase.from("scan").select().match({ id }).single()

  return <ScanShow serverProps={data} />
}
