"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tables } from "@/database.types"
import { updateSpace } from "@/features/space/actions"
import { zodResolver } from "@hookform/resolvers/zod"
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
  space: Tables<"UserSpaceView">
}

export function SpaceUpdate(props: SpaceUpdateProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      name: props.space.space_name || "",
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!props.space.space_id) {
      form.setError("root", {
        type: "server",
        message: "Space ID is required",
      })
      return
    }

    try {
      setIsUpdating(true)
      const result = await updateSpace(props.space.space_id, data)

      if (result.error) {
        form.setError("root", {
          type: "server",
          message: result.error.message,
        })
        return
      }

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      form.setError("root", {
        type: "server",
        message: "Failed to update space. Please try again.",
      })
    } finally {
      setIsUpdating(false)
    }
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
              disabled={isUpdating}
            />
            {form.formState.errors.root && (
              <div className="text-sm text-destructive mt-2" role="alert">
                {form.formState.errors.root.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-end border-t border-border py-4">
            <Button type="submit" size="sm" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
