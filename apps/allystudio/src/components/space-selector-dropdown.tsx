import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/core/supabase"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { useSpace } from "@/providers/space-provider"
import type { Database } from "@/types/database"
import {
  AlertCircle,
  ChevronsUpDown,
  Globe,
  Plus,
  RefreshCw
} from "lucide-react"
import { useEffect, useState } from "react"

type Space = Database["public"]["Tables"]["Space"]["Row"]

export function SpaceSelectorDropdown() {
  const { user } = useAuth()
  const { currentSpace, selectSpace } = useSpace()
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Load user's spaces
  useEffect(() => {
    async function loadSpaces() {
      if (!user) return

      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.from("Space").select()

        if (error) throw error

        setSpaces(data || [])
      } catch (err) {
        console.error("Failed to load spaces:", err)
        setError(
          err instanceof Error ? err : new Error("Failed to load spaces")
        )
      } finally {
        setLoading(false)
      }
    }

    loadSpaces()
  }, [user])

  // Handle space creation
  async function handleCreateSpace() {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("Space")
        .insert([{ name: "New Space" }])
        .select()
        .single()

      if (error) throw error

      setSpaces((prev) => [data, ...prev])
      selectSpace(data)
    } catch (err) {
      console.error("Failed to create space:", err)
      setError(err instanceof Error ? err : new Error("Failed to create space"))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Button variant="outline" className="w-[200px] justify-between" disabled>
        <Skeleton className="h-4 w-[100px]" />
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </Button>
    )
  }

  if (error) {
    return (
      <Button
        variant="outline"
        className="w-[200px] justify-between text-destructive"
        onClick={() => window.location.reload()}>
        <span className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="truncate">{error.message}</span>
        </span>
        <RefreshCw className="h-4 w-4" />
      </Button>
    )
  }

  if (spaces.length === 0) {
    return (
      <Button
        variant="outline"
        className="w-[200px] justify-between"
        onClick={handleCreateSpace}>
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>Create Space</span>
        </span>
        <Plus className="h-4 w-4" />
      </Button>
    )
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
            onSelect={() => selectSpace(space)}
            className="justify-between">
            <span className="truncate">{space.name}</span>
            {currentSpace?.id === space.id && (
              <Globe className="h-4 w-4 opacity-50" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleCreateSpace}>
          <Plus className="mr-2 h-4 w-4" />
          Create Space
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
