import { notFound } from 'next/navigation'
import { createScan } from '@/features/scans/actions'
import { PageHeader } from '@/features/websites/components/page-header'
import { ScansIndex } from '@/features/scans/components/scans-index'
import { Scan as ScanIcon } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'

type Props = {
  params: Promise<{
    page_id: string
    space_id: string
    website_id: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const { page_id } = await params
  const supabase = await createClient()

  // Fetch page with related website data
  const { data: page, error } = await supabase
    .from('Page')
    .select(
      `
      *,
      website:Website (
        *,
        space:Space (*)
      )
    `
    )
    .match({ id: params.page_id })
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return notFound()
    }
    throw error
  }

  // Get last 10 scans for this page
  const { data: scans } = await supabase
    .from('Scan')
    .select('*')
    .eq('page_id', page_id)
    .order('created_at', { ascending: false })
    .limit(10)

  const fullUrl = page.url
  console.log(fullUrl)

  async function createNewScan() {
    'use server'
    if (!page) return
    await createScan({ url: page.url, space_id: page.website.space_id })
  }

  return (
    <>
      <PageHeader title={page.url} description={`Page details for ${page.url}`}>
        <form action={createNewScan}>
          <Button type="submit">
            <ScanIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </form>
      </PageHeader>

      <div className="container py-6 space-y-6">
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
                {fullUrl.hostname}
                <span id={`${page_id}-domain-link`} className="sr-only">
                  {JSON.stringify(fullUrl)} (opens in new window)
                </span>
              </a>
            </div>

            <div className="grid gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                Path
              </div>
              <a
                href={fullUrl.toString()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:underline"
                aria-labelledby={`${page_id}-path-link`}
              >
                {fullUrl.pathname}
                <span id={`${page_id}-path-link`} className="sr-only">
                  {fullUrl.toString()} (opens in new window)
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Scans</h2>
            <p className="text-sm text-muted-foreground">
              Last 10 scans for this page
            </p>
          </div>

          <ScansIndex scans={scans || []} />
        </div>
      </div>
    </>
  )
}
