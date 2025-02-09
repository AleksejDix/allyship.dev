"use client"

import { updateSpace } from "@/features/space/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Space } from "@prisma/client"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

const formSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
})

type FormData = z.infer<typeof formSchema>

interface SpaceUpdateProps {
  space: Space
}

export function SpaceUpdate(props: SpaceUpdateProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      name: props.space.name ?? "",
    },
  })

  const onSubmit = async (data: FormData) => {
    await updateSpace(props.space.id, data) // Pass the form data to the server action
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Name Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Field
              name="name"
              label="Workspace Name"
              type="text"
              autoComplete="organization"
              description="This is your team's visible name within Allyship. For example, the name of your company or department."
            />
          </CardContent>
          <CardFooter className="flex items-center justify-end border-t border-border py-4">
            <Button type="submit" size="sm">
              Update
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
