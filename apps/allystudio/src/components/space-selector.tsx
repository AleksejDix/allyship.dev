import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/core/supabase"
import { useAuth } from "@/providers/auth-provider"
import { useSpace } from "@/providers/space-provider"
import type { Database } from "@/types/database"
import { AlertCircle, Globe, Plus, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

type Space = Database["public"]["Tables"]["Space"]["Row"]

export function SpaceSelector() {
  const { user } = useAuth()
  const { context, selectSpace } = useSpace()
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
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-[200px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4 bg-destructive/10">
        <div className="flex items-start gap-2 text-destructive">
          <AlertCircle aria-hidden="true" className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Failed to load spaces</p>
            <p className="text-sm text-destructive/80">{error.message}</p>
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (spaces.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-start gap-2 text-muted-foreground">
          <Globe aria-hidden="true" className="w-5 h-5 shrink-0" />
          <div>
            <p>No spaces found</p>
            <p className="text-xs mt-1">
              Create a space to start analyzing websites
            </p>
            <div className="mt-2">
              <Button className="w-full" onClick={handleCreateSpace}>
                <Plus className="mr-2 h-4 w-4" />
                Create Space
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe
              aria-hidden="true"
              className="w-5 h-5 text-muted-foreground"
            />
            <h2 className="font-medium">Your Spaces</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleCreateSpace}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {spaces.map((space) => (
            <Button
              key={space.id}
              variant="outline"
              className={`w-full justify-start text-left ${
                context.currentSpace?.id === space.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : ""
              }`}
              onClick={() => selectSpace(space)}>
              <span className="truncate">{space.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
