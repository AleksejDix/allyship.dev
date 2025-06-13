import { createClient } from '@/lib/supabase/server'
import { ScansIndex } from '@/features/scans/components/scans-index'

type Props = {
  params: Promise<{ space_id: string; website_id: string; page_id: string }>
}

export default async function ScansPage(props: Props) {
  const params = await props.params
  const { space_id, website_id, page_id } = params
  const supabase = await createClient()

  const { data: scans } = await supabase
    .from('Scan')
    .select('*')
    .eq('page_id', page_id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 py-6">
      <div className="container space-y-6">
        <ScansIndex scans={scans || []} />
      </div>
    </div>
  )
}
