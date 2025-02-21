"use client"

import { connectPageToAllyship } from "@/core/pages"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/database"
import { extractDomain, extractPath } from "@/utils/url"
import { Link2, Link2Off, Plus } from "lucide-react"
import { useState } from "react"

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

interface PageConnectorProps {
  currentFile: string
  isConnected: boolean
  onAddPage?: () => Promise<void>
  pageData?: PageData | null
  currentUrl: string
  websiteId?: string
}

function StatusIcon({ isConnected }: { isConnected: boolean }) {
  if (isConnected) {
    return <Link2 className="h-3 w-3 text-green-600 dark:text-green-400" />
  }
  return <Link2Off className="h-3 w-3 text-red-600 dark:text-red-400" />
}

function StatusTooltip({
  isConnected,
  pageData
}: {
  isConnected: boolean
  pageData?: PageData | null
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
      ) : (
        <p className="text-xs text-muted-foreground">
          Start tracking accessibility issues on this page
        </p>
      )}
    </TooltipContent>
  )
}

export function PageConnector({
  currentFile,
  isConnected,
  onAddPage,
  pageData,
  currentUrl,
  websiteId
}: PageConnectorProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddPage = async () => {
    setIsLoading(true)
    try {
      await connectPageToAllyship(currentUrl)
      await onAddPage?.()
    } catch (error) {
      console.error("Failed to track page:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Extract domain and path from URL
  const domain = extractDomain(currentUrl)
  const path = extractPath(currentUrl)

  // Determine what parts we know
  const knownWebsite = !!websiteId // Green if we have a website ID
  const knownPage = !!pageData // Green if we have page data

  const buttonClasses = cn(
    "h-6 px-2 flex items-center gap-1 w-full",
    "hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400"
  )

  return (
    <TooltipProvider>
      <div className="flex h-[32px] items-center justify-between gap-2 border-b px-3">
        <div className="flex min-w-0 items-center gap-2 w-full">
          <div className="flex shrink-0 items-center gap-1 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                {!isConnected && onAddPage ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={buttonClasses}
                    onClick={handleAddPage}
                    disabled={isLoading}>
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <div className="transition-transform duration-200 ease-in-out shrink-0">
                        <StatusIcon isConnected={isConnected} />
                      </div>
                      <div className="text-[10px] font-medium flex items-center min-w-0 flex-1">
                        <span
                          className={cn(
                            "shrink-0",
                            knownWebsite
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          )}>
                          {domain}
                        </span>
                        <span
                          className={cn(
                            "truncate",
                            knownPage
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          )}>
                          {path}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-[10px] shrink-0 ml-2">
                      {isLoading ? "Adding..." : "Track"}
                    </div>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={buttonClasses}
                    asChild>
                    <a
                      href={`https://allyship.dev/spaces/${pageData?.website.space_id}/${pageData?.website_id}/pages/${pageData?.id}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      <div className="flex items-center gap-1 min-w-0 flex-1">
                        <div className="transition-transform duration-200 ease-in-out shrink-0">
                          <StatusIcon isConnected={isConnected} />
                        </div>
                        <div className="text-[10px] font-medium flex items-center min-w-0 flex-1">
                          <span
                            className={cn(
                              "shrink-0",
                              knownWebsite
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            )}>
                            {domain}
                          </span>
                          <span
                            className={cn(
                              "truncate",
                              knownPage
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            )}>
                            {path}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-[10px] shrink-0 ml-2">
                        View in Dashboard
                      </div>
                    </a>
                  </Button>
                )}
              </TooltipTrigger>
              <StatusTooltip isConnected={isConnected} pageData={pageData} />
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
