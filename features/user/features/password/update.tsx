"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, TriangleAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { useServerAction } from "zsa-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
    const [result, error] = await execute(data)

    if (error) {
      if (error.code === "INPUT_PARSE_ERROR") {
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof Schema, {
            type: "server",
            message: messages?.join(", "),
          })
        })
      } else {
        form.setError("root.serverError", {
          type: "server",
          message: error.message,
        })
      }
    }

    if (result?.success) {
      form.reset() // Reset the form after successful submission
    }
  }

  return (
    <Card className="lg:grid lg:grid-cols-2 gap-4">
      <CardHeader>
        <CardTitle id="form-password-update">Update Password</CardTitle>
        <CardDescription>Please enter your new password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 lg:py-4">
        <Form {...form}>
          <form
            noValidate
            aria-labelledby="form-password-update"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Field
              name="password"
              label="New Password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your new password"
              required
              description="Must be at least 8 characters long, with one uppercase letter, one number, and one special character."
            />

            {form.formState?.errors?.root?.serverError?.type === "server" && (
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
                  Your password has been updated successfully.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
