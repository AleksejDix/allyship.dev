'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'

import { newsletterFormAction } from './newsletter-action'

function Success() {
  return (
    <p
      className="text-muted-foreground flex items-center gap-2 text-sm"
      tabIndex={-1}
      aria-live="polite"
    >
      <Check className="size-4" />
      Please check your email to confirm your subscription to our newsletter.
    </p>
  )
}

export function NewsletterForm({
  className,
}: React.ComponentProps<typeof Card>) {
  const [state, formAction, pending] = useActionState(newsletterFormAction, {
    defaultValues: {
      email: '',
    },
    success: false,
    errors: null,
  })

  const formRef = React.useRef<HTMLFormElement>(null)

  const handleReset = () => {
    formRef.current?.reset() // Resets the form fields
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle id="form-title">Subscribe to our Newsletter</CardTitle>
        <CardDescription id="form-description">
          We will not spam you. We promise.
        </CardDescription>
      </CardHeader>

      {state.success ? (
        <CardContent className="flex flex-col gap-6">
          <Success />
        </CardContent>
      ) : (
        <form
          noValidate
          ref={formRef}
          action={async event => {
            await formAction(event)
            if (state.success) {
              handleReset()
              document.getElementById('success-message')?.focus() // Move focus to the success message
            } else {
              const firstError = document.querySelector(
                "[aria-invalid='true']"
              ) as HTMLElement
              firstError?.focus() // Focus the first error field
            }
          }}
          aria-labelledby="form-title"
          aria-describedby="form-description"
        >
          <CardContent className="flex flex-col gap-6">
            <div
              className="group/field grid gap-2"
              data-invalid={!!state.errors?.email}
            >
              <Label
                htmlFor="email"
                className="group-data-[invalid=true]/field:text-destructive"
              >
                Email <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                disabled={pending}
                aria-invalid={!!state.errors?.email}
                aria-errormessage="error-email"
                defaultValue={state.defaultValues.email}
              />
              {state.errors?.email && (
                <p id="error-email" className="text-destructive text-sm">
                  {state.errors.email}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
