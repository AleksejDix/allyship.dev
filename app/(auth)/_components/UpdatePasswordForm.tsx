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
import { LinkBackToLogin } from "@/app/(auth)/_components/LinkBackToLogin"

import { updatePassword } from "../_actions" // Server action to handle password update
import { UpdatePasswordSchema } from "../_schemas/form"

// Schema for password validation

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: "",
    },
  })

  const { execute } = useServerAction(updatePassword, {
    onSuccess: () => {
      alert("Password updated successfully! You can now log in.")
    },
    onError: () => {
      console.error("Failed to update password.")
    },
  })

  const onSubmit = async (data: z.infer<typeof UpdatePasswordSchema>) => {
    execute(data)
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
          aria-labelledby="update-password-form"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <h1 id="update-password-form">Set New Password</h1>
              </CardTitle>
              <CardDescription>
                Enter a new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          New Password <span aria-hidden="true">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Update Password
                </Button>
              </div>
            </CardContent>
            <CardFooter className="gap-4 text-sm">
              <LinkBackToLogin />
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
