import { ThemeAwareContent } from "@/features/website/components/theme-aware-content"
import type { DomainWithRelations } from "@/features/website/types"
import { PageHeader } from "@/features/websites/components/page-header"
import { ExternalLink } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Props = {
  params: { website_id: string; space_id: string }
}

export default async function DomainsPage({ params }: Props) {
  const { website_id } = params
  const supabase = await createClient()

  const { data: domain } = (await supabase
    .from("Domain")
    .select(
      `
      id,
      name,
      created_at,
      space_id,
      theme,
      pages:Page (
        id,
        name,
        created_at,
        website_id,
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
      ),
      space:Space (
        id,
        name,
        created_at,
        user_id,
        user:User (
          id,
          first_name,
          last_name
        )
      )
    `
    )
    .eq("id", website_id)
    .single()) as { data: DomainWithRelations | null }

  if (!domain) {
    throw new Error("Domain not found")
  }

  // Get the latest scan date
  const latestScan = domain.pages
    .flatMap((page) => page.scans)
    .filter((scan) => scan.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]

  const userName = [domain.space.user.first_name, domain.space.user.last_name]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="space-y-6">
      <PageHeader
        title={domain.name}
        description={`Created by ${userName || "Unknown User"}`}
      >
        <div className="flex items-center gap-4">
          {latestScan && (
            <Badge variant="outline">
              Last scan {new Date(latestScan.created_at).toLocaleDateString()}
            </Badge>
          )}
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://${domain.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <span>Visit Site</span>
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </PageHeader>

      <div className="container">
        <ThemeAwareContent domain={domain} />
      </div>
    </div>
  )
}
