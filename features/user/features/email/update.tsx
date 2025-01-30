"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

import { updateEmail } from "./actions"
import { FormUpdateEmailSchema } from "./schemas"

export function EmailUpdate({ email }: { email: string | undefined }) {
  const form = useForm<z.infer<typeof FormUpdateEmailSchema>>({
    resolver: zodResolver(FormUpdateEmailSchema),
    defaultValues: {
      email: email ?? "",
    },
  })

  const { execute, isPending } = useServerAction(updateEmail)

  const onSubmit = async (data: z.infer<typeof FormUpdateEmailSchema>) => {
    const [success, error] = await execute(data) // Pass the form data to the server action

    if (success) {
      form.reset()
      return
    }

    if (error) {
      form.setError("email", { message: error.message })
    }
  }

  return (
    <Card className="lg:grid lg:grid-cols-2 gap-4">
      <CardHeader>
        <CardTitle id="form-email-update">Your Email</CardTitle>
        <CardDescription>
          Please enter the email address you want to use to login
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 lg:py-4">
        <Form {...form}>
          <form
            aria-labelledby="form-email-update"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Field
              name="email"
              label="E-Mail"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
            />
            {form.formState?.errors?.root?.serverError?.type === "server" && (
              <div
                aria-live="polite"
                role="alert"
                className="text-red-500 text-sm"
              >
                {form.formState?.errors?.root?.serverError?.message}
              </div>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
