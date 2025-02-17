"use client"

import { createWebsite } from "@/features/websites/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

const formSchema = z.object({
  url: z
    .string()
    .min(1, {
      message: "Website url is required",
    })
    .refine((value) => !/^\s*$/.test(value), {
      message: "Website url cannot be only whitespace",
    }),
  space_id: z.string(),
})

type FormData = z.infer<typeof formSchema>

type Props = {
  space_id: string
  onSuccess?: () => void
}

export function WebsiteCreate({ space_id, onSuccess }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      space_id,
    },
  })

  const { execute, isPending } = useServerAction(createWebsite)

  const onSubmit = async (data: FormData) => {
    const [response, validationError] = await execute(data)
    console.log(response, validationError)

    if (validationError) {
      if (validationError.code === "INPUT_PARSE_ERROR") {
        Object.entries(validationError.fieldErrors).forEach(
          ([field, messages]) => {
            form.setError(field as keyof FormData, {
              type: "server",
              message: messages?.join(", "),
            })
          }
        )
      }
      return
    }

    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Field
          type="url"
          name="url"
          label="Website URL"
          description="Enter a url for your new website"
        />

        <Field type="hidden" name="space_id" label="Space ID" />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  )
}
