"use client"

import { deleteSpace } from "@/features/space/actions" // You'll need to create this action
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

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
    <div className="border border-destructive/50 rounded-lg p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-destructive">
          Delete Workspace
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          This action cannot be undone. This will permanently delete the{" "}
          <strong>{props.space.name}</strong> workspace.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-destructive">
                  Workspace Name <span aria-hidden="true">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-destructive">Space Name:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="border-destructive/50 focus-visible:ring-destructive"
                  />
                </FormControl>
                <FormDescription>
                  Please type the workspace name to confirm
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="destructive" className="w-full">
            I understand the consequences, delete this workspace
          </Button>
        </form>
      </Form>
    </div>
  )
}
