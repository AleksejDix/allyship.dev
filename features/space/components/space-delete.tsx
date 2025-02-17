"use client"

import { useRouter } from "next/navigation"
import { deleteSpaceAction } from "@/features/space/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

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
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    context: { spaceName: props.space.name },
    values: {
      name: props.space.name,
      confirmName: "",
    },
  })

  const { execute, isPending } = useServerAction(deleteSpaceAction)

  const onSubmit = async () => {
    const [result, error] = await execute({ id: props.space.id })

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message,
      })
      return
    }

    if (!result?.success) {
      form.setError("root", {
        type: "server",
        message: "Failed to delete workspace",
      })
      return
    }
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
            {form.formState.errors.root && (
              <div className="text-sm text-destructive mt-2" role="alert">
                {form.formState.errors.root.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-end py-4 border-t border-destructive/50 bg-destructive/5">
            <Button
              type="submit"
              size="sm"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
