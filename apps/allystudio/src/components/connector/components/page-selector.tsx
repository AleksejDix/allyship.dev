"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Link as LinkIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { type Page } from "../api/sdk"

type PageSelectorProps = {
  pageOptions: Page[]
  selectedPageId: string | null
  onPageChange: (pageId: string) => void
  onRefresh: () => void
  isLoading: boolean
  label?: string
  disabled?: boolean
  highlightStatus?: "known" | "unknown"
  currentPath?: string | null
  optimisticPage?: Page | null
  currentDomain?: string | null
}

/**
 * Component for selecting a page from a list
 */
export function PageSelector({
  pageOptions,
  selectedPageId,
  onPageChange,
  onRefresh,
  isLoading,
  label = "Page",
  disabled = false,
  highlightStatus,
  currentPath,
  optimisticPage,
  currentDomain
}: PageSelectorProps) {
  const effectivelyDisabled = disabled || isLoading || pageOptions.length === 0

  // Create a special value for showing current path when it's not in the list
  const CURRENT_PATH_VALUE = "current-path-placeholder"
  const OPTIMISTIC_PATH_VALUE = "optimistic-path-placeholder"

  // Combine optimistic page with pageOptions if present
  const displayPageOptions = optimisticPage
    ? [...pageOptions, optimisticPage]
    : pageOptions

  // Track if we should show the current path
  const [showCurrentPath, setShowCurrentPath] = useState(false)

  // Check if current path is in options or matches optimistic page
  const currentPathInOptions =
    currentPath &&
    (displayPageOptions.some((page) => page.path === currentPath) ||
      optimisticPage?.path === currentPath)

  // Find matching page
  const matchingPage = currentPath
    ? displayPageOptions.find((page) => page.path === currentPath)
    : null

  // Format path for display (ensure leading slash)
  const formatPath = (path: string) => {
    return path.startsWith("/") ? path : `/${path}`
  }

  // Always show current path if available and no match exists in the options
  useEffect(() => {
    if (currentPath && !currentPathInOptions && !effectivelyDisabled) {
      setShowCurrentPath(true)
    } else if (matchingPage && !effectivelyDisabled) {
      // If there's a matching page for the current path, select it through normal means
      setShowCurrentPath(false)
      if (selectedPageId !== matchingPage.id) {
        onPageChange(matchingPage.id)
      }
    } else {
      setShowCurrentPath(false)
    }
  }, [
    currentPath,
    currentPathInOptions,
    matchingPage,
    selectedPageId,
    onPageChange,
    effectivelyDisabled
  ])

  // Handle value change - prevent selection of placeholder
  const handleValueChange = (value: string) => {
    if (value !== CURRENT_PATH_VALUE && value !== OPTIMISTIC_PATH_VALUE) {
      onPageChange(value)
      setShowCurrentPath(false)
    }
  }

  // Format the path for display in the trigger
  const formattedCurrentPath = currentPath ? formatPath(currentPath) : null

  // Check if the currently selected page is the optimistic one
  const isOptimisticSelected =
    optimisticPage && selectedPageId === optimisticPage.id

  // Choose display value based on state
  const displayValue = isOptimisticSelected
    ? OPTIMISTIC_PATH_VALUE
    : showCurrentPath
      ? CURRENT_PATH_VALUE
      : selectedPageId || ""

  return (
    <div className="grid gap-2">
      <Label htmlFor="page">{label}</Label>
      <Select value={displayValue} onValueChange={handleValueChange}>
        <SelectTrigger
          id="page"
          disabled={effectivelyDisabled}
          className={cn(
            highlightStatus
              ? highlightStatus === "known"
                ? "border-success bg-success/10"
                : "border-destructive bg-destructive/10"
              : "",
            // Apply red styling when there's a current path not in the list
            currentPath && !currentPathInOptions
              ? "text-destructive border-destructive"
              : "",
            // Apply a special style for optimistic updates
            isOptimisticSelected
              ? "border-primary bg-primary/10 text-primary font-medium"
              : ""
          )}>
          {isOptimisticSelected && optimisticPage ? (
            <>
              {formatPath(optimisticPage.path)}
              <span className="text-xs italic ml-2">(adding...)</span>
            </>
          ) : showCurrentPath && formattedCurrentPath ? (
            <span className="text-destructive">
              {formattedCurrentPath} (not in list)
            </span>
          ) : (
            <SelectValue
              placeholder={formattedCurrentPath || "Select a page"}
            />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {/* Show current path as first option when not in list */}
            {currentPath && !currentPathInOptions && !effectivelyDisabled && (
              <SelectItem
                key={CURRENT_PATH_VALUE}
                value={CURRENT_PATH_VALUE}
                className="text-destructive border-b border-border pb-2 mb-2"
                disabled>
                {formattedCurrentPath} (not in list)
              </SelectItem>
            )}

            {/* Show optimistic page if it exists */}
            {optimisticPage && (
              <SelectItem
                key={optimisticPage.id}
                value={optimisticPage.id}
                className="text-primary border-primary border-b border-border pb-2 mb-2">
                {formatPath(optimisticPage.path)}
                <span className="text-xs italic ml-2">(adding...)</span>
              </SelectItem>
            )}

            {pageOptions.map((page) => (
              <SelectItem
                key={page.id}
                value={page.id}
                className={
                  currentPath && page.path === currentPath
                    ? "border-primary bg-primary/5"
                    : ""
                }>
                {formatPath(page.path)}
                {currentPath && page.path === currentPath && (
                  <span className="ml-2 text-xs text-primary">• current</span>
                )}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {currentPath && !currentPathInOptions && pageOptions.length > 0 && (
        <div className="text-xs text-destructive flex items-center gap-1 mt-1">
          <LinkIcon size={12} aria-hidden="true" />
          <span>Current path not in list: {currentPath}</span>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={disabled || isLoading}
        onClick={onRefresh}>
        {isLoading ? "Loading..." : "Refresh"}
      </Button>
    </div>
  )
}
