import { notFound } from "next/navigation"
import { PageHeader } from "@/features/websites/components/page-header"

import { createClient } from "@/lib/supabase/server"

type Props = {
  params: { space_id: string; website_id: string }
}

export default async function AuditsPage({ params }: Props) {
  const { website_id } = params
  const supabase = await createClient()

  // Use Supabase query instead of Prisma
  const { data: domain, error } = await supabase
    .from("Domain")
    .select("id, name")
    .eq("id", website_id)
    .single()

  // Handle not found case
  if (error || !domain) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audits"
        description={`View accessibility audits for ${domain.name}`}
      />

      <div className="container">{/* Audit content will go here */}</div>
    </div>
  )
}
