import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector } from "@xstate/react"
import { ExternalLink } from "lucide-react"

import { usePageContext } from "./page-context"

export function PageList() {
  const actor = usePageContext()

  const isLoading = useSelector(actor, (state) => state.matches("loading"))
  const hasPages = useSelector(actor, (state) => state.context.pages.length > 0)
  const pages = useSelector(actor, (state) => state.context.pages)

  if (isLoading) {
    return <PageListSkeleton />
  }

  if (!hasPages) {
    return <PageListEmpty />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Pages</h2>
        <div className="text-sm text-muted-foreground">
          {pages.length} {pages.length === 1 ? "page" : "pages"} found
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

function PageListSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading pages">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
      </div>

      <ul className="space-y-4">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <div className="border rounded-lg p-4 space-y-2">
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PageListEmpty() {
  return (
    <div className="text-center p-8 border border-dashed rounded-lg">
      <h3 className="font-medium mb-2">No pages found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        There are no pages associated with this website yet.
      </p>
    </div>
  )
}
