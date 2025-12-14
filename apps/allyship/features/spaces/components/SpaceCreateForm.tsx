"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type SpaceCreateFormProps = {
  onSuccess?: () => void
}

export function SpaceCreateForm({ onSuccess }: SpaceCreateFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string

    try {
      const { data, error } = await supabase.rpc("create_account", {
        name,
        slug,
      })

      if (error) {
        toast.error(error.message || "Failed to create space")
        return
      }

      toast.success("Space created successfully")
      onSuccess?.()
      router.push(`/spaces/${data.account_id}`)
      router.refresh()
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-6"
    >
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="name">Space Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="My Space"
          required
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="slug">Space Identifier</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="my-space"
          pattern="[a-z0-9-]+"
          title="Only lowercase letters, numbers, and hyphens"
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Used in the URL: /spaces/my-space-slug
        </p>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Space"}
      </Button>
    </form>
  )
}
