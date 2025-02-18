"use client"

import { useState } from "react"
import type { Database, Tables } from "@/database.types"
import { deletePage } from "@/features/pages/actions"
import { normalizeUrl } from "@/utils/url"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

interface Props {
  page: Tables<"Page">
  space_id: string
  website_id: string
}

export function PageDelete({ page, space_id, website_id }: Props) {
  const [error, setError] = useState<string>()
  const { execute, isPending } = useServerAction(deletePage)

  console.log("Component initialization:", {
    pageUrl: page.url,
    pageId: page.id,
    spaceId: space_id,
    websiteId: website_id,
  })

  const normalizedPageUrl = normalizeUrl(page.url)
  console.log("Stored page URL normalized:", normalizedPageUrl)

  // Get a cleaner display URL without protocol
  const displayUrl = page.url.replace(/^https?:\/\//, "").toLowerCase()
  console.log("Display URL for user:", displayUrl)

  const formSchema = z.object({
    confirmName: z
      .string()
      .min(1, "Please enter the website URL to confirm")
      .transform((value) => {
        console.log("Form value before transform:", value)
        // Clean the input value first
        value = value.trim().toLowerCase()
        // Remove protocol if present
        value = value.replace(/^https?:\/\//, "")
        // Remove www if present
        value = value.replace(/^www\./, "")
        // Remove trailing slash
        value = value.replace(/\/$/, "")
        console.log("Cleaned input value:", value)
        return value
      })
      .refine(
        (value) => {
          // Get the stored URL in the same format
          const storedUrl = displayUrl.replace(/^www\./, "").replace(/\/$/, "")
          const matches = value === storedUrl
          console.log("URL match result:", {
            input: value,
            stored: storedUrl,
            matches,
          })
          return matches
        },
        {
          message: "The URL you entered does not match",
        }
      ),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmName: "",
    },
  })

  // Log form errors for debugging
  console.log("Form state:", {
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
  })

  const onSubmit = async (data: FormData) => {
    console.log("Form submission started with data:", data)
    setError(undefined)

    // Use the original page ID for deletion
    const [result, actionError] = await execute({
      id: page.id,
    })

    console.log("Delete action result:", { result, actionError })

    if (actionError) {
      console.error("Action error:", actionError)
      setError(actionError.message)
      return
    }

    if (!result?.success) {
      console.error("Unsuccessful result:", result?.error)
      setError(result.error?.message || "Failed to delete page")
      return
    }

    console.log("Delete successful, redirecting")
    window.location.href = `/spaces/${space_id}/${website_id}/pages`
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <Field
          name="confirmName"
          label={`Please type ${displayUrl} to confirm`}
          type="text"
          description="This action cannot be undone. Enter the domain name exactly as shown above."
          placeholder={displayUrl}
        />

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="destructive" disabled={isPending}>
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </Form>
  )
}
