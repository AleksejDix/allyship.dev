import { notFound } from "next/navigation"
import { PageHeader } from "@/features/websites/components/page-header"
import { ExternalLink } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  params: Promise<{ website_id: string; space_id: string }>
}

export default async function WebsitePage(props: Props) {
  const params = await props.params;
  const { website_id } = params
  const supabase = await createClient()

  const { data: website } = await supabase
    .from("Website")
    .select()
    .eq("id", website_id)
    .single()

  if (!website) {
    notFound()
  }

  return (
    <>
      <PageHeader
        title={new URL(website.url).hostname}
        description={`Created ${new Date(website.created_at).toLocaleDateString()}`}
      >
        <Button variant="outline" size="sm" asChild>
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <span>Visit Site</span>
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
        </Button>
      </PageHeader>

      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Website Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <div className="text-sm font-medium">URL</div>
              <div className="text-sm text-muted-foreground">{website.url}</div>
            </div>
            <div className="grid gap-1">
              <div className="text-sm font-medium">Theme</div>
              <div className="text-sm text-muted-foreground">
                <Badge variant="outline">{website.theme.toLowerCase()}</Badge>
              </div>
            </div>
            <div className="grid gap-1">
              <div className="text-sm font-medium">Created</div>
              <div className="text-sm text-muted-foreground">
                {new Date(website.created_at).toLocaleString()}
              </div>
            </div>
            <div className="grid gap-1">
              <div className="text-sm font-medium">Last Updated</div>
              <div className="text-sm text-muted-foreground">
                {new Date(website.updated_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
