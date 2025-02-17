import { Suspense } from "react"
import { notFound } from "next/navigation"
import { CrawlButton } from "@/features/crawl/components/crawl-button"
import { PageCreateDialog } from "@/features/pages/components/page-create-dialog"
import { PagesIndex } from "@/features/pages/components/pages-index"
import { PageHeader } from "@/features/websites/components/page-header"

import { createClient } from "@/lib/supabase/server"

type Props = {
  params: { website_id: string; space_id: string }
}

async function PagesContent({ params }: Props) {
  const { website_id, space_id } = params
  const supabase = await createClient()

  const { data: pages } = await supabase
    .from("Page")
    .select()
    .eq("website_id", website_id)
    .order("url")

  if (!pages) {
    notFound()
  }

  return (
    <div className="container space-y-6">
      <PagesIndex space_id={space_id} website_id={website_id} pages={pages} />
    </div>
  )
}

export default async function PagesPage({ params }: Props) {
  const supabase = await createClient()

  const { data: website } = await supabase
    .from("Website")
    .select()
    .eq("id", params.website_id)
    .single()

  if (!website) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description="Manage pages">
        <div className="flex items-center gap-2">
          <CrawlButton
            website_id={params.website_id}
            website_url={website.url}
          />
          <PageCreateDialog
            space_id={params.space_id}
            website_id={params.website_id}
          />
        </div>
      </PageHeader>

      <PagesContent params={params} />
    </div>
  )
}
