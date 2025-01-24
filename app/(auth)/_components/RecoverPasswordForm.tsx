"use client"

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RouterLink } from "@/components/RouterLink"
import { Logo } from "@/components/site/Logo"

import { resetPasswordForEmail } from "../_actions" // Update this to your RecoverPassword server action
import { ResetPasswordForEmailSchema } from "../_schemas/form" // Update this schema to match Recover password form

export function RecoverPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof ResetPasswordForEmailSchema>>({
    resolver: zodResolver(ResetPasswordForEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  const { execute } = useServerAction(resetPasswordForEmail, {
    onSuccess: () => {
      alert("If this email exists, a reset link has been sent.") // User feedback
    },
    onError: () => {
      console.error("Error sending reset email.")
    },
  })

  const onSubmit = async (
    data: z.infer<typeof ResetPasswordForEmailSchema>
  ) => {
    execute(data) // Pass the form data to the server action
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
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          E-Mail <span aria-hidden="true">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="email" {...field} autoComplete="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
