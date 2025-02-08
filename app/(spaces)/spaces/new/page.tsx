"use client"

import { createSpace } from "@/features/space/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

const SpaceSchema = z.object({
  name: z.string().min(1, { message: "Workspace name is required" }),
})

export default function Page() {
  const form = useForm<z.infer<typeof SpaceSchema>>({
    resolver: zodResolver(SpaceSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data: z.infer<typeof SpaceSchema>) {
    // Handle form submission here
    const space = await createSpace(data)
    console.log(space)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <Field name="name" label="Space name:" type="text" required />
        <Button type="submit">Create Workspace</Button>
      </form>
    </Form>
  )
}
