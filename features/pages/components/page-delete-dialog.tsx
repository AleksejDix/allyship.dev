"use client"

import { useState } from "react"
import type { Tables } from "@/database.types"
import { deletePage } from "@/features/pages/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

type Props = {
  page: Tables<"Page">
  space_id: string
  website_id: string
}

const deleteFormSchema = z.object({
  confirmDelete: z.boolean().refine((val) => val === true, {
    message: "Please confirm deletion",
  }),
})

type DeleteFormData = z.infer<typeof deleteFormSchema>

export function PageDeleteDialog({ page, space_id, website_id }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { execute, isPending } = useServerAction(deletePage)

  const form = useForm<DeleteFormData>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      confirmDelete: false,
    },
  })

  const onSubmit = async () => {
    console.log("Starting delete submission")
    const [result, actionError] = await execute({
      id: page.id,
      space_id,
      website_id,
    })

    console.log("Delete action result:", result)
    console.log("Delete action error:", actionError)

    if (actionError) {
      console.error("Delete action failed:", actionError)
      form.setError("root", {
        type: "server",
        message: actionError.message,
      })
      return
    }

    if (result?.success && result.redirect) {
      window.location.href = result.redirect
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (isPending) return
    setIsOpen(open)
    if (!open) {
      form.reset()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete page</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Page</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this page? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirmDelete"
                {...form.register("confirmDelete")}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="confirmDelete" className="text-sm">
                I understand that this action cannot be undone
              </label>
            </div>

            {form.formState.errors.root?.message && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.root.message}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.watch("confirmDelete") || isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
