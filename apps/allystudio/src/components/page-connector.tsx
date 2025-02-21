"use client"

import { connectPageToAllyship } from "@/core/pages"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/database"
import { useState } from "react"

import { Icons } from "./icons"
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
}

function StatusIcon({ isConnected }: { isConnected: boolean }) {
  const Connected = Icons.connected
  const Disconnected = Icons.disconnected

  return (
    <div className="relative h-4 w-4">
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          isConnected ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}>
        <Connected className="w-5 h-5" aria-hidden="true" />
      </div>
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          !isConnected ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}>
        <Disconnected className="w-5 h-5" aria-hidden="true" />
      </div>
    </div>
  )
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
  currentUrl
}: PageConnectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const Add = Icons.add

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
                  {isConnected && (
                    <span className="text-[10px] text-muted-foreground">
                      {pageData?.website.url}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <StatusTooltip isConnected={isConnected} pageData={pageData} />
            </Tooltip>
          </div>
          <h1 className="min-w-0 truncate text-sm font-medium">
            {currentFile}
          </h1>
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
                  <Add
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
