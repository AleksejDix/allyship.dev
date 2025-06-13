'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Tables } from '@/database.types'
import { deletePage } from '@/features/pages/actions/delete'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Form } from '@workspace/ui/components/form'

type Props = {
  page: Tables<'Page'>
  space_id: string
  website_id: string
}

const deleteFormSchema = z.object({
  confirmDelete: z.boolean().refine(val => val === true, {
    message: 'You must confirm this action',
  }),
})

type DeleteFormData = z.infer<typeof deleteFormSchema>

export function PageDeleteDialog({ page, space_id, website_id }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  const form = useForm<DeleteFormData>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      confirmDelete: false,
    },
  })

  const { execute, isPending } = useServerAction(deletePage)

  const onSubmit = async () => {
    try {
      console.log('Starting delete submission')

      const [result, error] = await execute({
        id: page.id,
      })

      console.log('Delete action result:', { result, error })

      if (error) {
        console.error('Delete action failed:', error)
        form.setError('root', {
          type: 'server',
          message: error.message,
        })
        return
      }

      if (!result?.success) {
        console.error('Delete action failed:', result?.error)
        form.setError('root', {
          type: 'server',
          message: result?.error?.message ?? 'Failed to delete page',
        })
        return
      }

      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Unexpected error:', error)
      form.setError('root', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      })
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
              <Checkbox
                id="confirmDelete"
                checked={form.watch('confirmDelete')}
                onCheckedChange={checked => {
                  form.setValue('confirmDelete', checked === true)
                }}
                className="h-4 w-4"
              />
              <label
                htmlFor="confirmDelete"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I understand that this action cannot be undone
              </label>
            </div>

            <div
              className="text-sm text-destructive"
              role="alert"
              aria-live="polite"
            >
              {form.formState.errors.confirmDelete?.message && (
                <p>{form.formState.errors.confirmDelete.message}</p>
              )}
              {form.formState.errors.root?.message && (
                <p>{form.formState.errors.root.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!form.watch('confirmDelete') || isPending}
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
