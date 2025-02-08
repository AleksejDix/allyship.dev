"use client"

import { createSpace } from "@/features/space/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

const formSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
})

type FormData = z.infer<typeof formSchema>

export function SpaceCreate() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    await createSpace(data) // Pass the form data to the server action
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Field type="text" name="name" label="Workspace Name" />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  )
}
