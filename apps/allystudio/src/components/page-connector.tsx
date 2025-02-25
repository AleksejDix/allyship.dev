"use client"

import { connectPageToAllyship } from "@/core/pages"
import { cn } from "@/lib/utils"
import { usePage } from "@/providers/page-provider"
import { useWebsite } from "@/providers/website-provider"
import type { Database } from "@/types/database"
import { isValidPageUrl, normalizeUrl, type NormalizedUrl } from "@/utils/url"
import { Link2, Link2Off, Plus } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"

type PageData = Database["public"]["Tables"]["Page"]["Row"] & {
  website: Database["public"]["Tables"]["Website"]["Row"]
}

interface PageConnectorProps {}

function StatusIcon({ isConnected }: { isConnected: boolean }) {
  if (isConnected) {
    return <Link2 className="h-3 w-3 text-green-600 dark:text-green-400" />
  }
  return <Link2Off className="h-3 w-3 text-red-600 dark:text-red-400" />
}

function StatusTooltip({
  isConnected,
  pageData,
  matchingWebsite
}: {
  isConnected: boolean
  pageData?: PageData | null
  matchingWebsite: Database["public"]["Tables"]["Website"]["Row"] | null
}) {
  return (
    <TooltipContent side="bottom" className="flex flex-col gap-1">
      {isConnected && pageData ? (
        <>
          <p className="text-xs text-muted-foreground">Path: {pageData.path}</p>
          <p className="text-xs text-muted-foreground">
            Added: {new Date(pageData.created_at).toLocaleDateString()}
          </p>
        </>
      ) : matchingWebsite ? (
        <>
          <p className="text-xs text-muted-foreground">
            Website already tracked
          </p>
          <p className="text-xs text-muted-foreground">
            Added: {new Date(matchingWebsite.created_at).toLocaleDateString()}
          </p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          Start tracking accessibility issues on this page
        </p>
      )}
    </TooltipContent>
  )
}

export function PageConnector({}: PageConnectorProps) {
  // Get URL and website information from provider
  const {
    matchingWebsite,
    isLoading: websiteLoading,
    currentUrl,
    normalizedUrl,
    addWebsite
  } = useWebsite()

  // Get page information from provider
  const { matchingPage, isLoading: pageLoading } = usePage()

  // Track local loading state for add operation
  const [isAdding, setIsAdding] = useState(false)

  // Debug logs for key states
  useEffect(() => {
    console.log("PageConnector Debug:", {
      currentUrl,
      websiteLoading,
      pageLoading,
      matchingWebsite: matchingWebsite
        ? {
            id: matchingWebsite.id,
            normalized_url: matchingWebsite.normalized_url,
            url: matchingWebsite.url
          }
        : null,
      matchingPage: matchingPage
        ? {
            id: matchingPage.id,
            path: matchingPage.path,
            normalized_url: matchingPage.normalized_url
          }
        : null,
      normalizedUrl
    })
  }, [
    currentUrl,
    websiteLoading,
    pageLoading,
    matchingWebsite,
    matchingPage,
    normalizedUrl
  ])

  // Combine loading states
  const isLoading = websiteLoading || pageLoading || isAdding

  // Strict URL validation
  const isValidUrl = isValidPageUrl(currentUrl || "")

  // Determine connection state - both website and page must be connected
  const isConnected = !!matchingPage && !!matchingWebsite

  // Handle add page with loading state
  const handleAddPage = async () => {
    if (!currentUrl) return
    setIsAdding(true)
    try {
      // If we don't have a matching website, create it first
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

  // Base container classes that are always applied
  const containerClasses = cn(
    "flex h-[32px] items-center justify-between gap-2 border-b px-3",
    "bg-background/50"
  )

  // Base content wrapper classes
  const contentClasses = "flex min-w-0 items-center gap-2 w-full"

  // If we're loading, show loading state
  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className={contentClasses}>
          <div className="flex shrink-0 items-center gap-1 w-full">
            <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
            <div className="text-[10px] text-muted-foreground">
              Loading website information...
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If no URL, show empty state
  if (!currentUrl) {
    return (
      <div className={containerClasses}>
        <div className={contentClasses}>
          <div className="flex shrink-0 items-center gap-1 w-full">
            <Link2Off className="h-3 w-3 text-muted-foreground" />
            <div className="text-[10px] text-muted-foreground">
              Open a webpage to start analyzing
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If URL is not valid, show invalid state
  if (!isValidUrl) {
    return (
      <div className={containerClasses}>
        <div className={contentClasses}>
          <div className="flex shrink-0 items-center gap-1 w-full">
            <Link2Off className="h-3 w-3 text-red-600 dark:text-red-400" />
            <div className="text-[10px] text-muted-foreground">
              This type of page cannot be analyzed
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If URL is invalid format, show error state
  if (!normalizedUrl) {
    return (
      <div className={containerClasses}>
        <div className={contentClasses}>
          <div className="flex shrink-0 items-center gap-1 w-full">
            <Link2Off className="h-3 w-3 text-red-600 dark:text-red-400" />
            <div className="text-[10px] text-muted-foreground">
              Invalid URL format
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Use matchingWebsite.id for the dashboard link if available
  const dashboardWebsiteId = matchingWebsite?.id || matchingPage?.website_id
  const dashboardSpaceId =
    matchingWebsite?.space_id || matchingPage?.website.space_id

  const buttonText = isLoading ? "Adding..." : "Track"

  return (
    <TooltipProvider>
      <div className={containerClasses}>
        <div className={contentClasses}>
          <div className="flex shrink-0 items-center gap-1 w-full">
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
                      <StatusIcon isConnected={isConnected} />
                      <div className="text-[10px] font-medium flex items-center min-w-0 flex-1">
                        <span
                          className={cn(
                            "shrink-0",
                            matchingWebsite
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          )}>
                          {normalizedUrl.domain}
                        </span>
                        <span className="mx-1 text-muted-foreground">/</span>
                        <span className="truncate text-red-600 dark:text-red-400">
                          {normalizedUrl.path}
                        </span>
                      </div>
                      <span className="text-[10px] shrink-0 ml-2">
                        {buttonText}
                      </span>
                    </div>
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
                    disabled>
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <StatusIcon isConnected={isConnected} />
                      <div className="text-[10px] font-medium flex items-center min-w-0 flex-1">
                        <span className="shrink-0 text-green-600 dark:text-green-400">
                          {normalizedUrl.domain}
                        </span>
                        <span className="mx-1 text-muted-foreground">/</span>
                        <span className="truncate text-green-600 dark:text-green-400">
                          {normalizedUrl.path}
                        </span>
                      </div>
                      <span className="text-[10px] shrink-0 ml-2">
                        Connected
                      </span>
                    </div>
                  </Button>
                )}
              </TooltipTrigger>
              <StatusTooltip
                isConnected={isConnected}
                pageData={matchingPage}
                matchingWebsite={matchingWebsite}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
