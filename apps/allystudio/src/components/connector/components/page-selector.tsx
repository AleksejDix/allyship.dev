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
import {
  AlertCircle,
  Link as LinkIcon,
  RefreshCcw,
  XCircle
} from "lucide-react"
import { memo, useEffect, useRef, useState } from "react"

import { type Page } from "../api/sdk"

type PageSelectorProps = {
  pageOptions: Page[]
  selectedPageId: string | null
  onPageChange: (pageId: string) => void
  onRefresh: () => void
  isLoading: boolean
  error?: string | null
  label?: string
  disabled?: boolean
  highlightStatus?: "known" | "unknown"
  currentPath?: string | null
  optimisticPage?: Page | null
  currentDomain?: string | null
  forceResetLoading?: () => void
}

// Track if the loading state has persisted too long
const LOADING_WARNING_THRESHOLD = 10000 // 10 seconds

/**
 * Component for selecting a page from a list
 */
function PageSelectorComponent({
  pageOptions,
  selectedPageId,
  onPageChange,
  onRefresh,
  isLoading,
  error,
  label = "Page",
  disabled = false,
  highlightStatus,
  currentPath,
  optimisticPage,
  currentDomain,
  forceResetLoading
}: PageSelectorProps) {
  const effectivelyDisabled = disabled || isLoading || pageOptions.length === 0

  // Track loading state with delay to avoid flicker
  const [isActuallyLoading, setIsActuallyLoading] = useState(isLoading)

  // Track if loading has persisted too long
  const [showLoadingWarning, setShowLoadingWarning] = useState(false)
  const loadingStartTimeRef = useRef<number | null>(null)
  const loadingWarningTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Monitor loading state and show warning if it persists too long
  useEffect(() => {
    // Clear any existing timeout
    if (loadingWarningTimeoutRef.current) {
      clearTimeout(loadingWarningTimeoutRef.current)
      loadingWarningTimeoutRef.current = null
    }

    if (isLoading) {
      // Start tracking loading time
      if (loadingStartTimeRef.current === null) {
        loadingStartTimeRef.current = Date.now()
      }

      // Set a timeout to show warning if loading persists
      loadingWarningTimeoutRef.current = setTimeout(() => {
        setShowLoadingWarning(true)
      }, LOADING_WARNING_THRESHOLD)
    } else {
      // Reset tracking
      loadingStartTimeRef.current = null
      setShowLoadingWarning(false)
    }

    return () => {
      if (loadingWarningTimeoutRef.current) {
        clearTimeout(loadingWarningTimeoutRef.current)
      }
    }
  }, [isLoading])

  // Reset loading state from UI if stuck
  const handleForceResetLoading = () => {
    if (forceResetLoading) {
      forceResetLoading()
      setIsActuallyLoading(false)
      setShowLoadingWarning(false)
      loadingStartTimeRef.current = null

      // Clear any existing timeout
      if (loadingWarningTimeoutRef.current) {
        clearTimeout(loadingWarningTimeoutRef.current)
        loadingWarningTimeoutRef.current = null
      }
    }
  }

  // Update loading state with a slight delay to avoid UI flicker
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    if (isLoading) {
      // Set loading immediately when loading starts
      setIsActuallyLoading(true)
    } else {
      // Add a small delay when loading ends to avoid UI flicker
      timeoutId = setTimeout(() => {
        setIsActuallyLoading(false)
      }, 300)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isLoading])

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

  // Auto-select page if there's only one or it matches the current path
  useEffect(() => {
    if (!disabled && !selectedPageId && pageOptions.length > 0) {
      // Case 1: Auto-select if there's only one page
      if (pageOptions.length === 1) {
        onPageChange(pageOptions[0].id)
        return
      }

      // Case 2: Auto-select if the current path matches a page
      if (currentPath) {
        const matchingPage = pageOptions.find(
          (page) => page.path === currentPath
        )
        if (matchingPage) {
          onPageChange(matchingPage.id)
          return
        }
      }
    }
  }, [pageOptions, selectedPageId, onPageChange, disabled, currentPath])

  // Skip rendering optimistic data if we're not in the loading state
  const shouldShowOptimistic = optimisticPage && isActuallyLoading
  const displayOptions = shouldShowOptimistic
    ? [...pageOptions, optimisticPage]
    : pageOptions

  // Sort options alphabetically by path
  const sortedOptions = [...displayOptions].sort((a, b) =>
    a.path.localeCompare(b.path)
  )

  // Handle refresh with debounce
  const handleRefresh = () => {
    if ((isActuallyLoading && !showLoadingWarning) || disabled) return // Prevent refresh while already loading (unless stuck)

    // If showing warning, reset loading state before refreshing
    if (showLoadingWarning && forceResetLoading) {
      handleForceResetLoading()
    }

    onRefresh()
  }

  // Show loading indicator with duration if loading is taking too long
  const loadingDuration = loadingStartTimeRef.current
    ? Math.floor((Date.now() - loadingStartTimeRef.current) / 1000)
    : 0

  // Handle when there are no pages
  const noPages = pageOptions.length === 0 && !isActuallyLoading && !disabled

  return (
    <div className="grid gap-2">
      <Label htmlFor="page">{label}</Label>
      <div className="flex gap-2">
        <Select
          value={displayValue}
          onValueChange={handleValueChange}
          disabled={effectivelyDisabled}>
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
                : "",
              // Loading state visual indicator
              isActuallyLoading && "border-amber-500 animate-pulse"
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
            ) : isActuallyLoading ? (
              <span className="text-amber-500">
                Loading pages
                {showLoadingWarning ? ` (${loadingDuration}s)` : "..."}
              </span>
            ) : (
              <SelectValue
                placeholder={formattedCurrentPath || "Select a page"}
              />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* Show loading indicator */}
              {isActuallyLoading && (
                <div className="flex items-center justify-between gap-2 p-2 border-b border-border">
                  <span className="text-amber-500 animate-pulse text-sm">
                    Loading pages
                    {showLoadingWarning ? ` (${loadingDuration}s)` : "..."}
                  </span>
                  {showLoadingWarning && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleForceResetLoading()
                      }}>
                      <XCircle size={12} className="mr-1" />
                      Reset
                    </Button>
                  )}
                </div>
              )}

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

              {/* Show message when no pages are available */}
              {sortedOptions.length === 0 && !isActuallyLoading && (
                <div className="py-2 px-2 text-sm text-muted-foreground">
                  No pages available
                </div>
              )}

              {sortedOptions.map((page) => (
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
        <Button
          variant={showLoadingWarning ? "destructive" : "outline"}
          size="icon"
          onClick={handleRefresh}
          disabled={(isActuallyLoading && !showLoadingWarning) || disabled}
          title={
            showLoadingWarning
              ? "Force refresh (loading stuck)"
              : "Refresh pages"
          }>
          <RefreshCcw
            size={16}
            className={
              isActuallyLoading && !showLoadingWarning ? "animate-spin" : ""
            }
          />
        </Button>
      </div>

      {showLoadingWarning && (
        <div className="text-xs text-amber-500 flex items-center justify-between gap-1 mt-1 p-1 bg-amber-50 dark:bg-amber-950/20 rounded">
          <div className="flex items-center gap-1">
            <AlertCircle size={12} aria-hidden="true" />
            <span>
              Loading is taking longer than expected ({loadingDuration}s)
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs py-0 px-2"
            onClick={handleForceResetLoading}>
            Reset
          </Button>
        </div>
      )}

      {error && !isActuallyLoading && (
        <div className="text-xs text-destructive flex items-center gap-1 mt-1">
          <AlertCircle size={12} aria-hidden="true" />
          <span>Error: {error}</span>
        </div>
      )}

      {noPages && (
        <div className="text-xs text-amber-500 flex items-center gap-1 mt-1">
          <AlertCircle size={12} aria-hidden="true" />
          <span>No pages for this website. Add a page to get started.</span>
        </div>
      )}

      {currentPath && !currentPathInOptions && pageOptions.length > 0 && (
        <div className="text-xs text-destructive flex items-center gap-1 mt-1">
          <LinkIcon size={12} aria-hidden="true" />
          <span>Current path not in list: {currentPath}</span>
        </div>
      )}
    </div>
  )
}

// Export memoized component to prevent unnecessary re-renders
export const PageSelector = memo(PageSelectorComponent)
