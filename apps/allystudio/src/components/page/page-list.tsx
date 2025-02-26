import { Button } from "@/components/ui/button"
import { useSelector } from "@xstate/react"
import { ExternalLink, Plus } from "lucide-react"

import { usePageContext } from "./page-context"

// Component that displays the list of pages
export function PageList() {
  const actor = usePageContext()
  const isSuccess = useSelector(actor, (state) =>
    state.matches({ success: "list" })
  )
  const hasPages = useSelector(actor, (state) => state.context.pages.length > 0)
  const pages = useSelector(actor, (state) => state.context.pages)

  // Only show when in success.list state and there are pages
  if (!isSuccess || !hasPages) {
    return null
  }

  // Handle page selection
  const handleSelectPage = (pageId: string) => {
    actor.send({ type: "SELECT_PAGE", pageId })
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-lg font-medium">Pages</h2>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {pages.length} pages
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </Button>
        </div>
      </div>

      <div className="bg-background border-t">
        {pages.map((page) => (
          <div
            key={page.id}
            className="border-b"
            onClick={() => handleSelectPage(page.id)}>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">{page.url}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {new Date(page.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    • {page.path}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
                onClick={(e) => e.stopPropagation()} // Prevent card click
              >
                <a
                  href={`https://${page.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-labelledby={`visit-page-${page.id}`}>
                  <span id={`visit-page-${page.id}`} className="sr-only">
                    Visit {page.url} (opens in new window)
                  </span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
