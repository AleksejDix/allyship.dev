"use client"

import { connectPageToAllyship } from "@/core/pages"
import { cn } from "@/lib/utils"
import { usePage } from "@/providers/page-provider"
import { useWebsite } from "@/providers/website-provider"
import { isValidPageUrl, type NormalizedUrl } from "@/utils/url"
import { Link2, Link2Off } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"

// Base container styles used by both components
const containerClasses = cn(
  "flex h-[32px] items-center justify-between gap-2 border-b px-3",
  "bg-background/50"
)

/**
 * ConnectorSymbol - Reusable connector status indicator
 */
function ConnectorSymbol({
  isLoading,
  isConnected,
  isDisabled
}: {
  isLoading?: boolean
  isConnected?: boolean
  isDisabled?: boolean
}) {
  if (isLoading) {
    return <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
  }

  if (isDisabled) {
    return <Link2Off className="h-3 w-3 text-muted-foreground" />
  }

  if (isDisabled === false) {
    return <Link2Off className="h-3 w-3 text-red-600 dark:text-red-400" />
  }

  return (
    <Link2
      className={cn(
        "h-3 w-3",
        isConnected
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      )}
    />
  )
}

/**
 * DomainConnector - Handles domain matching and website tracking
 */
function DomainConnector() {
  const {
    currentUrl,
    normalizedUrl,
    matchingWebsite,
    websites,
    isLoading: websiteLoading,
    addWebsite
  } = useWebsite()

  // Local loading state for add operation
  const [isAdding, setIsAdding] = useState(false)

  // Loading state - only when actually fetching website data
  const isLoading = (websiteLoading && !websites?.length) || isAdding

  // Check if domain is tracked by validating the website object
  const isKnownDomain = Boolean(
    matchingWebsite?.id &&
      matchingWebsite.normalized_url &&
      matchingWebsite.space_id
  )

  // Loading state
  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 w-full">
          <ConnectorSymbol isLoading />
          <span className="text-[10px] text-muted-foreground">
            Loading website information...
          </span>
        </div>
      </div>
    )
  }

  // Empty state - no URL
  if (!currentUrl) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 w-full">
          <ConnectorSymbol isDisabled />
          <span className="text-[10px] text-muted-foreground">
            Open a webpage to start analyzing
          </span>
        </div>
      </div>
    )
  }

  // Invalid URL state
  if (!isValidPageUrl(currentUrl)) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 w-full">
          <ConnectorSymbol isDisabled={false} />
          <span className="text-[10px] text-muted-foreground">
            This type of page cannot be analyzed
          </span>
        </div>
      </div>
    )
  }

  // Invalid URL format state
  if (!normalizedUrl) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 w-full">
          <ConnectorSymbol isDisabled={false} />
          <span className="text-[10px] text-muted-foreground">
            Invalid URL format
          </span>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={containerClasses}>
        <div className="flex items-center gap-2 w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-2 flex items-center gap-1 w-full",
                  "hover:bg-green-100 hover:text-green-700",
                  "dark:hover:bg-green-900/20 dark:hover:text-green-400"
                )}
                onClick={() => !matchingWebsite && addWebsite(currentUrl)}
                disabled={isLoading || Boolean(matchingWebsite)}>
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <ConnectorSymbol isConnected={isKnownDomain} />
                  <div className="text-[10px] font-medium flex items-center min-w-0 flex-1">
                    <span
                      className={cn(
                        "truncate",
                        isKnownDomain
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}>
                      {normalizedUrl.domain}
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      {normalizedUrl.path}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] shrink-0 ml-2">
                  {isAdding
                    ? "Adding..."
                    : matchingWebsite
                      ? "Connected"
                      : "Track Website"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {matchingWebsite ? (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">
                    Website already tracked
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added:{" "}
                    {new Date(matchingWebsite.created_at).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Start tracking this website
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

/**
 * PageConnectorNext - Handles page-level tracking
 */
export function PageConnectorNext() {
  // Get website context
  const { currentUrl, normalizedUrl, matchingWebsite } = useWebsite()

  // Get page context
  const { matchingPage, isLoading: pageLoading, refresh } = usePage()

  // Local loading state for add operation
  const [isAdding, setIsAdding] = useState(false)

  // Loading state - only when checking page status
  const isLoading = (pageLoading && Boolean(currentUrl)) || isAdding

  // Reload page data when URL changes
  useEffect(() => {
    if (currentUrl && matchingWebsite) {
      console.log("[PageConnector] URL changed, reloading page data")
      refresh()
    }
  }, [currentUrl, matchingWebsite, refresh])

  // Handle adding a new page
  const handleAddPage = async () => {
    if (!currentUrl) return
    setIsAdding(true)
    try {
      await connectPageToAllyship(currentUrl)
    } catch (error) {
      console.error("Failed to add page:", error)
    } finally {
      setIsAdding(false)
    }
  }

  // Don't show page connector until website is connected
  if (!matchingWebsite) {
    return <DomainConnector />
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 w-full">
          <ConnectorSymbol isLoading />
          <span className="text-[10px] text-muted-foreground">
            Loading page information...
          </span>
        </div>
      </div>
    )
  }

  // Invalid URL format state
  if (!normalizedUrl) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 w-full">
          <ConnectorSymbol isDisabled={false} />
          <span className="text-[10px] text-muted-foreground">
            Invalid URL format
          </span>
        </div>
      </div>
    )
  }

  // Dashboard link parameters
  const dashboardWebsiteId = matchingWebsite?.id || matchingPage?.website_id
  const dashboardSpaceId =
    matchingWebsite?.space_id || matchingPage?.website.space_id

  return (
    <TooltipProvider>
      <div className={containerClasses}>
        <div className="flex items-center gap-2 w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              {!matchingPage ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 px-2 flex items-center gap-1 w-full",
                    "hover:bg-green-100 hover:text-green-700",
                    "dark:hover:bg-green-900/20 dark:hover:text-green-400"
                  )}
                  onClick={handleAddPage}
                  disabled={isLoading}>
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <ConnectorSymbol isConnected={false} />
                    <div className="text-[10px] font-medium flex items-center min-w-0 flex-1">
                      <span className="shrink-0 text-green-600 dark:text-green-400">
                        {normalizedUrl.domain}
                      </span>
                      <span className="truncate text-red-600 dark:text-red-400">
                        {normalizedUrl.path}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] shrink-0 ml-2">
                    {isAdding ? "Adding..." : "Track Page"}
                  </span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 px-2 flex items-center gap-1 w-full",
                    "hover:bg-green-100 hover:text-green-700",
                    "dark:hover:bg-green-900/20 dark:hover:text-green-400"
                  )}
                  asChild>
                  <a
                    href={`https://allyship.dev/spaces/${dashboardSpaceId}/${dashboardWebsiteId}/pages/${matchingPage?.id}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <ConnectorSymbol isConnected />
                      <div className="text-[10px] font-medium flex items-center min-w-0 flex-1">
                        <span className="shrink-0 text-green-600 dark:text-green-400">
                          {normalizedUrl.domain}
                        </span>
                        <span className="truncate text-green-600 dark:text-green-400">
                          {normalizedUrl.path}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] shrink-0 ml-2">
                      View in Dashboard
                    </span>
                  </a>
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom" className="flex flex-col gap-1">
              {matchingPage ? (
                <>
                  <p className="text-xs text-muted-foreground">
                    Path: {matchingPage.path}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added:{" "}
                    {new Date(matchingPage.created_at).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Start tracking accessibility issues on this page
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
