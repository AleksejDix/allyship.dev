import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector } from "@xstate/react"
import { ExternalLink, Plus } from "lucide-react"

import { usePageContext } from "./page-context"

// Component that displays the list of pages
export function PageList() {
  const actor = usePageContext()
  const isSuccess = useSelector(actor, (state) => state.matches("success"))
  const hasPages = useSelector(actor, (state) => state.context.pages.length > 0)
  const pages = useSelector(actor, (state) => state.context.pages)

  // Only show when in success state and there are pages
  if (!isSuccess || !hasPages) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Pages</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {pages.length} {pages.length === 1 ? "page" : "pages"} found
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add Page
          </Button>
        </div>
      </div>

      <ul className="space-y-4">
        {pages.map((page) => (
          <li key={page.id}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    {page.url}
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://${page.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-labelledby={`visit-page-${page.id}`}>
                      <span id={`visit-page-${page.id}`} className="sr-only">
                        Visit {page.url} (opens in new window)
                      </span>
                      <ExternalLink
                        className="h-4 w-4 mr-2"
                        aria-hidden="true"
                      />
                      Visit
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Added {new Date(page.created_at).toLocaleDateString()}
                </div>
                <div className="mt-2 text-sm">
                  Path: <span className="font-medium">{page.path}</span>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
