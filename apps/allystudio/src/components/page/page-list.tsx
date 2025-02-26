import { Button } from "@/components/ui/button"
import {
  CurrentIndicator,
  CurrentPathIndicator
} from "@/components/ui/current-indicator"
import { cn } from "@/lib/utils"
import { useSelector } from "@xstate/react"
import { ExternalLink, FileText, Plus } from "lucide-react"
import { useState } from "react"

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
  const [isAdding, setIsAdding] = useState(false)
  const [newPath, setNewPath] = useState("")

  // Only show when in success.list state and there are pages
  if (!isSuccess) {
    return null
  }

  // Handle page selection
  const handleSelectPage = (pageId: string) => {
    actor.send({ type: "SELECT_PAGE", pageId })
  }

  // Handle adding a new page
  const handleAddPage = () => {
    if (newPath.trim()) {
      // TODO: Implement add page functionality
      setNewPath("")
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-background">
      {/* Add new page form */}
      {isAdding && (
        <div className="mx-4 mb-4 p-4 border rounded-lg bg-card">
          <h3 className="text-sm font-medium mb-2">Add New Page</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="Enter page path (e.g., /about)"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button onClick={handleAddPage} disabled={!newPath.trim()}>
              Add
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(false)}
            className="text-xs">
            Cancel
          </Button>
        </div>
      )}

      {/* Page list */}
      {hasPages ? (
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
      ) : (
        <div className="text-center p-8 border-t border-dashed">
          <h3 className="font-medium mb-2">No pages found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            There are no pages associated with this website yet.
          </p>
        </div>
      )}
    </div>
  )
}
