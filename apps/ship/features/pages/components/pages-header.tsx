'use client'

import { useState } from 'react'
import type { Database } from '@/apps/AllyShip/database.types'
import { CrawlButton } from '@/features/crawl/components/crawl-button'
import { PageCreateDialog } from '@/features/pages/components/page-create-dialog'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'

type Domain = Database['public']['Tables']['Website']['Row']

interface PagesHeaderProps {
  website: Domain
  spaceId: string
  domainId: string
}

type NotificationResult = {
  type: 'success' | 'error'
  message: string
}

export function PagesHeader({ website, spaceId, domainId }: PagesHeaderProps) {
  const [notification, setNotification] = useState<NotificationResult | null>(
    null
  )

  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl">Pages</h1>
        {notification && (
          <Alert
            variant={
              notification.type === 'success' ? 'success' : 'destructive'
            }
            role="status"
            aria-live="polite"
            className="inline-flex"
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            )}
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex items-center gap-2">
        <CrawlButton
          website_id={website.id}
          website_url={website.url}
          onCrawlComplete={setNotification}
        />
        <PageCreateDialog space_id={spaceId} website_id={domainId} />
      </div>
    </div>
  )
}
