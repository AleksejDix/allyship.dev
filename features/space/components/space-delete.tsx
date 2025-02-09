"use client"

import { deleteSpace } from "@/features/space/actions" // You'll need to create this action
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

const formSchema = z
  .object({
    name: z.string().min(1, "Workspace name is required"),
    confirmName: z.string(),
  })
  .refine((data) => data.name === data.confirmName, {
    message: "Please type the workspace name to confirm",
    path: ["confirmName"],
  })

type FormData = z.infer<typeof formSchema>

type Space = {
  id: string
  name: string
}

interface SpaceDeleteProps {
  space: Space
}

export function SpaceDelete(props: SpaceDeleteProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    context: { spaceName: props.space.name },
    values: {
      name: props.space.name,
      confirmName: "",
    },
  })

  const onSubmit = async () => {
    await deleteSpace(props.space.id)
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Delete Space</CardTitle>
            <CardDescription>
              Permanently remove your team and all of its contents from the
              Allyship platform. This action is not reversible — please continue
              with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field
              name="name"
              label="Space Name"
              type="hidden"
              autoComplete="organization"
            />

            <Field
              name="confirmName"
              label="Space Name"
              type="text"
              autoComplete="organization"
              description="Please type the Space name to delete"
            />
          </CardContent>
          <CardFooter className="flex items-center justify-end py-4 border-t border-destructive/50 bg-destructive/5">
            <Button type="submit" size="sm" variant="destructive">
              Delete
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
