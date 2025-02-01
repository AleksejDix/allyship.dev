"use client"

import { resetPasswordForEmail } from "@/features/user/actions/user-reset-password-for-email-action" // Update this to your RecoverPassword server action
import { ResetPasswordForEmailSchema } from "@/features/user/schemas/user-reset-password-for-email-schema" // Update this schema to match Recover password form
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, TriangleAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"
import { RouterLink } from "@/components/RouterLink"
import { Logo } from "@/components/site/Logo"

export function UserResetPasswordForEmail({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof ResetPasswordForEmailSchema>>({
    resolver: zodResolver(ResetPasswordForEmailSchema),
    defaultValues: {
      username: "",
    },
  })

  const { execute, isPending } = useServerAction(resetPasswordForEmail)

  const onSubmit = async (
    formData: z.infer<typeof ResetPasswordForEmailSchema>
  ) => {
    const [data, validationError] = await execute(formData)

    if (validationError) {
      if (validationError.code === "INPUT_PARSE_ERROR") {
        Object.entries(validationError.fieldErrors).forEach(
          ([field, messages]) => {
            form.setError(
              field as keyof z.infer<typeof ResetPasswordForEmailSchema>,
              {
                type: "server",
                message: messages?.join(", "),
              }
            )
          }
        )
      } else {
        console.error(validationError)
      }
    }

    if (data && !data.success) {
      form.setError("root.serverError", {
        message: data.error?.message,
        type: "server",
      })
    } else if (data?.success) {
      form.reset()
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="mx-auto">
        <RouterLink href="/">
          <Logo />
        </RouterLink>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          aria-labelledby="recover-password-form"
          noValidate
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <h1 id="recover-password-form">Recover Password</h1>
              </CardTitle>
              <CardDescription>
                Enter your email below, and we will send you a password reset
                link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <Field
                  type="email"
                  name="username"
                  autoComplete="username"
                  label="E-Mail"
                  required
                />

                {form.formState?.errors?.root?.serverError?.type ===
                  "server" && (
                  <Alert variant="destructive">
                    <TriangleAlert aria-hidden="true" size={16} />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>
                      {form.formState?.errors?.root?.serverError?.message}
                    </AlertDescription>
                  </Alert>
                )}

                {form.formState.isSubmitSuccessful &&
                  !(
                    form.formState?.errors?.root?.serverError?.type === "server"
                  ) && (
                    <Alert variant="success">
                      <TriangleAlert aria-hidden="true" size={16} />
                      <AlertTitle>Check your email</AlertTitle>
                      <AlertDescription>
                        We sent you an email to verify your account.
                      </AlertDescription>
                    </Alert>
                  )}

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <LoaderCircle
                      className="-ms-1 me-2 animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : null}
                  Send Reset Link
                </Button>
              </div>
            </CardContent>
            <CardFooter className="gap-4 text-sm">
              <RouterLink
                href="/auth/login"
                className="underline underline-offset-4"
              >
                Back to Login
              </RouterLink>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
