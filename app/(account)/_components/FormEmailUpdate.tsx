"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

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
import { updateEmail } from "@/app/(account)/_components/FormEmailUpdateAction"

import { FormUpdateEmailSchema } from "./FormEmailUpdateSchema"

export function FormEmailUpdate({ email }: { email: string | undefined }) {
  const form = useForm<z.infer<typeof FormUpdateEmailSchema>>({
    resolver: zodResolver(FormUpdateEmailSchema),
    defaultValues: {
      email: email ?? "",
    },
  })

  const { execute, isPending } = useServerAction(updateEmail, {
    onSuccess: () => {
      // redirect("/")
    },
    onError: (error) => {
      console.error("Error", error)
    },
  })

  const onSubmit = async (data: z.infer<typeof FormUpdateEmailSchema>) => {
    const [response] = await execute(data) // Pass the form data to the server action
    if (response) {
      // Handle error returned from the server
      form.setError("root.serverError", {
        type: "server",
      })

      // form.reset()

      const invalid = document.querySelector("input")
      invalid?.focus()
      // focus on the first error field
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          aria-labelledby="form-email-update"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card>
            <CardHeader>
              <CardTitle id="form-email-update">Your Email</CardTitle>
              <CardDescription>
                Please enter the email address you want to use to login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update Email"}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="pb-4 sm:pb-0">
                We will email you to verify the change.
              </p>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
