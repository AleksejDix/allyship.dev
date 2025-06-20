'use client'

import { createWebsite } from '@/features/websites/actions'
import { normalizeUrlString } from '@allystudio/url-utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import { Button } from '@workspace/ui/components/button'
import { Form } from '@workspace/ui/components/form'
import { Field } from '@workspace/ui/components/field'

const formSchema = z.object({
  url: z.string().transform((url, ctx) => {
    const trimmed = url.trim()
    if (trimmed.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a website URL',
      })
      return z.NEVER
    }

    try {
      // Add protocol if missing
      const urlWithProtocol = trimmed.startsWith('http')
        ? trimmed
        : `https://${trimmed}`
      return normalizeUrlString(urlWithProtocol) // Don't keep query params for websites
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error instanceof Error ? error.message : 'Invalid URL format',
      })
      return z.NEVER
    }
  }),
  space_id: z.string(),
})

type FormData = z.infer<typeof formSchema>

type Props = {
  space_id: string
  onSuccess?: () => void
}

export function WebsiteCreate({ space_id, onSuccess }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      space_id,
    },
  })

  const { execute, isPending } = useServerAction(createWebsite)

  const onSubmit = async (data: FormData) => {
    const [response, validationError] = await execute(data)
    console.log(response, validationError)

    if (validationError) {
      if (validationError.code === 'INPUT_PARSE_ERROR') {
        Object.entries(validationError.fieldErrors).forEach(
          ([field, messages]) => {
            form.setError(field as keyof FormData, {
              type: 'server',
              message: messages?.join(', '),
            })
          }
        )
      }
      return
    }

    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Field
          type="text"
          name="url"
          label="Website URL"
          description="Enter the website URL (e.g., example.com or www.example.com)"
          placeholder="example.com"
        />

        <Field type="hidden" name="space_id" label="Space ID" />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </form>
    </Form>
  )
}
