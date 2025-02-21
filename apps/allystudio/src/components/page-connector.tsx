"use client"

import type { Database } from "@/types/database"
import { Link2, Link2Off, Plus } from "lucide-react"

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
}

function StatusIcon({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="relative h-4 w-4">
      <Link2
        className={`absolute h-4 w-4 transform transition-all duration-300 ${
          isConnected
            ? "scale-100 opacity-100 text-green-600 dark:text-green-400"
            : "scale-75 opacity-0"
        }`}
        aria-hidden="true"
      />
      <Link2Off
        className={`absolute h-4 w-4 transform transition-all duration-300 ${
          !isConnected
            ? "scale-100 opacity-100 text-red-600 dark:text-red-400"
            : "scale-75 opacity-0"
        }`}
        aria-hidden="true"
      />
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
          Connect this page to track accessibility issues
        </p>
      )}
    </TooltipContent>
  )
}

export function PageConnector({
  currentFile,
  isConnected,
  onAddPage,
  pageData
}: PageConnectorProps) {
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
                  className="h-6 px-2 transition-all duration-200 ease-in-out hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                  onClick={onAddPage}>
                  <Plus className="mr-1 h-3 w-3" aria-hidden="true" />
                  Connect
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs text-muted-foreground">
                  Track and monitor accessibility issues
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
