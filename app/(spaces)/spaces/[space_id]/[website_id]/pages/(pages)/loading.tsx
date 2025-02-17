import { PageHeader } from "@/features/websites/components/page-header"

import { Skeleton } from "@/components/ui/skeleton"

export default function PagesLoading() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description="Manage pages">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </PageHeader>

      <div className="container space-y-6">
        <div className="rounded-md border">
          <div className="p-4">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[20%]" />
                  <Skeleton className="h-4 w-[20%]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
