import { useSpaceContext } from "@/components/space/space-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/database.types"
import { useSelector } from "@xstate/react"
import { ChevronsUpDown, Globe } from "lucide-react"
import { useCallback } from "react"

// Define Space type
type Space = Database["public"]["Tables"]["Space"]["Row"]

export function SpaceOptionsDropdown() {
  const actor = useSpaceContext()

  // Add error boundary for selector calls
  let spaces: Space[] = []
  let currentSpace: Space | null = null

  try {
    spaces = useSelector(actor, (state) => state.context.spaces || [])
    currentSpace = useSelector(
      actor,
      (state) => state.context.currentSpace || null
    )
  } catch (error) {
    console.error("Error in SpaceOptionsDropdown selectors:", error)
    return null
  }

  // Memoize the selection handler to prevent unnecessary recreations
  const handleSelect = useCallback(
    (space: Space) => {
      try {
        actor.send({ type: "SPACE_SELECTED", space })
      } catch (error) {
        console.error("Error selecting space:", error)
      }
    },
    [actor]
  )

  // Don't render if no spaces or only one space
  if (!spaces || spaces.length <= 1) {
    return null
  }

  // Ensure we have valid space data before rendering
  const validSpaces = spaces.filter((space) => space && space.id && space.name)
  if (validSpaces.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[200px] justify-between",
            !currentSpace && "text-muted-foreground"
          )}>
          <span className="flex items-center gap-2">
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span className="truncate">
              {currentSpace?.name || "Select Space"}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Your Spaces</DropdownMenuLabel>
        {validSpaces.map((space) => (
          <DropdownMenuItem
            key={space.id}
            onClick={() => handleSelect(space)}
            className="justify-between">
            <span className="truncate">{space.name}</span>
            {currentSpace?.id === space.id && (
              <Globe className="h-4 w-4 opacity-50" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
