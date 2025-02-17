// import { Domain } from "@prisma/client"

import { create } from "@/features/scans/actions"
import { PageHeader } from "@/features/websites/components/page-header"
import { Scan } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Params = {
  page_id: string
  space_id: string
  website_id: string
}

export default async function Page({ params }: { params: Params }) {
  const { page_id } = params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from("Page")
    .select(
      `
      *,
      website:Website (
        url
      )
    `
    )
    .eq("id", page_id)
    .single()

  if (!page) {
    return null
  }

  const websiteUrl = new URL(page.website.url)
  const fullUrl = `${page.website.url}${page.url}`

  return (
    <>
      <PageHeader title={page.url} description={`Page details for ${page.url}`}>
        <form
          action={async () => {
            "use server"
            await create({ url: fullUrl })
          }}
        >
          <Button type="submit">
            <Scan aria-hidden="true" className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </form>
      </PageHeader>

      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                Domain
              </div>
              <a
                href={page.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:underline"
                aria-labelledby={`${page_id}-domain-link`}
              >
                {websiteUrl.hostname}
                <span id={`${page_id}-domain-link`} className="sr-only">
                  {websiteUrl.hostname} (opens in new window)
                </span>
              </a>
            </div>

            <div className="grid gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                Path
              </div>
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:underline"
                aria-labelledby={`${page_id}-path-link`}
              >
                {page.url}
                <span id={`${page_id}-path-link`} className="sr-only">
                  {page.url} (opens in new window)
                </span>
              </a>
            </div>

            <div className="grid gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                Status
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
