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
import { useSelector } from "@xstate/react"
import { ChevronsUpDown, Globe } from "lucide-react"

export function SpaceOptionsDropdown() {
  const actor = useSpaceContext()

  const spaces = useSelector(actor, (state) => state.context.spaces)
  const currentSpace = useSelector(actor, (state) => state.context.currentSpace)

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
            <Globe className="h-4 w-4" />
            <span className="truncate">
              {currentSpace?.name || "Select Space"}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Your Spaces</DropdownMenuLabel>
        {spaces.map((space) => (
          <DropdownMenuItem
            key={space.id}
            onSelect={() => actor.send({ type: "SPACE_SELECTED", space })}
            className="justify-between">
            <span className="truncate">{space.name}</span>
            {currentSpace?.id === space.id && (
              <Globe className="h-4 w-4 opacity-50" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
