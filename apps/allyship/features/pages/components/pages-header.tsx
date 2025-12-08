'use client'

import type { Database } from '@/apps/AllyShip/database.types'
import { PageCreateDialog } from '@/features/pages/components/page-create-dialog'

type Domain = Database['public']['Tables']['Website']['Row']

interface PagesHeaderProps {
  website: Domain
  spaceId: string
  domainId: string
}

export function PagesHeader({ website, spaceId, domainId }: PagesHeaderProps) {
  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl">Pages</h1>
      </div>
      <div className="flex items-center gap-2">
        <PageCreateDialog space_id={spaceId} website_id={domainId} />
      </div>
    </div>
  )
}
