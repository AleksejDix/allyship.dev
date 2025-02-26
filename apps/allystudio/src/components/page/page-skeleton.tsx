import { useSelector } from "@xstate/react"

import { usePageContext } from "./page-context"

// Loading state component that uses context to determine when to show
export function Skeleton() {
  const actor = usePageContext()
  const isLoading = useSelector(actor, (state) => state.matches("loading"))
  const hasError = useSelector(actor, (state) => state.matches("error"))

  // Only show the skeleton when loading and not in error state
  if (!isLoading || hasError) {
    return null
  }

  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div role="status" className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="mt-2 text-sm text-muted-foreground">Loading pages...</p>
      </div>
    </div>
  )
}

// Specific skeleton for the page list
export function PageListSkeleton() {
  const actor = usePageContext()
  const isLoading = useSelector(actor, (state) => state.matches("loading"))

  if (!isLoading) {
    return null
  }

  return (
    <div className="space-y-4" role="status" aria-label="Loading pages">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
        </div>
      </div>

      <ul className="space-y-4">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-1/3 bg-muted rounded animate-pulse mt-2"></div>
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse mt-2"></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
