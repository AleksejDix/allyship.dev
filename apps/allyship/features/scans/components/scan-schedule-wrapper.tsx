import { createClient } from '@/lib/supabase/server'
import { ScanScheduleSettings } from './scan-schedule-settings'

interface Props {
  pageId: string
}

export async function ScanScheduleWrapper({ pageId }: Props) {
  const supabase = await createClient()

  // Fetch current scan schedule for this page
  const { data: schedule } = await supabase
    .from('ScanSchedule')
    .select('*')
    .eq('page_id', pageId)
    .single()

  return (
    <ScanScheduleSettings
      pageId={pageId}
      currentSchedule={schedule || undefined}
    />
  )
}
