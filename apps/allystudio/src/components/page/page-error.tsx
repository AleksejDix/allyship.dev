import { useSelector } from "@xstate/react"

import { usePageContext } from "./page-context"

// Error state component
export function PageError() {
  const actorRef = usePageContext()
  // Only re-render when error changes
  const error = useSelector(actorRef, (state) => state.context.error)

  return (
    <>
      <div className="flex h-full items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-4 rounded-lg border bg-destructive/10 p-6">
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-semibold text-destructive">{error}</h2>
            <p className="text-sm text-destructive/80">{"error"}</p>
          </div>
        </div>
      </div>
    </>
  )
}
