"use client"

import * as React from "react"
import { useActionState } from "react"
import { Check } from "lucide-react"

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
  const [state, formAction] = useActionState(contactFormAction, {
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    success: false,
  })

  const formRef = React.useRef<HTMLFormElement>(null)
  const pending = state.success === false

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
          action={formAction}
          aria-labelledby="form-title"
          aria-describedby="form-description"
        >
          <CardContent className="flex flex-col gap-6">
            <div
              className="group/field grid gap-2"
              data-invalid={!!state.error?.details?.name}
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
                aria-invalid={!!state.error?.details?.name}
                aria-errormessage="error-name"
                defaultValue={state.defaultValues.name}
              />
              {state.error?.details?.name && (
                <p id="error-name" className="text-destructive text-sm">
                  {state.error.details.name}
                </p>
              )}
            </div>
            <div
              className="group/field grid gap-2"
              data-invalid={!!state.error?.details?.email}
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
                aria-invalid={!!state.error?.details?.email}
                aria-errormessage="error-email"
                defaultValue={state.defaultValues.email}
              />
              {state.error?.details?.email && (
                <p id="error-email" className="text-destructive text-sm">
                  {state.error.details.email}
                </p>
              )}
            </div>
            <div
              className="group/field grid gap-2"
              data-invalid={!!state.error?.details?.message}
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
                aria-invalid={!!state.error?.details?.message}
                aria-errormessage="error-message"
                defaultValue={state.defaultValues.message}
              />
              {state.error?.details?.message && (
                <p id="error-message" className="text-destructive text-sm">
                  {state.error.details.message}
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
