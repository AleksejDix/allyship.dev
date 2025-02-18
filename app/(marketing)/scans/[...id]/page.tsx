// import { getScan } from "@/features/scans/actions"
// import { TestEngine } from "@/features/scans/components/test-engine"
import { notFound } from "next/navigation"
import { ScanShow } from "@/features/scans/components/scan-show"

import { createClient } from "@/lib/supabase/server"

export const revalidate = 0

export default async function ScanPage(
  props: {
    params: Promise<{ id: string[] }>
  }
) {
  const params = await props.params;
  const [id] = params.id
  const supabase = await createClient()

  // Fetch scan with related page and website data
  const { data: scan, error } = await supabase
    .from("Scan")
    .select(
      `
      *,
      page:Page (
        *,
        website:Website (
          *,
          space:Space (*)
        )
      )
    `
    )
    .match({ id })
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return notFound()
    }
    throw error
  }

  if (!scan) {
    return notFound()
  }

  return <ScanShow serverProps={scan} />
}
