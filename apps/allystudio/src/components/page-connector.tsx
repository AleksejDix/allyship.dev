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

  return (
    <TooltipProvider>
      <div className="flex h-[32px] items-center justify-between gap-2 border-b px-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex shrink-0 items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <div className="transition-transform duration-200 ease-in-out hover:scale-110">
                    <StatusIcon isConnected={isConnected} />
                  </div>
                  <div className="text-[10px] font-medium">
                    <span
                      className={cn(
                        knownWebsite
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}>
                      {domain}
                    </span>
                    <span
                      className={cn(
                        knownPage
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}>
                      {path}
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <StatusTooltip isConnected={isConnected} pageData={pageData} />
            </Tooltip>
          </div>
        </div>

        <div
          className={`shrink-0 transition-all duration-300 ${
            !isConnected ? "opacity-100" : "invisible opacity-0"
          }`}>
          {!isConnected && onAddPage && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 px-2 transition-all duration-200 ease-in-out hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400",
                    isConnected && "opacity-0"
                  )}
                  onClick={handleAddPage}
                  disabled={isLoading}>
                  <Plus
                    className={`mr-1 h-3 w-3 ${isLoading && "animate-spin"}`}
                    aria-hidden="true"
                  />
                  {isLoading ? "Adding..." : "Track"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs text-muted-foreground">
                  Monitor and analyze accessibility issues
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
