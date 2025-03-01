import { Button } from "@/components/ui/button"
import {
  CurrentIndicator,
  CurrentPathIndicator
} from "@/components/ui/current-indicator"
import { cn } from "@/lib/utils"
import { useSelector } from "@xstate/react"
import { ExternalLink, FileText } from "lucide-react"

import { PageAdd } from "./page-add"
import { usePageContext } from "./page-context"

// Component that displays the list of pages
export function PageList() {
  const actor = usePageContext()
  const isSuccess = useSelector(actor, (state) =>
    state.matches({ success: "list" })
  )
  const hasPages = useSelector(actor, (state) => state.context.pages.length > 0)
  const pages = useSelector(actor, (state) => state.context.pages)
  const websiteId = useSelector(actor, (state) => state.context.websiteId)

  // Only show when in success.list state and there are pages
  if (!isSuccess) {
    return null
  }

  // Handle page selection
  const handleSelectPage = (pageId: string) => {
    actor.send({ type: "SELECT_PAGE", pageId })
  }

  return (
    <div className="bg-background">
      {/* Add page button with proper styling */}
      <div className="px-4 py-6">
        <h3 className="text-sm font-medium mb-4">Add New Page</h3>
        <PageAdd />
      </div>

      <div className="border-t">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={cn(
              "border-b",
              index === pages.length - 1 && "border-b-0"
            )}>
            <CurrentPathIndicator path={page.path}>
              <div className="flex items-center">
                <button
                  onClick={() => handleSelectPage(page.id)}
                  className="flex-1 py-3 px-4 text-left hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText
                      className="h-5 w-5 text-muted-foreground flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {page.path}
                      </p>
                    </div>
                  </div>
                </button>
                <a
                  href={`${page.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-labelledby={`visit-page-${page.id}`}
                  className="flex items-center gap-1 px-3 py-2 mr-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <span id={`visit-page-${page.id}`} className="sr-only">
                    Visit {page.url}
                    {page.path} (opens in new window)
                  </span>
                  <span className="hidden sm:inline">Visit</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </CurrentPathIndicator>
          </div>
        ))}
      </div>
    </div>
  )
}
