"use client"

import { useState } from "react"
import type { Database } from "@/database.types"
import { deletePage } from "@/features/pages/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

type DbPage = Database["public"]["Tables"]["Page"]["Row"]

interface PageDeleteProps {
  page: DbPage
  space_id: string
  website_id: string
}

export function PageDelete({ page, space_id, website_id }: PageDeleteProps) {
  const [error, setError] = useState<string>()
  const { execute, isPending } = useServerAction(deletePage)

  const formSchema = z.object({
    confirmName: z
      .string()
      .min(1, "Please enter the page name to confirm")
      .refine((value) => value === page.url, {
        message: "The name you entered does not match",
      }),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmName: "",
    },
  })

  const onSubmit = async () => {
    setError(undefined)
    const [result, actionError] = await execute({
      id: page.id,
    })

    if (actionError) {
      setError(actionError.message)
      return
    }

    if (!result?.success) {
      setError("Failed to delete page")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <Field
          name="confirmName"
          label={`Please type ${page.url} to confirm`}
          type="text"
          description="This action cannot be undone"
        />

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="destructive">
          {isPending ? "Deleting..." : "Delete Page"}
        </Button>
      </form>
    </Form>
  )
}
