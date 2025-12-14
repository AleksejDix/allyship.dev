'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Form } from '@workspace/ui/components/form'
import { Field } from '@workspace/ui/components/field'

const formSchema = z
  .object({
    name: z.string().min(1, 'Workspace name is required'),
    confirmName: z.string(),
  })
  .refine(data => data.name === data.confirmName, {
    message: 'Please type the workspace name to confirm',
    path: ['confirmName'],
  })

type FormData = z.infer<typeof formSchema>

type Space = {
  id: string
  name: string
  is_personal: boolean
}

interface SpaceDeleteProps {
  space: Space
}

export function SpaceDelete(props: SpaceDeleteProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const supabase = createClient()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    context: { spaceName: props.space.name },
    values: {
      name: props.space.name,
      confirmName: '',
    },
  })

  const onSubmit = async () => {
    setIsPending(true)

    try {
      const { error } = await supabase.rpc('delete_account', {
        account_id: props.space.id,
      })

      if (error) {
        form.setError('root', {
          type: 'server',
          message: error.message || 'Failed to delete workspace',
        })
        return
      }

      toast.success('Workspace deleted successfully')
      router.push('/spaces')
      router.refresh()
    } catch (err) {
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred',
      })
    } finally {
      setIsPending(false)
    }
  }

  // Don't render delete form for personal spaces
  if (props.space.is_personal) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle>Delete Space</CardTitle>
          <CardDescription>
            This is your personal space and cannot be deleted. It is
            automatically created when you sign up and is used to store your
            personal scans and websites.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Delete Space</CardTitle>
            <CardDescription>
              Permanently remove your space and all of its contents from the
              Allyship platform. This action is not reversible — please continue
              with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field
              name="name"
              label="Space Name"
              type="hidden"
              autoComplete="organization"
            />

            <Field
              name="confirmName"
              label="Space Name"
              type="text"
              autoComplete="organization"
              description="Please type the Space name to delete"
            />
            {form.formState.errors.root && (
              <div className="text-sm text-destructive mt-2" role="alert">
                {form.formState.errors.root.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-end py-4 border-t border-destructive/50 bg-destructive/5">
            <Button
              type="submit"
              size="sm"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
