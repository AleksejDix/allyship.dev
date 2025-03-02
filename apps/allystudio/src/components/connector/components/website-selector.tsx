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

import { type Website } from "../api/sdk"

type WebsiteSelectorProps = {
  websiteOptions: Website[]
  selectedWebsiteId: string | null
  onWebsiteChange: (websiteId: string) => void
  onRefresh: () => void
  isLoading: boolean
  label?: string
  highlightStatus?: "known" | "unknown"
  currentDomain?: string | null
  optimisticWebsite?: Website | null
}

/**
 * Component for selecting a website from a list
 */
export function WebsiteSelector({
  websiteOptions,
  selectedWebsiteId,
  onWebsiteChange,
  onRefresh,
  isLoading,
  label = "Website",
  highlightStatus,
  currentDomain,
  optimisticWebsite
}: WebsiteSelectorProps) {
  // Create a special value for showing current domain when it's not in the list
  const CURRENT_DOMAIN_VALUE = "current-domain-placeholder"
  const OPTIMISTIC_DOMAIN_VALUE = "optimistic-domain-placeholder"

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

  return (
    <div className="grid gap-2">
      <Label htmlFor="website">{label}</Label>
      <Select value={displayValue} onValueChange={handleValueChange}>
        <SelectTrigger
          id="website"
          disabled={isLoading}
          className={cn(
            highlightStatus
              ? highlightStatus === "known"
                ? "border-success bg-success/10"
                : "border-destructive bg-destructive/10"
              : "",
            // Apply red styling when there's a current domain not in the list
            currentDomain && !currentDomainInOptions
              ? "text-destructive border-destructive"
              : "",
            // Apply a special style for optimistic updates
            isOptimisticSelected
              ? "border-primary bg-primary/10 text-primary font-medium"
              : ""
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
          ) : (
            <SelectValue placeholder={currentDomain || "Select a website"} />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
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

            {websiteOptions.map((website) => (
              <SelectItem
                key={website.id}
                value={website.id}
                className={
                  currentDomain && website.normalized_url === currentDomain
                    ? "border-primary bg-primary/5"
                    : ""
                }>
                {website.normalized_url}
                {currentDomain && website.normalized_url === currentDomain && (
                  <span className="ml-2 text-xs text-primary">• current</span>
                )}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {currentDomain &&
        !currentDomainInOptions &&
        websiteOptions.length > 0 && (
          <div className="text-xs text-destructive flex items-center gap-1 mt-1">
            <LinkIcon size={12} aria-hidden="true" />
            <span>Current domain not in list: {currentDomain}</span>
          </div>
        )}

      <Button
        variant="outline"
        size="sm"
        disabled={isLoading}
        onClick={onRefresh}>
        {isLoading ? "Loading..." : "Refresh"}
      </Button>
    </div>
  )
}
