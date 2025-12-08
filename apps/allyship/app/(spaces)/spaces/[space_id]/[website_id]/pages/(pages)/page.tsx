import { notFound } from 'next/navigation'
import { PageCreateDialog } from '@/features/pages/components/page-create-dialog'
import { PagesIndex } from '@/features/pages/components/pages-index'
import { PageHeader } from '@/features/websites/components/page-header'

import { createClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ website_id: string; space_id: string }>
}

async function PagesContent(props: Props) {
  const { website_id, space_id } = await props.params
  const supabase = await createClient()

  // Get pages first
  const { data: pages, error: pagesError } = await supabase
    .from('Page')
    .select('*')
    .eq('website_id', website_id)
    .order('url')

  if (!pages) {
    notFound()
  }

  // Get all schedules for pages in this website
  const pageIds = pages.map(page => page.id)
  const { data: schedules, error: schedulesError } = await supabase
    .from('ScanSchedule')
    .select('*')
    .in('page_id', pageIds)

  // Manually join the data
  const pagesWithSchedules = pages.map(page => ({
    ...page,
    ScanSchedule:
      schedules?.filter(schedule => schedule.page_id === page.id) || [],
  }))

  return (
    <div className="container space-y-6">
      <PagesIndex
        space_id={space_id}
        website_id={website_id}
        pages={pagesWithSchedules || []}
      />
    </div>
  )
}

export default async function PagesPage(props: Props) {
  const params = await props.params
  const supabase = await createClient()

  const { data: website } = await supabase
    .from('Website')
    .select()
    .eq('id', params.website_id)
    .single()

  if (!website) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description="Manage pages">
        <div className="flex items-center gap-2">
          <PageCreateDialog
            space_id={params.space_id}
            website_id={params.website_id}
          />
        </div>
      </PageHeader>

      <PagesContent params={Promise.resolve(params)} />
    </div>
  )
}
