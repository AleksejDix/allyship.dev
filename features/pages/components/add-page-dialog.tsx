"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Tables } from "@/database.types"
import { addPage } from "@/features/pages/actions/add-page"
import { Plus } from "lucide-react"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  spaceId: string
  websiteId: string
  website: Tables<"Website">
}

export function AddPageDialog({ spaceId, websiteId, website }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const { execute, isPending } = useServerAction(addPage)
  const [error, setError] = useState<string>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)

    const [result, error] = await execute({
      url,
      spaceId,
    })

    if (error) {
      setError(error.message)
      return
    }

    if (!result?.success) {
      setError("Failed to create page")
      return
    }

    setOpen(false)
    setUrl("")
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Page</DialogTitle>
          <DialogDescription>
            Add a new page to scan for accessibility issues.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Page"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
