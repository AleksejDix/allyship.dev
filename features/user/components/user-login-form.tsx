"use client"

import React from "react"
import { signInWithPassword } from "@/features/user/actions/user-actions"
import { LoginWithGoogle } from "@/features/user/components/user-login-with-google"
import { loginFormSchema } from "@/features/user/schemas/user-schemas"
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
import { LinkRecoverPassword } from "@/app/(auth)/_components/LinkRecoverPassword"

export function UserLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const { execute, isPending } = useServerAction(signInWithPassword)

  const onSubmit = async (formData: z.infer<typeof loginFormSchema>) => {
    const [data, validationError] = await execute(formData) // Pass the form data to the server action

    if (validationError) {
      if (validationError.code === "INPUT_PARSE_ERROR") {
        Object.entries(validationError.fieldErrors).forEach(
          ([field, messages]) => {
            form.setError(field as keyof z.infer<typeof loginFormSchema>, {
              type: "server",
              message: messages?.join(", "),
            })
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
              noValidate
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
                    Or continue with credentials
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <Field
                    name="username"
                    label="E-Mail"
                    type="email"
                    autoComplete="username"
                    required
                    autoFocus
                  />
                  <Field
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>

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

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <LoaderCircle
                      className="-ms-1 me-2 animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : null}
                  {isPending ? "Logging in..." : "Log in"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="gap-4 text-sm">
          <RouterLink
            href="/auth/signup"
            className="underline underline-offset-4"
          >
            Create new account
          </RouterLink>
          <LinkRecoverPassword />
        </CardFooter>
      </Card>
    </div>
  )
}
