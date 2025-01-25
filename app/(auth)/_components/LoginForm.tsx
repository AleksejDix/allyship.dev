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
import { LinkRecoverPassword } from "@/app/(auth)/_components/LinkRecoverPassword"

import { login } from "../_actions"
import { LoginFormSchema } from "../_schemas/form"
import { LoginWithGoogle } from "./LoginWithGoogle"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { execute, isPending } = useServerAction(login, {
    onSuccess: () => {
      // redirect("/")
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          aria-labelledby="login-form"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <h1 id="login-form">Log In</h1>
              </CardTitle>
              <CardDescription>
                {/* describe why you need to log in */}
                Log in to access your account and manage your projects, save
                process on your courses and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>
                            Password <span aria-hidden="true">*</span>
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
        </form>
      </Form>
    </div>
  )
}
