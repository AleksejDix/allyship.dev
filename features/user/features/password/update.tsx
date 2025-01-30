"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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

import { update } from "./actions"
import { schema, type Schema } from "./schemas"

export function PasswordUpdate() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  })

  const { execute, isPending } = useServerAction(update)

  const onSubmit = async (data: Schema) => {
    const [success, error] = await execute(data) // Pass the form data to the server action

    if (success) {
      form.reset()
      return
    }

    if (error) {
      form.setError("password", { message: error.message })
    }
  }

  return (
    <Card className="lg:grid lg:grid-cols-2 gap-4">
      <CardHeader>
        <CardTitle id="form-email-update">Update Password</CardTitle>
        <CardDescription>Please enter your new password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 lg:py-4">
        <Form {...form}>
          <form
            aria-labelledby="form-email-update"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Field
              name="password"
              label="New Password"
              type="password"
              autoComplete="new-password"
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
