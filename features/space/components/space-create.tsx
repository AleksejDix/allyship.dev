"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSpace } from "@/features/space/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Workspace name is required",
    })
    .max(50, {
      message: "Workspace name cannot be longer than 50 characters",
    })
    .refine((value) => !/^\s*$/.test(value), {
      message: "Workspace name cannot be only whitespace",
    }),
})

type FormData = z.infer<typeof formSchema>

export function SpaceCreate() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const { execute, isPending } = useServerAction(createSpace)

  const onSubmit = async (data: FormData) => {
    try {
      setError(null)
      const [response, validationError] = await execute(data)

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
        } else {
          setError(validationError.message ?? "An unexpected error occurred")
        }
        return
      }

      if (response && !response.success) {
        setError(response.error?.message ?? "An unexpected error occurred")
        return
      }

      router.refresh()
    } catch {
      setError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Field
          type="text"
          name="name"
          label="Workspace Name"
          description="Enter a name for your new workspace"
          placeholder="My Workspace"
        />

        {error && (
          <div className="text-sm text-destructive" role="alert">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Workspace"}
        </Button>
      </form>
    </Form>
  )
}
