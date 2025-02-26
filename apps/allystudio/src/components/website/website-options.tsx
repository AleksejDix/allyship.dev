import { Button } from "@/components/ui/button"
import { CurrentWebsiteIndicator } from "@/components/ui/current-indicator"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/database"
import { useSelector } from "@xstate/react"
import { Globe, Plus } from "lucide-react"
import { memo, useCallback, useEffect, useState } from "react"
import type { PropsWithChildren } from "react"

import { useWebsiteContext } from "./website-context"

// Define Website type
type Website = Database["public"]["Tables"]["Website"]["Row"]

// Use memo to prevent unnecessary re-renders
export const WebsiteOptions = memo(function WebsiteOptions({
  children
}: PropsWithChildren) {
  const actor = useWebsiteContext()
  const [newUrl, setNewUrl] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  // Use memoized selectors with Object.is comparison for better performance
  const websites = useSelector(
    actor,
    (state) => state.context.websites,
    Object.is
  )

  const shouldRender = useSelector(
    actor,
    (state) => state.matches({ loaded: "options" }),
    Object.is
  )

  // Add debug logging
  useEffect(() => {
    console.log("WebsiteOptions component:", {
      websites,
      shouldRender,
      state: actor.getSnapshot().value,
      context: actor.getSnapshot().context
    })
  }, [websites, shouldRender, actor])

  // Memoize the selection handler to prevent unnecessary recreations
  const handleSelect = useCallback(
    (website: Website) => {
      actor.send({ type: "WEBSITE_SELECTED", website })
    },
    [actor]
  )

  // Handle adding a new website
  const handleAddWebsite = () => {
    if (newUrl.trim()) {
      actor.send({ type: "ADD_WEBSITE", url: newUrl.trim() })
      setNewUrl("")
      setIsAdding(false)
    }
  }

  // Only render when in the loaded.options state
  if (!shouldRender) {
    return null
  }

  return (
    <>
      <div className="bg-background">
        <div className="px-4 py-6 text-center">
          <h2 className="text-xl font-semibold">Select a Website</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a website to analyze or add a new one
          </p>
        </div>

        <Button
          variant="outline"
          className="mx-4 mb-4 w-[calc(100%-2rem)] flex items-center justify-center gap-2"
          onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add New Website
        </Button>

        {/* Add new website form */}
        {isAdding && (
          <div className="mx-4 mb-4 p-4 border rounded-lg bg-card">
            <h3 className="text-sm font-medium mb-2">Add New Website</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button onClick={handleAddWebsite} disabled={!newUrl.trim()}>
                Add
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="text-xs">
              Cancel
            </Button>
          </div>
        )}

        {/* Website list */}
        <div className="border-t">
          {websites.map((website, index) => (
            <div
              key={website.id}
              className={cn(
                "border-b",
                index === websites.length - 1 && "border-b-0"
              )}>
              <CurrentWebsiteIndicator domain={website.normalized_url}>
                <button
                  onClick={() => handleSelect(website)}
                  className="w-full py-3 px-4 text-left hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Globe
                      className="h-5 w-5 text-muted-foreground flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {website.normalized_url}
                      </p>
                    </div>
                  </div>
                </button>
              </CurrentWebsiteIndicator>
            </div>
          ))}
        </div>
      </div>
      {children}
    </>
  )
})
