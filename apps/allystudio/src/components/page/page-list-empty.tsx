import { Button } from "@/components/ui/button"
import { useUrl } from "@/providers/url-provider"
import { useSelector } from "@xstate/react"
import { Plus, SwitchCamera } from "lucide-react"

import { useWebsiteContext } from "../website/website-context"
import { PageAdd } from "./page-add"
import { usePageContext } from "./page-context"

// Component that displays when no pages are found
export function PageListEmpty() {
  const actor = usePageContext()
  const websiteActor = useWebsiteContext()
  const { normalizedUrl } = useUrl()

  const isSuccess = useSelector(actor, (state) =>
    state.matches({ success: "list" })
  )
  const hasPages = useSelector(actor, (state) => state.context.pages.length > 0)
  const currentWebsite = useSelector(
    websiteActor,
    (state) => state.context.currentWebsite,
    Object.is
  )

  // Only show when in success.list state and there are no pages
  if (!isSuccess || hasPages) {
    return null
  }

  // Check if the current URL belongs to the selected website
  const currentUrlBelongsToWebsite =
    normalizedUrl && currentWebsite
      ? normalizedUrl.hostname ===
        currentWebsite.normalized_url.replace(/^https?:\/\//, "")
      : false

  return (
    <div className="text-center p-8 border border-dashed rounded-lg">
      <h3 className="font-medium mb-2">No pages found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        There are no pages associated with this website yet.
      </p>

      {!currentUrlBelongsToWebsite && normalizedUrl ? (
        <div className="mb-4">
          <p className="text-xs text-amber-500 mb-2">
            Note: The current page ({normalizedUrl.hostname}) is from a
            different website than the selected one (
            {currentWebsite?.normalized_url.replace(/^https?:\/\//, "")}).
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Use the MATCH_WEBSITE event to find the website matching the current URL
              if (normalizedUrl) {
                websiteActor.send({
                  type: "MATCH_WEBSITE",
                  url: `https://${normalizedUrl.hostname}${normalizedUrl.path}`
                })
              }
            }}
            className="mb-2">
            <SwitchCamera className="h-4 w-4 mr-2" aria-hidden="true" />
            Switch to Current Website
          </Button>
        </div>
      ) : (
        <PageAdd />
      )}
    </div>
  )
}
