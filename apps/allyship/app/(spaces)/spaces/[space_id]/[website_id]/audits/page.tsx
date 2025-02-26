import { notFound } from "next/navigation"
import { PageHeader } from "@/features/websites/components/page-header"

import { createClient } from "@/lib/supabase/server"

type Props = {
  params: Promise<{ space_id: string; website_id: string }>
}

export default async function AuditsPage(props: Props) {
  const params = await props.params
  const { website_id } = params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("Website")
    .select()
    .eq("id", website_id)
    .single()

  // Handle not found case
  if (error || !data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audits"
        description={`View accessibility audits for ${data.url}`}
      />

      <div className="container">{/* Audit content will go here */}</div>
    </div>
  )
}
