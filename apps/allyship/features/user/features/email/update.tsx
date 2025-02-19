"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, TriangleAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
    const [result, error] = await execute(data)

    if (error) {
      if (error.code === "INPUT_PARSE_ERROR") {
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof z.infer<typeof FormUpdateEmailSchema>, {
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
      form.reset({ email: data.email }) // Reset the form with the new email
    }
  }

  return (
    <Card className="lg:grid lg:grid-cols-2 gap-4">
      <CardHeader>
        <CardTitle id="form-email-update">Your Email</CardTitle>
        <CardDescription>
          Please enter the email address you want to use to login.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 lg:py-4">
        <Form {...form}>
          <form
            noValidate
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
                  Your email has been updated successfully.
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
