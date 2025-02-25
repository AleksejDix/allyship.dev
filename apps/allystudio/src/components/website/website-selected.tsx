import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSelector } from "@xstate/react"
import { ExternalLink, Globe } from "lucide-react"
import { memo } from "react"
import type { PropsWithChildren } from "react"

import { useWebsiteContext } from "./website-context"

// Use memo to prevent unnecessary re-renders of the entire component
export const WebsiteSelected = memo(function WebsiteSelected({
  children
}: PropsWithChildren) {
  const actor = useWebsiteContext()

  // Use memoized selectors for better performance with Object.is comparison
  const website = useSelector(
    actor,
    (state) => state.context.currentWebsite,
    Object.is
  )

  const shouldRender = useSelector(
    actor,
    (state) => state.matches({ loaded: "selected" }),
    Object.is
  )

  // Only render when in the loaded.selected state
  if (!shouldRender || !website) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-medium">{website.normalized_url}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {website.theme.toLowerCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Added {new Date(website.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => actor.send({ type: "REFRESH" })}>
            Change Website
          </Button>
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
        </div>
      </div>
      {children}
    </div>
  )
})
