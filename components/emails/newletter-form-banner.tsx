"use client"

import * as React from "react"
import { Check } from "lucide-react"
import * as ReactDom from "react-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { newsletterFormAction } from "./newsletter-action"

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

export function NewsletterFormSection({
  className,
}: React.ComponentProps<typeof Card>) {
  const [state, formAction, pending] = ReactDom.useFormState(
    newsletterFormAction,
    {
      defaultValues: {
        email: "",
      },
      success: false,
      errors: null,
    }
  )

  const formRef = React.useRef<HTMLFormElement>(null)

  const handleReset = () => {
    formRef.current?.reset() // Resets the form fields
  }

  return (
    <div className="py-8">
      <Card className={cn("w-full mx-auto rounded-lg shadow-lg", className)}>
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
            action={async (event) => {
              await formAction(event)
              if (state.success) {
                handleReset()
                document.getElementById("success-message")?.focus() // Move focus to the success message
              } else {
                const firstError = document.querySelector(
                  "[aria-invalid='true']"
                ) as HTMLElement
                firstError?.focus() // Focus the first error field
              }
            }}
            aria-labelledby="form-title"
            aria-describedby="form-description"
            className="space-y-4"
          >
            <CardContent className="flex gap-4 items-end">
              <div className="flex-1" data-invalid={!!state.errors?.email}>
                <Label
                  htmlFor="email"
                  className="group-data-[invalid=true]/field:text-destructive"
                >
                  Email <span aria-hidden="true">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="email"
                    name="email"
                    className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                    disabled={pending}
                    aria-invalid={!!state.errors?.email}
                    aria-errormessage="error-email"
                    defaultValue={state.defaultValues.email}
                  />
                  <Button type="submit" disabled={pending}>
                    {pending ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
                {state.errors?.email && (
                  <p id="error-email" className="text-destructive text-sm">
                    {state.errors.email}
                  </p>
                )}
              </div>
            </CardContent>
          </form>
        )}
      </Card>
    </div>
  )
}
