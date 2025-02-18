"use client"

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

import { createPage } from "../actions"

const formSchema = z.object({
  name: z.string().url().min(1, "Domain name is required"),
  website_id: z.string().min(1, "Domain ID is required"),
})

type FormValues = z.infer<typeof formSchema>

interface DomainsCreateProps {
  domainId: string
}

export function DomainsCreate({ domainId }: DomainsCreateProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website_id: domainId,
    },
  })

  const { execute, isPending } = useServerAction(createPage)

  async function onSubmit(formData: FormValues) {
    const [data, validationError] = await execute(formData)
    if (validationError) {
      if (validationError.code === "INPUT_PARSE_ERROR") {
        Object.entries(validationError.fieldErrors).forEach(
          ([field, messages]) => {
            form.setError(field as keyof FormValues, {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
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
