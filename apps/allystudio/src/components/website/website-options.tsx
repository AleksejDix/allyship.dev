import { CurrentIndicator } from "@/components/ui/current-indicator"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/database.types"
import { useSelector } from "@xstate/react"
import { Globe } from "lucide-react"
import { memo, useCallback } from "react"
import type { PropsWithChildren } from "react"

import { useWebsiteContext } from "./website-context"

// Define Website type
type Website = Database["public"]["Tables"]["Website"]["Row"]

// Use memo to prevent unnecessary re-renders
export const WebsiteOptions = memo(function WebsiteOptions({
  children
}: PropsWithChildren) {
  const actor = useWebsiteContext()

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

  // Memoize the selection handler to prevent unnecessary recreations
  const handleSelect = useCallback(
    (website: Website) => {
      actor.send({ type: "WEBSITE_SELECTED", website })
    },
    [actor]
  )

  // Only render when in the loaded.options state
  if (!shouldRender) {
    return null
  }

  return (
    <>
      <div className="flex justify-between items-center px-2">
        <h1>Websites</h1>
        {children}
      </div>
      <div className="bg-background">
        {/* Website list */}
        <div className="border-t">
          {websites.map((website, index) => (
            <div
              key={website.id}
              className={cn(
                "border-b",
                index === websites.length - 1 && "border-b-0"
              )}>
              <CurrentIndicator hostname={website.normalized_url}>
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
              </CurrentIndicator>
            </div>
          ))}
        </div>
      </div>
    </>
  )
})
