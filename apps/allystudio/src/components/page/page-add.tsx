import { useAuth } from "@/providers/auth-provider"
import { useUrl } from "@/providers/url-provider"
import { type TablesInsert } from "@/types/database.types"
import { useSelector } from "@xstate/react"
import { Plus, RefreshCw, SwitchCamera } from "lucide-react"
import { useCallback, useEffect, useId, useState } from "react"

import { Button } from "../ui/button"
import { useWebsiteContext } from "../website/website-context"
import { usePageContext } from "./page-context"

type PageInsert = TablesInsert<"Page">

export function PageAdd() {
  const pageActor = usePageContext()
  const websiteActor = useWebsiteContext()
  const { normalizedUrl, isLoading } = useUrl()
  const auth = useAuth()
  const addPageId = useId()

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Get the current website from the website context
  const currentWebsite = useSelector(
    websiteActor,
    (state) => state.context.currentWebsite,
    Object.is
  )

  // Get the existing pages from the page context
  const pages = useSelector(
    pageActor,
    (state) => state.context.pages,
    Object.is
  )

  // Check machine state for errors
  const addPageError = useSelector(
    pageActor,
    (state) => state.context.error,
    Object.is
  )

  // Clear error and success when URL changes
  useEffect(() => {
    setError(null)
    setSuccess(null)
  }, [normalizedUrl])

  // Update error message if page machine returns an error
  useEffect(() => {
    if (addPageError) {
      setError(addPageError.message || "Failed to add page")
      setSuccess(null)
      setIsAdding(false)
    }
  }, [addPageError])

  // Validate the path
  const validatePath = (input: string) => {
    if (!input.startsWith("/")) {
      return "Path must start with /"
    }
    if (input.includes("?") || input.includes("#")) {
      return "Path cannot contain query parameters or fragments"
    }
    return null
  }

  // Check if the current URL belongs to the selected website
  const currentUrlBelongsToWebsite =
    normalizedUrl && currentWebsite
      ? normalizedUrl.hostname ===
        currentWebsite.normalized_url.replace(/^https?:\/\//, "")
      : false

  // Check if the current page already exists in our local state
  // This is just for UI feedback, the database will handle duplicates
  const currentPath = normalizedUrl?.path || ""
  const pageAlreadyExists = pages.some(
    (page) =>
      page.path === currentPath && page.website_id === currentWebsite?.id
  )

  const handleAddPage = useCallback(() => {
    if (!currentWebsite || !normalizedUrl?.path || pageAlreadyExists) {
      return
    }

    // Check if the current URL belongs to the current website
    if (!currentUrlBelongsToWebsite) {
      setError(
        `This page belongs to ${normalizedUrl.hostname}, but you're currently on ${currentWebsite.normalized_url.replace(/^https?:\/\//, "")}`
      )
      setSuccess(null)
      return
    }

    const path = normalizedUrl.path
    const validationError = validatePath(path)

    if (validationError) {
      setError(validationError)
      setSuccess(null)
      return
    }

    // Start loading state
    setIsAdding(true)
    setError(null)
    setSuccess(null)

    // Construct normalized_url as hostname + path
    // Extract hostname from the website's normalized_url (without protocol)
    const hostname = currentWebsite.normalized_url.replace(/^https?:\/\//, "")
    const pageNormalizedUrl = `${hostname}${path}`

    // Create the page insert payload with all required fields
    const payload: PageInsert = {
      path,
      url: `${currentWebsite.url}${path}`,
      normalized_url: pageNormalizedUrl,
      website_id: currentWebsite.id,
      // Optional metadata fields
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log("Adding page with path:", path)
    console.log("Using normalized URL:", pageNormalizedUrl)
    console.log("Website ID:", currentWebsite.id)

    // Send ADD_PAGE event to the page machine
    pageActor.send({ type: "ADD_PAGE", payload })

    // Update UI immediately without waiting for timeout
    // This helps prevent the UI from blinking
    if (!pageAlreadyExists) {
      setSuccess("Page added successfully")
    }

    // Set timeout just to reset adding state
    const timer = setTimeout(() => {
      setIsAdding(false)
    }, 500) // Reduced timeout for smoother experience

    return () => clearTimeout(timer)
  }, [
    currentWebsite,
    normalizedUrl,
    pageActor,
    validatePath,
    pageAlreadyExists,
    currentUrlBelongsToWebsite
  ])

  if (!currentWebsite) {
    return null
  }

  // Determine button state and appearance
  const isAddDisabled =
    isLoading ||
    !normalizedUrl?.path ||
    !!error ||
    isAdding ||
    !currentUrlBelongsToWebsite ||
    pageAlreadyExists // Explicitly disable for already added pages

  let buttonLabel = "Add Current Page"
  let buttonVariant: "default" | "outline" | "secondary" = "default"

  if (isAdding) {
    buttonLabel = "Adding..."
  } else if (pageAlreadyExists) {
    buttonLabel = "Page Already Added"
    buttonVariant = "secondary" // Use a different style for already added pages
  } else if (isLoading) {
    buttonLabel = "Loading Page..."
  } else if (!currentUrlBelongsToWebsite) {
    buttonLabel = "Page From Different Website"
    buttonVariant = "outline"
  } else if (error) {
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
      {!currentUrlBelongsToWebsite && normalizedUrl && !error && (
        <div className="mt-2 text-center">
          <p className="text-xs text-amber-500 mb-2">
            This page is from {normalizedUrl.hostname}, but you're viewing
            website {currentWebsite.normalized_url.replace(/^https?:\/\//, "")}
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

      {error && (
        <div className="flex flex-col gap-2 mt-1">
          <p className="text-sm text-destructive text-center">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setError(null)
              // Refresh page list
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

      {success && !error && (
        <p className="text-sm text-green-600 text-center">{success}</p>
      )}
    </div>
  )
}
