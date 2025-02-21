"use client"

import { cn } from "@/lib/utils"
import { type Database } from "@/types/database"
import { CheckCircle2, Link2Off, Plus, RefreshCw } from "lucide-react"
import { useState } from "react"

import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"

interface FileHeaderProps {
  currentFile?: string
  isConnected?: boolean
  onAddPage?: (url: string) => Promise<void>
  onRefreshScan?: () => Promise<void>
  pageData?: Database["public"]["Tables"]["Page"]["Row"] | null
  scanStatus?: Database["public"]["Enums"]["ScanStatus"]
}

export function FileHeader({
  currentFile = "Untitled Page",
  isConnected = false,
  onAddPage,
  onRefreshScan,
  pageData,
  scanStatus
}: FileHeaderProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleAddPage = async () => {
    if (!onAddPage) return
    setIsAdding(true)
    try {
      await onAddPage(currentFile)
    } finally {
      setIsAdding(false)
    }
  }

  const handleRefreshScan = async () => {
    if (!onRefreshScan) return
    setIsRefreshing(true)
    try {
      await onRefreshScan()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-[32px] items-center gap-2 border-b px-3">
        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium">Connected</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Connected to allyship.dev
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Link2Off className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium">Local</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Working locally</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex flex-1 items-center gap-2">
          <h1 className="truncate text-sm font-medium">{currentFile}</h1>

          {isConnected && (
            <div className="flex items-center gap-1">
              {!pageData ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={isAdding}
                      onClick={handleAddPage}>
                      <Plus className="h-3.5 w-3.5" />
                      <span className="sr-only">Add to Dashboard</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Add to Dashboard
                  </TooltipContent>
                </Tooltip>
              ) : (
                <>
                  {scanStatus && (
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {scanStatus === "completed" && "Last scan completed"}
                      {scanStatus === "pending" && "Scan in progress..."}
                      {scanStatus === "failed" && "Last scan failed"}
                      {scanStatus === "queued" && "Scan queued"}
                    </span>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={isRefreshing || scanStatus === "pending"}
                        onClick={handleRefreshScan}>
                        <RefreshCw
                          className={cn(
                            "h-3.5 w-3.5",
                            isRefreshing && "animate-spin"
                          )}
                        />
                        <span className="sr-only">Refresh Scan</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Refresh Scan</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
