import { type Metadata } from "next"
import { PageHeader } from "@/features/domain/components/page-header"
import { PageDelete } from "@/features/pages/components/page-delete"

import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Delete Page",
  description: "Delete this page and all of its data",
}

interface Props {
  params: {
    page_id: string
    space_id: string
    domain_id: string
  }
}

export default async function DeletePage({ params }: Props) {
  const { page_id, space_id, domain_id } = params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from("Page")
    .select()
    .eq("id", page_id)
    .single()

  if (!page) {
    return null
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delete Page"
        description="Permanently delete this page and all of its data"
      />
      <PageDelete page={page} spaceId={space_id} domainId={domain_id} />
    </div>
  )
}
