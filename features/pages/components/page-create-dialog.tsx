"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPage } from "@/features/pages/actions/create"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

type Props = {
  space_id: string
  website_id: string
}

const pageCreateSchema = z.object({
  url: z.string().url(),
})

type PageCreateForm = z.infer<typeof pageCreateSchema>

export function PageCreateDialog({ website_id }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()

  const form = useForm<PageCreateForm>({
    resolver: zodResolver(pageCreateSchema),
    defaultValues: {
      url: "",
    },
  })

  const { execute, isPending } = useServerAction(createPage)

  const onSubmit = async (data: PageCreateForm) => {
    setError(undefined)

    const [result, error] = await execute({
      url: data.url,
      website_id,
    })

    if (error) {
      setError(error.message)
      return
    }

    if (!result?.success) {
      setError(result?.error?.message ?? "Failed to create page")
      return
    }

    setOpen(false)
    form.reset()
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
            Add a new page to scan for accessibility issues. The page URL must
            belong to the website's domain. Query parameters will be removed
            from the URL.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Field
                name="url"
                type="url"
                label="URL"
                description="Enter the full URL of the page. Query parameters will be removed (e.g., https://example.com/about)."
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Page"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
