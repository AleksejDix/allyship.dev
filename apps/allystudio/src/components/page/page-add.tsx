import { useUrl } from "@/providers/url-provider"
import { type TablesInsert } from "@/types/database.types"
import { useSelector } from "@xstate/react"
import { SwitchCamera, ToggleLeft, ToggleRight } from "lucide-react"
import { memo, useCallback, useId } from "react"

import { Button } from "../ui/button"
import { useWebsiteContext } from "../website/website-context"
import { usePageContext } from "./page-context"

type PageInsert = TablesInsert<"Page">

// Wrap the component with memo to prevent unnecessary re-renders
export const PageAdd = memo(function PageAdd() {
  const pageActor = usePageContext()
  const websiteActor = useWebsiteContext()
  const { normalizedUrl, isLoading } = useUrl()

  // Get the current website from the website context
  const currentWebsite = useSelector(
    websiteActor,
    (state) => state.context.currentWebsite,
    Object.is
  )

  const currentPage = useSelector(
    pageActor,
    (state) => state.context.selectedPage,
    Object.is
  )

  // Get pages and adding state from the page context
  const { pages, isAddingPage } = useSelector(
    pageActor,
    (state) => ({
      pages: state.context.pages,
      isAddingPage: state.matches("adding")
    }),
    Object.is
  )

  // Get domain from website URL
  const websiteDomain = currentWebsite?.normalized_url.replace(
    /^https?:\/\//,
    ""
  )

  // Determine if the current URL belongs to the current website
  const currentUrlBelongsToWebsite =
    normalizedUrl && websiteDomain
      ? normalizedUrl.hostname === websiteDomain
      : false

  // Find existing page for current URL (if any)
  const existingPage =
    currentWebsite && normalizedUrl?.path
      ? pages.find(
          (page) =>
            page.path === normalizedUrl.path &&
            page.website_id === currentWebsite.id
        )
      : null

  // Use existingPage instead of duplicate lookups
  const pageAlreadyExists = !!existingPage

  const handleAddPage = useCallback(() => {
    if (
      !currentWebsite ||
      !normalizedUrl?.path ||
      pageAlreadyExists ||
      !currentUrlBelongsToWebsite
    ) {
      return
    }

    const path = normalizedUrl.path
    const combinedNormalizedUrl = `${websiteDomain}${path}`

    // Create payload with only required fields
    const payload: PageInsert = {
      path,
      url: `${currentWebsite.url}${path}`,
      normalized_url: combinedNormalizedUrl,
      website_id: currentWebsite.id
    }

    // Send ADD_PAGE event
    pageActor.send({
      type: "ADD_PAGE",
      payload,
      website: currentWebsite
    })
  }, [
    currentWebsite,
    normalizedUrl,
    pageActor,
    pageAlreadyExists,
    currentUrlBelongsToWebsite,
    websiteDomain
  ])

  if (!currentWebsite) return null

  // Determine button state - ensure it's always a boolean
  const isAddDisabled = Boolean(
    isLoading ||
      !normalizedUrl?.path ||
      isAddingPage ||
      !currentUrlBelongsToWebsite ||
      pageAlreadyExists
  )

  return (
    <div className="pr-2">
      {!currentUrlBelongsToWebsite ? (
        normalizedUrl && (
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 text-red-600 border-red-600 animate-pulse"
            asChild>
            <a
              href={`https://${currentWebsite.normalized_url}`}
              target="_blank">
              <SwitchCamera className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">
                Switch to {normalizedUrl.hostname}
              </span>
            </a>
          </Button>
        )
      ) : pageAlreadyExists && normalizedUrl ? (
        // Visit Page button that navigates in the current tab
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 text-green-600 "
          onClick={() => {
            if (!existingPage) return

            const fullUrl = existingPage.url.startsWith("http")
              ? existingPage.url
              : `https://${existingPage.url}`

            // Navigate using Chrome extension API...
            if (typeof chrome !== "undefined" && chrome.tabs) {
              chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs) => {
                  if (tabs[0] && tabs[0].id) {
                    chrome.tabs.update(tabs[0].id, { url: fullUrl })
                  }
                }
              )
            } else {
              window.location.href = fullUrl
            }
          }}
          aria-label="Visit existing page">
          <ToggleRight className="h-4 w-4 " aria-hidden="true" />
        </Button>
      ) : (
        // Regular "Add Page" button otherwise
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="w-8 h-8 text-red-600 border-red-600 animate-pulse"
          onClick={handleAddPage}
          disabled={isAddDisabled}
          aria-label={isAddingPage ? "Adding..." : "Add current page"}>
          <ToggleLeft aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">Add current page</span>
        </Button>
      )}
    </div>
  )
})
