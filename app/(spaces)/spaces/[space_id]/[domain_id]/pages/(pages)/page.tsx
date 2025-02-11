import type { Database } from "@/database.types"
import { PageHeader } from "@/features/domain/components/page-header"
import { AddPageDialog } from "@/features/pages/components/add-page-dialog"
import { CrawlButton } from "@/features/pages/components/crawl-button"
import { PagesIndex } from "@/features/pages/components/pages-index"

import { createClient } from "@/lib/supabase/server"

type Props = {
  params: { domain_id: string; space_id: string }
}

export default async function PagesPage({ params }: Props) {
  const { domain_id, space_id } = params
  const supabase = await createClient()

  const { data: domain } = (await supabase
    .from("Domain")
    .select()
    .eq("id", domain_id)
    .single()) as { data: Database["public"]["Tables"]["Domain"]["Row"] | null }

  if (!domain) {
    throw new Error("Domain not found")
  }

  const { data: pages } = await supabase
    .from("Page")
    .select(
      `
      *,
      domain:Domain (*),
      scans:Scan (
        id,
        created_at,
        status,
        metrics,
        screenshot_light,
        screenshot_dark,
        url,
        user_id,
        page_id
      )
    `
    )
    .eq("domain_id", domain_id)
    .order("name")

  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description={`Manage pages for ${domain.name}`}>
        <div className="flex items-center gap-2">
          <CrawlButton domain={domain} />
          <AddPageDialog
            spaceId={space_id}
            domainId={domain_id}
            domain={domain}
          />
        </div>
      </PageHeader>

      <div className="container space-y-6">
        <PagesIndex
          spaceId={space_id}
          domainId={domain_id}
          pages={pages || []}
        />
      </div>
    </div>
  )
}
