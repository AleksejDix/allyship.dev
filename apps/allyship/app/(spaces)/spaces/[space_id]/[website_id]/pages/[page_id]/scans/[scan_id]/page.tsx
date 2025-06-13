import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDate } from '@/utils/date-formatting'
import { Badge } from '@workspace/ui/components/badge'
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'
import { RouterLink } from '@/components/RouterLink'

type Props = {
  params: Promise<{
    space_id: string
    website_id: string
    page_id: string
    scan_id: string
  }>
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return (
        <CheckCircle aria-hidden="true" size="20" className="text-green-600" />
      )
    case 'failed':
      return <XCircle aria-hidden="true" size="20" className="text-red-600" />
    case 'pending':
      return <Clock aria-hidden="true" size="20" className="text-gray-600" />
    case 'scanning':
      return (
        <AlertCircle aria-hidden="true" size="20" className="text-blue-600" />
      )
    default:
      return <Clock aria-hidden="true" size="20" className="text-gray-600" />
  }
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default'
    case 'failed':
      return 'destructive'
    case 'pending':
      return 'secondary'
    case 'scanning':
      return 'outline'
    default:
      return 'outline'
  }
}

export default async function ScanDetailPage(props: Props) {
  const params = await props.params
  const { space_id, website_id, page_id, scan_id } = params
  const supabase = await createClient()

  const { data: scan } = await supabase
    .from('Scan')
    .select('*')
    .eq('id', scan_id)
    .eq('page_id', page_id)
    .single()

  if (!scan) {
    notFound()
  }

  return (
    <div className="space-y-6 py-6">
      <div className="container space-y-6">
        <div className="flex items-center gap-4">
          <RouterLink
            href={`/spaces/${space_id}/${website_id}/pages/${page_id}/scans`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" size="16" />
            Back to Scans
          </RouterLink>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(scan.status)}
            <h1 className="text-2xl font-bold">Scan Details</h1>
            <Badge variant={getStatusBadgeVariant(scan.status)}>
              {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Page URL
                </h3>
                <p className="text-sm">{scan.url}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Created
                </h3>
                <p className="text-sm">{formatDate(scan.created_at)}</p>
              </div>

              {scan.completed_at && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Completed
                  </h3>
                  <p className="text-sm">{formatDate(scan.completed_at)}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Scan ID
                </h3>
                <p className="text-sm font-mono">{scan.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              {scan.error_message && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Error Message
                  </h3>
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                    {scan.error_message}
                  </div>
                </div>
              )}

              {scan.results && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Results
                  </h3>
                  <div className="rounded-md bg-gray-50 p-3">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(scan.results, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
