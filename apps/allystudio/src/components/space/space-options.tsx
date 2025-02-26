import { useSpaceContext } from "@/components/space/space-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/database"
import { useSelector } from "@xstate/react"
import { Briefcase, Plus } from "lucide-react"
import { useCallback, useState } from "react"
import type { PropsWithChildren } from "react"

// Define Space type
type Space = Database["public"]["Tables"]["Space"]["Row"]

export function SpaceOptions({ children }: PropsWithChildren) {
  const actor = useSpaceContext()
  const [isAdding, setIsAdding] = useState(false)
  const [newSpaceName, setNewSpaceName] = useState("")

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

  // Handle adding a new space
  const handleAddSpace = () => {
    if (newSpaceName.trim()) {
      // TODO: Implement add space functionality
      setNewSpaceName("")
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
          <h2 className="text-xl font-semibold">Select a Space</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a space to start analyzing websites
          </p>
        </div>

        <Button
          variant="outline"
          className="mx-4 mb-4 w-[calc(100%-2rem)] flex items-center justify-center gap-2"
          onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add New Space
        </Button>

        {/* Add new space form */}
        {isAdding && (
          <div className="mx-4 mb-4 p-4 border rounded-lg bg-card">
            <h3 className="text-sm font-medium mb-2">Add New Space</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="Enter space name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button onClick={handleAddSpace} disabled={!newSpaceName.trim()}>
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

        {/* Space list */}
        <div className="border-t">
          {spaces.map((space, index) => (
            <div
              key={space.id}
              className={cn(
                "border-b",
                index === spaces.length - 1 && "border-b-0"
              )}>
              <button
                onClick={() => handleSelect(space)}
                className="w-full py-3 px-4 text-left hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Briefcase
                    className="h-5 w-5 text-muted-foreground flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{space.name}</p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      {children}
    </>
  )
}
