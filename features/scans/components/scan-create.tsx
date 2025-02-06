"use client"

import Link from "next/link"
import { create } from "@/features/scans/actions"
import { scanJobSchema, type ScanJobSchema } from "@/features/scans/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, TriangleAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { useServerAction } from "zsa-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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

export function ScanJobCreate() {
  const complianceBadges = [
    { id: "wcag20", label: "WCAG 2.0" },
    { id: "wcag21", label: "WCAG 2.1" },
    { id: "wcag22", label: "WCAG 2.2" },
    { id: "eaa", label: "European Accessibility Act" },
    { id: "section508", label: "Section 508" },
    { id: "en301549", label: "EN 301 549" },
  ]

  const form = useForm({
    resolver: zodResolver(scanJobSchema),
    defaultValues: {
      url: "",
    },
  })

  const { execute, isPending } = useServerAction(create)

  const onSubmit = async (formData: ScanJobSchema) => {
    const [data, validationError] = await execute(formData)

    if (validationError) {
      if (validationError.code === "INPUT_PARSE_ERROR") {
        Object.entries(validationError.fieldErrors).forEach(
          ([field, messages]) => {
            form.setError(field as keyof ScanJobSchema, {
              type: "server",
              message: messages?.join(", "),
            })
          }
        )
      } else {
        form.setError("root.serverError", {
          message: validationError.message ?? "An error occurred",
          type: "server",
        })
      }
    }

    if (data && !data.success) {
      form.setError("root.serverError", {
        message: data.error?.message,
        type: "server",
      })
    } else if (data?.success) {
      form.reset()
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Web Accessibility Scanner</CardTitle>
          <CardDescription>
            Accessibility is required by law. Scan your website for compliance.{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <Field
                    type="url"
                    name="url"
                    label="Website URL"
                    className="flex-1"
                    placeholder="Enter URL to scan"
                  />
                  <Button
                    type="submit"
                    className="md:mt-6 md:min-w-24 w-full md:w-auto"
                    disabled={isPending}
                  >
                    {isPending ? "Scanning..." : "Scan"}
                  </Button>
                </div>

                {form.formState?.errors?.root?.serverError?.type ===
                  "server" && (
                  <Alert variant="destructive">
                    <TriangleAlert aria-hidden="true" size={16} />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {form.formState?.errors?.root?.serverError?.message}

                      {form.formState?.errors?.root?.serverError?.message ===
                        "You must be logged in to scan a website" && (
                        <span className="mt-2 block">
                          <Link
                            href="/auth/login"
                            className="underline font-bold"
                          >
                            Login
                          </Link>{" "}
                          or{" "}
                          <Link
                            href="/auth/signup"
                            className="underline font-bold"
                          >
                            Sign up
                          </Link>{" "}
                          to save your scan results.
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {complianceBadges.map((badge) => (
            <Badge key={badge.id} variant="secondary">
              <CheckIcon size={16} className="mr-1" />
              <span>{badge.label}</span>
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </div>
  )
}
