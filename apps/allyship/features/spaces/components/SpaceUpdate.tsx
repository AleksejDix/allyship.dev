'use client'

import { useState } from 'react'
import { Tables } from '@/apps/AllyShip/database.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Form } from '@workspace/ui/components/form'
import { Field } from '@workspace/ui/components/field'

const formSchema = z.object({
  name: z.string().min(1, 'Workspace name is required'),
  id: z.string().min(1, 'ID is required'),
})

type FormData = z.infer<typeof formSchema>

interface SpaceUpdateProps {
  space: Tables<'Space'>
}

export function SpaceUpdate(props: SpaceUpdateProps) {
  const [isPending, setIsPending] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      name: props.space.name || '',
      id: props.space.id,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsPending(true)

    try {
      const { error } = await supabase.rpc('update_account', {
        account_id: data.id,
        name: data.name,
      })

      if (error) {
        form.setError('root', {
          type: 'server',
          message: error.message || 'Failed to update workspace',
        })
        return
      }

      toast.success('Workspace updated successfully')
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

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Name Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Field
              name="name"
              label="Workspace Name"
              type="text"
              autoComplete="organization"
              description="This is your space's visible name within Allyship. For example, the name of your company or department."
              disabled={isPending}
            />
            <Field name="id" label="id" type="hidden" />
            {form.formState.errors.root && (
              <div className="text-sm text-destructive mt-2" role="alert">
                {form.formState.errors.root.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-end border-t border-border py-4">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? 'Updating...' : 'Update'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
