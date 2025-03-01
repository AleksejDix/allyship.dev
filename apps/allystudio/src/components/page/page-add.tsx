import { useAuth } from "@/providers/auth-provider"
import { useUrl } from "@/providers/url-provider"
import { type TablesInsert } from "@/types/database.types"
import { useSelector } from "@xstate/react"
import { Plus, RefreshCw, SwitchCamera } from "lucide-react"
import { memo, useCallback, useEffect, useId } from "react"

import { Button } from "../ui/button"
import { useWebsiteContext } from "../website/website-context"
import { usePageContext } from "./page-context"

type PageInsert = TablesInsert<"Page">

// Wrap the component with memo to prevent unnecessary re-renders
export const PageAdd = memo(function PageAdd() {
  const pageActor = usePageContext()
  const websiteActor = useWebsiteContext()
  const { normalizedUrl, isLoading } = useUrl()
  const auth = useAuth()
  const addPageId = useId()

  // Get the current website from the website context
  const currentWebsite = useSelector(
    websiteActor,
    (state) => state.context.currentWebsite,
    Object.is
  )

  // Get URL validation state from website machine
  const urlValidation = useSelector(
    websiteActor,
    (state) => state.context.urlValidation,
    Object.is
  )

  // Get the existing pages and validation states from the page context
  const { pages, pageValidationError, pageValidationSuccess, isAddingPage } =
    useSelector(
      pageActor,
      (state) => ({
        pages: state.context.pages,
        pageValidationError: state.context.pageValidationError,
        pageValidationSuccess: state.context.pageValidationSuccess,
        isAddingPage: state.matches("adding")
      }),
      Object.is
    )

  // Send URL ownership validation event to the website machine when URL changes
  useEffect(() => {
    if (normalizedUrl && currentWebsite) {
      // Validate URL ownership in the website machine
      websiteActor.send({
        type: "VALIDATE_URL_OWNERSHIP",
        url: `https://${normalizedUrl.hostname}${normalizedUrl.path}`
      })
    }
  }, [normalizedUrl, currentWebsite, websiteActor])

  // Check if the current URL belongs to the selected website - use urlValidation from website machine
  const currentUrlBelongsToWebsite = urlValidation.belongsToCurrentWebsite

  // Check if the current page already exists in our local state
  const currentPath = normalizedUrl?.path || ""
  const pageAlreadyExists = pages.some(
    (page) =>
      page.path === currentPath && page.website_id === currentWebsite?.id
  )

  const handleAddPage = useCallback(() => {
    if (!currentWebsite || !normalizedUrl?.path) {
      return
    }

    // Extra validation to ensure we never add pages from different websites
    if (pageAlreadyExists) {
      console.log("Page already exists, not adding duplicate")
      return
    }

    // Double check URL ownership using website machine
    websiteActor.send({
      type: "VALIDATE_URL_OWNERSHIP",
      url: `https://${normalizedUrl.hostname}${normalizedUrl.path}`
    })

    // CRITICAL SECURITY CHECK: Never allow adding pages from different websites
    if (!urlValidation.belongsToCurrentWebsite) {
      console.error(
        "Security violation: Attempted to add page from a different website",
        {
          pageHostname: normalizedUrl.hostname,
          websiteHostname: currentWebsite.normalized_url.replace(
            /^https?:\/\//,
            ""
          )
        }
      )

      return
    }

    // Use the path from the normalized URL
    const path = normalizedUrl.path

    // First validate the path with the page machine
    pageActor.send({
      type: "VALIDATE_PATH",
      path
    })

    // If we have validation errors, don't proceed
    if (pageValidationError) {
      return
    }

    // Construct normalized_url as hostname + path
    const hostname = currentWebsite.normalized_url.replace(/^https?:\/\//, "")
    const combinedNormalizedUrl = `${hostname}${path}`

    // Final domain check to ensure security
    if (normalizedUrl.hostname !== hostname) {
      console.error("Security violation: Hostname mismatch when adding page", {
        pageHostname: normalizedUrl.hostname,
        websiteHostname: hostname
      })

      return
    }

    // Create the page insert payload with all required fields
    const payload: PageInsert = {
      path,
      url: `${currentWebsite.url}${path}`,
      normalized_url: combinedNormalizedUrl,
      website_id: currentWebsite.id,
      // Optional metadata fields
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log("Adding page with path:", path)
    console.log(
      "Using normalized URL (hostname + path):",
      combinedNormalizedUrl
    )
    console.log("Website ID:", currentWebsite.id)

    // Send ADD_PAGE event to the page machine with website context
    pageActor.send({
      type: "ADD_PAGE",
      payload,
      website: currentWebsite
    })
  }, [
    currentWebsite,
    normalizedUrl,
    pageActor,
    websiteActor,
    pageAlreadyExists,
    pageValidationError,
    urlValidation
  ])

  if (!currentWebsite) {
    return null
  }

  // Determine button state and appearance
  const isAddDisabled =
    isLoading ||
    !normalizedUrl?.path ||
    !!pageValidationError ||
    isAddingPage ||
    !currentUrlBelongsToWebsite ||
    pageAlreadyExists // Explicitly disable for already added pages

  let buttonLabel = "Add Current Page"
  let buttonVariant: "default" | "outline" | "secondary" = "default"

  if (isAddingPage) {
    buttonLabel = "Adding..."
  } else if (pageAlreadyExists) {
    buttonLabel = "Page Already Added"
    buttonVariant = "secondary" // Use a different style for already added pages
  } else if (isLoading) {
    buttonLabel = "Loading Page..."
  } else if (!currentUrlBelongsToWebsite) {
    buttonLabel = "Page From Different Website"
    buttonVariant = "outline"
  } else if (pageValidationError) {
    buttonLabel = "Cannot Add Page"
    buttonVariant = "outline"
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        onClick={handleAddPage}
        disabled={isAddDisabled}
        variant={buttonVariant}
        aria-disabled={isAddDisabled}
        aria-labelledby={`${addPageId}-button-label`}
        className="w-full">
        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
        <span id={`${addPageId}-button-label`} className="sr-only">
          {buttonLabel}
        </span>
        {buttonLabel}
      </Button>

      {/* Show a helpful message and button when the page is from a different website */}
      {!currentUrlBelongsToWebsite && normalizedUrl && !pageValidationError && (
        <div className="mt-2 text-center">
          <p className="text-xs text-amber-500 mb-2">
            {urlValidation.error ||
              `This page is from ${normalizedUrl.hostname}, but you're viewing website ${currentWebsite.normalized_url.replace(/^https?:\/\//, "")}`}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              // Use the MATCH_WEBSITE event to find the website matching the current URL
              websiteActor.send({
                type: "MATCH_WEBSITE",
                url: `https://${normalizedUrl.hostname}${normalizedUrl.path}`
              })
            }}
            className="mx-auto">
            <SwitchCamera className="h-3 w-3 mr-1" aria-hidden="true" />
            <span>Switch to {normalizedUrl.hostname}</span>
          </Button>
        </div>
      )}

      {pageValidationError && (
        <div className="flex flex-col gap-2 mt-1">
          <p className="text-sm text-destructive text-center">
            {pageValidationError}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (currentWebsite?.id) {
                pageActor.send({
                  type: "LOAD_PAGES",
                  websiteId: currentWebsite.id
                })
              }
            }}
            className="flex items-center justify-center gap-1 mx-auto">
            <RefreshCw className="h-3 w-3" aria-hidden="true" />
            <span>Try Again</span>
          </Button>
        </div>
      )}

      {pageValidationSuccess && !pageValidationError && (
        <p className="text-sm text-green-600 text-center">
          {pageValidationSuccess}
        </p>
      )}
    </div>
  )
})
