"use client"

import { useTransition } from "react"
import { Tables } from "@/database.types"
import { updateSpaceAction } from "@/features/spaces/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

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
  id: z.string().min(1, "ID is required"),
})

type FormData = z.infer<typeof formSchema>

interface SpaceUpdateProps {
  space: Tables<"Space">
}

export function SpaceUpdate(props: SpaceUpdateProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      name: props.space.name || "",
      id: props.space.id,
    },
  })

  const { execute } = useServerAction(updateSpaceAction)

  const onSubmit = async (data: FormData) => {
    const [result, validationError] = await execute(data)

    if (validationError) {
      form.setError("root", {
        type: "server",
        message: validationError.message,
      })
    }

    console.log(result, validationError)
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
              disabled={isPending}
            />
            <Field name="id" label="id" type="hidden" />
            {form.formState.errors.root && (
              <div className="text-sm text-destructive mt-2" role="alert">
                {form.formState.errors.root.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-end border-t border-border py-4">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
