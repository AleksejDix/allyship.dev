'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useServerAction } from 'zsa-react'

import { Button } from '@workspace/ui/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@workspace/ui/components/alert'

import { contactFormAction } from './contact-action'
import { contactFormSchema } from './contact-schema'

export function ContactForm() {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const { execute, isPending } = useServerAction(contactFormAction)

  async function onSubmit(data: z.infer<typeof contactFormSchema>) {
    const [result, error] = await execute(data)

    if (error) {
      if (error.code === 'INPUT_PARSE_ERROR') {
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof z.infer<typeof contactFormSchema>, {
            type: 'server',
            message: messages?.join(', '),
          })
        })
      } else {
        form.setError('root.serverError', {
          type: 'server',
          message: error.message,
        })
      }
    }

    if (result?.success) {
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {form.formState?.errors?.root?.serverError?.type === 'server' && (
          <Alert variant="destructive">
            <TriangleAlert aria-hidden="true" size={16} />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {form.formState?.errors?.root?.serverError?.message}
            </AlertDescription>
          </Alert>
        )}

        {form.formState.isSubmitSuccessful && (
          <Alert variant="success">
            <TriangleAlert aria-hidden="true" size={16} />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your message has been sent successfully. We'll get back to you
              soon.
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your project..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isPending ? 'Sending...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
