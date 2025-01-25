"use client"

import { getSitemap } from "@/features/sitemap/actions/getSitemap"
import { URLSchema, urlSchema } from "@/features/sitemap/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useServerAction } from "zsa-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function FormSitemapCreate() {
  const form = useForm<URLSchema>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  })

  const { execute, isPending } = useServerAction(getSitemap, {
    onSuccess: (data) => {
      console.log("success")
      form.reset()
    },
    onError: (error) => {
      console.log("faild")
      console.error("Server Action Error:", error)
    },
  })

  const onSubmit = async (data: URLSchema) => {
    const [response, error] = await execute(data)
    if (error || !response) {
      // Handle the case where the server action fails
      console.log("Error during submission:", error)
      const invalidInput = document.querySelector("input")
      invalidInput?.focus() // Focus on the first input field
    }

    console.log(response)
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} aria-labelledby="form">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <h1 id="form">Generate Sitemap</h1>
              </CardTitle>
              <CardDescription>
                Enter your root URL below, and we will generate a sitemap for
                you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Root URL <span aria-hidden="true">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            {...field}
                            placeholder="https://example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.formState.errors.root?.serverError && (
                  <div
                    aria-live="polite"
                    role="alert"
                    className="text-red-500 text-sm"
                  >
                    {form.formState.errors.root.serverError.message}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Generating..." : "Generate Sitemap"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
