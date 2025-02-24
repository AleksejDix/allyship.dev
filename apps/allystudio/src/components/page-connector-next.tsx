"use client"

import { connectPageToAllyship } from "@/core/pages"
import { cn } from "@/lib/utils"
import { usePage } from "@/providers/page-provider"
import { useWebsite } from "@/providers/website-provider"
import { extractDomain, extractPath, isValidPageUrl } from "@/utils/url"
import { Link2, Link2Off } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"

/**
 * PageConnectorNext - A more stable implementation of the page connector
 * that handles URL validation, website/page tracking, and status display
 */
export function PageConnectorNext() {
  // Get website context
  const {
    currentUrl,
    matchingWebsite,
    websites,
    isLoading: websiteLoading,
    addWebsite
  } = useWebsite()

  // Get page context
  const { matchingPage, isLoading: pageLoading } = usePage()

  // Local loading state for add operation
  const [isAdding, setIsAdding] = useState(false)

  // Combined loading state
  const isLoading = websiteLoading || pageLoading || isAdding

  // Extract domain and path early for debugging
  let domain = ""
  let path = ""
  let isKnownDomain = false

  if (currentUrl && isValidPageUrl(currentUrl)) {
    try {
      domain = extractDomain(currentUrl)
      path = extractPath(currentUrl)
      // Check if domain matches any known domains
      isKnownDomain = websites?.some(
        (website) => website.normalized_url === domain
      )
    } catch (error) {
      console.error("Error extracting domain/path:", error)
    }
  }

  // Debug logs
  useEffect(() => {
    console.log("PageConnectorNext Debug:", {
      currentUrl,
      domain,
      path,
      isKnownDomain,
      matchingWebsite: matchingWebsite
        ? {
            id: matchingWebsite.id,
            normalized_url: matchingWebsite.normalized_url
          }
        : null,
      matchingPage: matchingPage
        ? {
            id: matchingPage.id,
            path: matchingPage.path
          }
        : null,
      knownDomains: websites?.map((w) => w.normalized_url)
    })
  }, [
    currentUrl,
    domain,
    path,
    isKnownDomain,
    matchingWebsite,
    matchingPage,
    websites
  ])

  // Base container styles
  const containerClasses = cn(
    "flex h-[32px] items-center justify-between gap-2 border-b px-3",
    "bg-background/50"
  )

  // Loading state
  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 w-full">
          <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
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
          <Link2Off className="h-3 w-3 text-muted-foreground" />
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
          <Link2Off className="h-3 w-3 text-red-600 dark:text-red-400" />
          <span className="text-[10px] text-muted-foreground">
            This type of page cannot be analyzed
          </span>
        </div>
      </div>
    )
  }

  // Connection state
  const isConnected = Boolean(matchingPage && matchingWebsite)

  // Handle adding a new page
  const handleAddPage = async () => {
    if (!currentUrl) return
    setIsAdding(true)
    try {
      // Add website first if needed
      if (!matchingWebsite) {
        await addWebsite(currentUrl)
      }
      // Connect the page
      await connectPageToAllyship(currentUrl)
    } catch (error) {
      console.error("Failed to add page:", error)
    } finally {
      setIsAdding(false)
    }
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
              {!isConnected ? (
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
                    <Link2
                      className={cn(
                        "h-3 w-3",
                        isKnownDomain
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    />
                    <div className="text-[10px] font-medium flex items-center min-w-0 flex-1">
                      <span
                        className={cn(
                          "shrink-0",
                          isKnownDomain
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        )}>
                        {domain}
                      </span>
                      <span
                        className={cn(
                          "truncate",
                          matchingPage
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        )}>
                        {path}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] shrink-0 ml-2">
                    {isAdding ? "Adding..." : "Track"}
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
                      <Link2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <div className="text-[10px] font-medium flex items-center min-w-0 flex-1">
                        <span className="shrink-0 text-green-600 dark:text-green-400">
                          {domain}
                        </span>
                        <span className="truncate text-green-600 dark:text-green-400">
                          {path}
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
              {isConnected && matchingPage ? (
                <>
                  <p className="text-xs text-muted-foreground">
                    Path: {matchingPage.path}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added:{" "}
                    {new Date(matchingPage.created_at).toLocaleDateString()}
                  </p>
                </>
              ) : matchingWebsite ? (
                <>
                  <p className="text-xs text-muted-foreground">
                    Website already tracked
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added:{" "}
                    {new Date(matchingWebsite.created_at).toLocaleDateString()}
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
