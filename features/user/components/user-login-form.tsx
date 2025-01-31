"use client"

import React from "react"
import { signInWithPassword } from "@/features/user/actions/user-actions"
import { LoginWithGoogle } from "@/features/user/components/user-login-with-google"
import { LoginFormSchema } from "@/features/user/schemas/user-schemas"
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
import { LinkRecoverPassword } from "@/app/(auth)/_components/LinkRecoverPassword"

export function UserLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showSuccess, setShowSuccess] = React.useState(false)
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { execute, isPending } = useServerAction(signInWithPassword, {
    onSuccess: (data) => {
      console.log("data", data)
      setShowSuccess(true)
    },
    onError: (error) => {
      console.error("Error", error)
    },
  })

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    const [response] = await execute(data) // Pass the form data to the server action
    if (response) {
      // Handle error returned from the server
      form.setError("root.serverError", {
        type: "server",
        message: response.message,
      })

      // form.reset()

      const invalid = document.querySelector("input")
      invalid?.focus()
      // focus on the first error field
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="mx-auto">
        <RouterLink href="/">
          <Logo />
        </RouterLink>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            <h1 id="login-form">Log In</h1>
          </CardTitle>
          <CardDescription>
            {/* describe why you need to log in */}
            Log in to access your account and manage your projects, save process
            on your courses and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              aria-labelledby="login-form"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  {/* <Button type="button" variant="outline" className="w-full">
                    Continue with GitHub
                    </Button> */}

                  <LoginWithGoogle />
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <Field
                    name="email"
                    label="E-Mail"
                    type="email"
                    autoComplete="email"
                    required
                  />
                  <Field
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="password"
                    required
                  />
                </div>

                {showSuccess && (
                  <div
                    aria-live="polite"
                    role="alert"
                    className="text-green-600 text-sm bg-green-50 p-3 rounded-md"
                  >
                    Successfully logged in! Redirecting you...
                  </div>
                )}

                {form.formState?.errors?.root?.serverError?.type ===
                  "server" && (
                  <div
                    aria-live="polite"
                    role="alert"
                    className="text-red-500 text-sm"
                  >
                    {form.formState?.errors?.root?.serverError?.message}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Logging in..." : "Log in"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="gap-4 text-sm">
          <RouterLink href="/auth/signup">Create new account</RouterLink>
          <LinkRecoverPassword />
        </CardFooter>
      </Card>
    </div>
  )
}
