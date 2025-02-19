"use client"

import { useState } from "react"
import { createPage } from "@/features/pages/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function PagesCreate({ website_id }: { website_id: string }) {
  const [error, setError] = useState<string>()

  const formSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
    website_id: z.string(),
  })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      website_id: website_id,
    },
  })

  const { execute, isPending } = useServerAction(createPage)

  async function onSubmit(formData: FormValues) {
    setError(undefined)
    const [result, actionError] = await execute(formData)
    if (actionError) {
      if (actionError.code === "INPUT_PARSE_ERROR") {
        Object.entries(actionError.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof FormValues, {
            type: "server",
            message: messages?.join(", "),
          })
        })
      } else {
        console.error(actionError)
      }
    }

    if (result && !result.success) {
      form.setError("root.serverError", {
        message: result.error?.message,
        type: "server",
      })
    } else if (result?.success) {
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain Name</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState?.errors?.root?.serverError?.type === "server" && (
          <Alert variant="destructive">
            <AlertTriangle aria-hidden="true" size={16} />
            <AlertTitle>Server Error</AlertTitle>
            <AlertDescription>
              {form.formState?.errors?.root?.serverError?.message}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Domain"}
        </Button>
      </form>
    </Form>
  )
}
