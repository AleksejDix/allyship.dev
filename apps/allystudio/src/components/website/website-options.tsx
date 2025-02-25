import { Button } from "@/components/ui/button"
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
      <div className="bg-background p-4">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Select a Website</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a website to analyze or add a new one
            </p>
          </div>

          {/* Add new website form */}
          {isAdding ? (
            <div className="p-4 border rounded-lg bg-card">
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
          ) : (
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add New Website
            </Button>
          )}

          {/* Website list */}
          <div className="space-y-2">
            {websites.map((website) => (
              <button
                key={website.id}
                onClick={() => handleSelect(website)}
                className={cn(
                  "w-full rounded-lg border bg-card p-4 text-left transition-colors",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2"
                )}>
                <div className="flex items-center gap-3">
                  <Globe
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium">{website.normalized_url}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Added {new Date(website.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {children}
    </>
  )
})
