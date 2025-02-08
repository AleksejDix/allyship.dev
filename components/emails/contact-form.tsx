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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { contactFormAction } from "./contact-action"

function Success() {
  return (
    <p
      className="text-muted-foreground flex items-center gap-2 text-sm"
      tabIndex={-1}
      aria-live="polite"
    >
      <Check className="size-4" />
      Your message has been sent. Thank you.
    </p>
  )
}

export function ContactForm({ className }: React.ComponentProps<typeof Card>) {
  const [state, formAction, pending] = ReactDom.useFormState(
    contactFormAction,
    {
      defaultValues: {
        name: "",
        email: "",
        message: "",
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
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle id="form-title">Get in touch with us.</CardTitle>
        <CardDescription id="form-description">
          Need help with your project? We&apos;re here to assist you.
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
        >
          <CardContent className="flex flex-col gap-6">
            <div
              className="group/field grid gap-2"
              data-invalid={!!state.errors?.name}
            >
              <Label
                htmlFor="name"
                className="group-data-[invalid=true]/field:text-destructive"
              >
                Name <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                disabled={pending}
                aria-invalid={!!state.errors?.name}
                aria-errormessage="error-name"
                defaultValue={state.defaultValues.name}
              />
              {state.errors?.name && (
                <p id="error-name" className="text-destructive text-sm">
                  {state.errors.name}
                </p>
              )}
            </div>
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
            <div
              className="group/field grid gap-2"
              data-invalid={!!state.errors?.message}
            >
              <Label
                htmlFor="message"
                className="group-data-[invalid=true]/field:text-destructive"
              >
                Message <span aria-hidden="true">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Type your message here..."
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                disabled={pending}
                aria-invalid={!!state.errors?.message}
                aria-errormessage="error-message"
                defaultValue={state.defaultValues.message}
              />
              {state.errors?.message && (
                <p id="error-message" className="text-destructive text-sm">
                  {state.errors.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Sending..." : "Send Message"}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
