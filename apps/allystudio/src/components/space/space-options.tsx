import { useSpaceContext } from "@/components/space/space-context"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/database"
import { useSelector } from "@xstate/react"
import { useCallback } from "react"
import type { PropsWithChildren } from "react"

// Define Space type
type Space = Database["public"]["Tables"]["Space"]["Row"]

export function SpaceOptions({ children }: PropsWithChildren) {
  const actor = useSpaceContext()

  // Use memoized selectors with Object.is comparison for better performance
  const spaces = useSelector(actor, (state) => state.context.spaces, Object.is)

  const shouldRender = useSelector(
    actor,
    (state) => state.matches({ loaded: "options" }),
    Object.is
  )

  // Memoize the selection handler to prevent unnecessary recreations
  const handleSelect = useCallback(
    (space: Space) => {
      actor.send({ type: "SPACE_SELECTED", space })
    },
    [actor]
  )

  // Only render when in the loaded.options state
  if (!shouldRender) {
    return null
  }

  return (
    <>
      <div className="bg-background p-4">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Select a Space</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a space to start analyzing websites
            </p>
          </div>
          <div className="space-y-2">
            {spaces.map((space) => (
              <button
                key={space.id}
                onClick={() => handleSelect(space)}
                className={cn(
                  "w-full rounded-lg border bg-card p-4 text-left transition-colors",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2"
                )}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{space.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created {new Date(space.created_at).toLocaleDateString()}
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
}
