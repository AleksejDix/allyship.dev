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

import { type Website } from "../api/sdk"

type WebsiteSelectorProps = {
  websiteOptions: Website[]
  selectedWebsiteId: string | null
  onWebsiteChange: (websiteId: string) => void
  onRefresh: () => void
  isLoading: boolean
  error?: string | null
  label?: string
  highlightStatus?: "known" | "unknown"
  currentDomain?: string | null
  optimisticWebsite?: Website | null
  forceResetLoading?: () => void
}

// Track if the loading state has persisted too long
const LOADING_WARNING_THRESHOLD = 10000 // 10 seconds

/**
 * Component for selecting a website from a list
 */
function WebsiteSelectorComponent({
  websiteOptions,
  selectedWebsiteId,
  onWebsiteChange,
  onRefresh,
  isLoading,
  error,
  label = "Website",
  highlightStatus,
  currentDomain,
  optimisticWebsite,
  forceResetLoading
}: WebsiteSelectorProps) {
  // Create a special value for showing current domain when it's not in the list
  const CURRENT_DOMAIN_VALUE = "current-domain-placeholder"
  const OPTIMISTIC_DOMAIN_VALUE = "optimistic-domain-placeholder"

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

  // Combine optimistic website with websiteOptions if present
  const displayWebsiteOptions = optimisticWebsite
    ? [...websiteOptions, optimisticWebsite]
    : websiteOptions

  // Track if we should show the current domain as selection
  const [showCurrentDomain, setShowCurrentDomain] = useState(false)

  // Check if current domain is in options or matches optimistic website
  const currentDomainInOptions =
    currentDomain &&
    (displayWebsiteOptions.some(
      (website) => website.normalized_url === currentDomain
    ) ||
      optimisticWebsite?.normalized_url === currentDomain)

  // Find matching website
  const matchingWebsite = currentDomain
    ? displayWebsiteOptions.find(
        (website) => website.normalized_url === currentDomain
      )
    : null

  // Always show current domain if available and no match exists in the options
  useEffect(() => {
    if (currentDomain && !currentDomainInOptions) {
      setShowCurrentDomain(true)
    } else if (matchingWebsite) {
      // If there's a matching website for the current domain, select it through normal means
      setShowCurrentDomain(false)
      if (selectedWebsiteId !== matchingWebsite.id) {
        onWebsiteChange(matchingWebsite.id)
      }
    } else {
      setShowCurrentDomain(false)
    }
  }, [
    currentDomain,
    currentDomainInOptions,
    matchingWebsite,
    selectedWebsiteId,
    onWebsiteChange
  ])

  // Handle value change - prevent selection of placeholder
  const handleValueChange = (value: string) => {
    if (value !== CURRENT_DOMAIN_VALUE && value !== OPTIMISTIC_DOMAIN_VALUE) {
      onWebsiteChange(value)
      setShowCurrentDomain(false)
    }
  }

  // Check if the currently selected website is the optimistic one
  const isOptimisticSelected =
    optimisticWebsite && selectedWebsiteId === optimisticWebsite.id

  // Choose display value based on state
  const displayValue = isOptimisticSelected
    ? OPTIMISTIC_DOMAIN_VALUE
    : showCurrentDomain
      ? CURRENT_DOMAIN_VALUE
      : selectedWebsiteId || ""

  // Auto-select website if only one option or if it matches current domain
  useEffect(() => {
    if (!selectedWebsiteId && websiteOptions.length > 0) {
      // Case 1: Auto-select if there's only one website
      if (websiteOptions.length === 1) {
        onWebsiteChange(websiteOptions[0].id)
        return
      }

      // Case 2: Auto-select if we have a current domain that matches
      if (currentDomain) {
        const matchingWebsite = websiteOptions.find(
          (site) => site.normalized_url === currentDomain
        )
        if (matchingWebsite) {
          onWebsiteChange(matchingWebsite.id)
          return
        }
      }
    }
  }, [websiteOptions, selectedWebsiteId, onWebsiteChange, currentDomain])

  // Skip rendering optimistic data if we're not in the loading state
  const shouldShowOptimistic = optimisticWebsite && isActuallyLoading
  const displayOptions = shouldShowOptimistic
    ? [...websiteOptions, optimisticWebsite]
    : websiteOptions

  // Sort options alphabetically by URL
  const sortedOptions = [...displayOptions].sort((a, b) =>
    a.normalized_url.localeCompare(b.normalized_url)
  )

  // Handle refresh with debounce
  const handleRefresh = () => {
    if (isActuallyLoading && !showLoadingWarning) return // Prevent refresh while already loading (unless stuck)

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

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select
          value={displayValue}
          onValueChange={handleValueChange}
          disabled={isActuallyLoading}>
          <SelectTrigger
            className={cn(
              highlightStatus
                ? highlightStatus === "known"
                  ? "border-success"
                  : highlightStatus === "unknown"
                    ? "border-destructive"
                    : ""
                : "",
              // Apply red styling when there's a current domain not in the list
              currentDomain && !currentDomainInOptions
                ? "text-destructive border-destructive"
                : "",
              // Apply a special style for optimistic updates
              isOptimisticSelected
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "",
              // Loading state visual indicator
              isActuallyLoading && "border-amber-500 animate-pulse"
            )}>
            {isOptimisticSelected && optimisticWebsite ? (
              <>
                {optimisticWebsite.normalized_url}
                <span className="text-xs italic ml-2">(adding...)</span>
              </>
            ) : showCurrentDomain && currentDomain ? (
              <span className="text-destructive">
                {currentDomain} (not in list)
              </span>
            ) : isActuallyLoading ? (
              <span className="text-amber-500">
                Loading websites
                {showLoadingWarning ? ` (${loadingDuration}s)` : "..."}
              </span>
            ) : (
              <SelectValue placeholder={currentDomain || "Select a website"} />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* Show loading indicator */}
              {isActuallyLoading && (
                <div className="flex items-center justify-between gap-2 p-2 border-b border-border">
                  <span className="text-amber-500 animate-pulse text-sm">
                    Loading websites
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

              {/* Show current domain as first option when not in list */}
              {currentDomain && !currentDomainInOptions && (
                <SelectItem
                  key={CURRENT_DOMAIN_VALUE}
                  value={CURRENT_DOMAIN_VALUE}
                  className="text-destructive border-b border-border pb-2 mb-2"
                  disabled>
                  {currentDomain} (not in list)
                </SelectItem>
              )}

              {/* Show optimistic website if it exists */}
              {optimisticWebsite && (
                <SelectItem
                  key={optimisticWebsite.id}
                  value={optimisticWebsite.id}
                  className="text-primary border-primary border-b border-border pb-2 mb-2">
                  {optimisticWebsite.normalized_url}
                  <span className="text-xs italic ml-2">(adding...)</span>
                </SelectItem>
              )}

              {sortedOptions.map((website) => (
                <SelectItem
                  key={website.id}
                  value={website.id}
                  className={
                    currentDomain && website.normalized_url === currentDomain
                      ? "border-primary bg-primary/5"
                      : ""
                  }>
                  {website.normalized_url}
                  {currentDomain &&
                    website.normalized_url === currentDomain && (
                      <span className="ml-2 text-xs text-primary">
                        • current
                      </span>
                    )}
                </SelectItem>
              ))}

              {!isActuallyLoading && sortedOptions.length === 0 && (
                <div className="py-2 px-2 text-sm text-muted-foreground">
                  No websites available
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant={showLoadingWarning ? "destructive" : "outline"}
          size="icon"
          onClick={handleRefresh}
          disabled={isActuallyLoading && !showLoadingWarning}
          title={
            showLoadingWarning
              ? "Force refresh (loading stuck)"
              : "Refresh websites"
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

      {currentDomain &&
        !currentDomainInOptions &&
        websiteOptions.length > 0 && (
          <div className="text-xs text-destructive flex items-center gap-1 mt-1">
            <LinkIcon size={12} aria-hidden="true" />
            <span>Current domain not in list: {currentDomain}</span>
          </div>
        )}
    </div>
  )
}

// Export memoized component to prevent unnecessary re-renders
export const WebsiteSelector = memo(WebsiteSelectorComponent)
