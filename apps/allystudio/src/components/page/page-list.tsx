import { Button } from "@/components/ui/button"
import {
  CurrentIndicator,
  CurrentPathIndicator
} from "@/components/ui/current-indicator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useUrl } from "@/providers/url-provider"
import { useSelector } from "@xstate/react"
import { ExternalLink, FileText, Plus } from "lucide-react"
import { memo, useId, useMemo } from "react"

import { useWebsiteContext } from "../website/website-context"
import { PageAdd } from "./page-add"
import { usePageContext } from "./page-context"

// Component that displays the list of pages
export const PageList = memo(function PageList() {
  const actor = usePageContext()
  const isSuccess = useSelector(actor, (state) =>
    state.matches({ success: "list" })
  )
  const hasPages = useSelector(actor, (state) => state.context.pages.length > 0)
  const pages = useSelector(actor, (state) => state.context.pages)
  const websiteId = useSelector(actor, (state) => state.context.websiteId)

  // Sort pages by path
  const sortedPages = useMemo(() => {
    return [...pages].sort((a, b) => a.path.localeCompare(b.path))
  }, [pages])

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
      {/* Title and Add section now provided by PageAddSection component */}

      <div className="border-t">
        {sortedPages.map((page, index) => (
          <div
            key={page.id}
            className={cn(
              "border-b",
              index === sortedPages.length - 1 && "border-b-0"
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
})

// Separate component for adding pages that won't remount when the list updates
export const PageAddSection = memo(function PageAddSection() {
  const pageActor = usePageContext()
  const websiteActor = useWebsiteContext()
  const { normalizedUrl } = useUrl()
  const addPageButtonId = useId()

  // Get necessary state from machines
  const currentWebsite = useSelector(
    websiteActor,
    (state) => state.context.currentWebsite,
    Object.is
  )

  const urlValidation = useSelector(
    websiteActor,
    (state) => state.context.urlValidation,
    Object.is
  )

  const { pages, pageValidationError, isAddingPage } = useSelector(
    pageActor,
    (state) => ({
      pages: state.context.pages,
      pageValidationError: state.context.pageValidationError,
      isAddingPage: state.matches("adding")
    }),
    Object.is
  )

  // Check if the current URL belongs to the selected website
  const currentUrlBelongsToWebsite = urlValidation.belongsToCurrentWebsite

  // Check if the current page already exists
  const currentPath = normalizedUrl?.path || ""
  const pageAlreadyExists = pages.some(
    (page) =>
      page.path === currentPath && page.website_id === currentWebsite?.id
  )

  // Determine if add button should be disabled
  const isAddDisabled =
    !normalizedUrl?.path ||
    !!pageValidationError ||
    isAddingPage ||
    !currentUrlBelongsToWebsite ||
    pageAlreadyExists

  const handleQuickAdd = () => {
    if (isAddDisabled || !normalizedUrl?.path || !currentWebsite) return

    // Use the path from the normalized URL
    const path = normalizedUrl.path

    // Construct normalized_url as hostname + path
    const hostname = currentWebsite.normalized_url.replace(/^https?:\/\//, "")
    const combinedNormalizedUrl = `${hostname}${path}`

    // Create the page insert payload
    const payload = {
      path,
      url: `${currentWebsite.url}${path}`,
      normalized_url: combinedNormalizedUrl,
      website_id: currentWebsite.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Send ADD_PAGE event
    pageActor.send({
      type: "ADD_PAGE",
      payload,
      website: currentWebsite
    })
  }

  // Dynamic button label based on state
  let buttonTooltip = "Add current page"
  if (isAddingPage) {
    buttonTooltip = "Adding page..."
  } else if (pageAlreadyExists) {
    buttonTooltip = "Page already added"
  } else if (!currentUrlBelongsToWebsite) {
    buttonTooltip = "Page from different website"
  } else if (pageValidationError) {
    buttonTooltip = "Cannot add page"
  } else if (!normalizedUrl?.path) {
    buttonTooltip = "No page detected"
  }

  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <h3 className="text-sm font-medium">Pages</h3>

      <div className="flex gap-2 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleQuickAdd}
                disabled={isAddDisabled}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                aria-labelledby={`${addPageButtonId}-label`}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span id={`${addPageButtonId}-label`} className="sr-only">
                  {buttonTooltip}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{buttonTooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
})
