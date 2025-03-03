import { memo } from "react"
import type { PropsWithChildren } from "react"

// Use memo to prevent unnecessary re-renders of the entire component
export const WebsiteSelected = memo(function WebsiteSelected({
  children
}: PropsWithChildren) {
  return (
    <>
      {/* <div className="flex items-center gap-3 px-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => actor.send({ type: "REFRESH" })}>
          <ArrowLeft size="16" />
        </Button>
        <div className="grow">
          <h2 className="text-lg font-medium leading-5">
            {website.normalized_url}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Added {new Date(website.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://${website.normalized_url}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-labelledby={`visit-website-${website.id}`}>
            <span id={`visit-website-${website.id}`} className="sr-only">
              Visit {website.normalized_url} (opens in new window)
            </span>
            <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
            Visit
          </a>
        </Button>
      </div> */}

      {children}
    </>
  )
})
