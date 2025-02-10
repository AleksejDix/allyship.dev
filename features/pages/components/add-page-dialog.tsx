"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { addPage } from "@/features/pages/actions/add-page"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  url: z.string().url("Please enter a valid URL"),
})

type Props = {
  spaceId: string
  domainId: string
  domain: { name: string }
}

export function AddPageDialog({ spaceId, domainId, domain }: Props) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: `https://${domain.name}/`,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("🚀 Starting form submission with values:", values)
    setIsSubmitting(true)

    try {
      console.log("📤 Calling addPage server action...")
      const [result, error] = await addPage({
        url: values.url,
        spaceId,
        domainId,
      })

      console.log("📥 Server action response:", { result, error })

      if (error) {
        console.log("❌ Server action error:", error)
        form.setError("url", { message: error.message })
        return
      }

      if (!result?.success) {
        console.log("❌ Server action failed without error")
        form.setError("url", {
          message: result?.error?.message || "Failed to add page",
        })
        return
      }

      console.log("✅ Page added successfully:", result.data)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("❌ Unexpected error:", error)
      form.setError("url", {
        message: error instanceof Error ? error.message : "Failed to add page",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Plus aria-hidden="true" />
          Add Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Page</DialogTitle>
          <DialogDescription>
            Enter the URL of the page you want to add to {domain.name}. The URL
            must start with https://{domain.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`https://${domain.name}/page`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Page"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
