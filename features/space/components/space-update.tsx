"use client"

import { updateSpace } from "@/features/space/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
})

type FormData = z.infer<typeof formSchema>

type Space = {
  id: string
  name: string
}

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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Workspace Name <span aria-hidden="true">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} autoComplete="organization" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isDirty}>
          Update
        </Button>
      </form>
    </Form>
  )
}
