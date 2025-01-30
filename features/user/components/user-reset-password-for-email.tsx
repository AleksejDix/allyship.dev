"use client"

import { resetPasswordForEmail } from "@/features/user/actions/user-reset-password-for-email-action" // Update this to your RecoverPassword server action
import { ResetPasswordForEmailSchema } from "@/features/user/schemas/user-reset-password-for-email-schema" // Update this schema to match Recover password form
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

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
      email: "",
    },
  })

  const { execute } = useServerAction(resetPasswordForEmail)

  const onSubmit = async (
    data: z.infer<typeof ResetPasswordForEmailSchema>
  ) => {
    const [success, error] = await execute(data)

    // TODO: handle error

    if (success?.success) {
      form.reset()
      return
    }

    if (error) {
      form.setError("email", { message: error.message })
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
                <Field type="email" name="email" label="E-Mail" required />
                <Button type="submit" className="w-full">
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
