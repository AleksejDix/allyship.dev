import { Button } from "@/components/ui/button"
import { useSelector } from "@xstate/react"
import { AlertCircle } from "lucide-react"

import { usePageContext } from "./page-context"

// Error state component
export function PageError() {
  const actorRef = usePageContext()
  // Only re-render when error changes
  const error = useSelector(actorRef, (state) => state.context.error)
  const isError = useSelector(actorRef, (state) => state.matches("error"))

  if (!isError || !error) {
    return null
  }

  return (
    <div className="flex h-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-destructive/10 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle
            className="h-6 w-6 text-destructive"
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-destructive">
            Error loading pages
          </h2>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-destructive/80">
            {error.message ||
              "An unexpected error occurred while loading pages."}
          </p>
          {error.code && (
            <p className="text-xs text-destructive/70">
              Error code: {error.code}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => actorRef.send({ type: "RETRY" })}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}
