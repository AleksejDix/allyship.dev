import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSelector } from "@xstate/react"
import { ArrowLeft, ExternalLink, FileText } from "lucide-react"
import { memo } from "react"
import type { PropsWithChildren } from "react"

import { usePageContext } from "./page-context"

// Use memo to prevent unnecessary re-renders of the entire component
export const PageSelected = memo(function PageSelected({
  children
}: PropsWithChildren) {
  const actor = usePageContext()

  // Use memoized selectors for better performance with Object.is comparison
  const page = useSelector(
    actor,
    (state) => state.context.selectedPage,
    Object.is
  )

  const shouldRender = useSelector(
    actor,
    (state) => state.matches({ success: "selected" }),
    Object.is
  )

  // Only render when in the success.selected state and a page is selected
  if (!shouldRender || !page) {
    return null
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => actor.send({ type: "BACK" })}>
          <ArrowLeft size="16" aria-hidden="true" />
        </Button>
        <div className="grow">
          <h2 className="text-lg font-medium leading-5">{page.path}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Added {new Date(page.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://${page.url}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-labelledby={`visit-page-${page.id}`}>
            <span id={`visit-page-${page.id}`} className="sr-only">
              Visit {page.url} (opens in new window)
            </span>
            <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
            Visit
          </a>
        </Button>
      </div>

      {children}
    </div>
  )
})
