"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createScan } from "@/features/scans/actions"
import { normalizeUrl } from "@/utils/url"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, Loader2, TriangleAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

const formSchema = z.object({
  url: z.string().transform((url, ctx) => {
    console.log("[SCAN] Original URL:", url)
    const trimmed = url.trim()
    console.log("[SCAN] Trimmed URL:", trimmed)
    if (trimmed.length === 0) {
      console.log("[SCAN] Empty URL after trim")
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a website URL",
      })
      return z.NEVER
    }

    try {
      // Add protocol if missing
      const urlWithProtocol = trimmed.startsWith("http")
        ? trimmed
        : `https://${trimmed}`
      console.log("[SCAN] URL with protocol:", urlWithProtocol)
      const normalized = normalizeUrl(urlWithProtocol, true)
      console.log("[SCAN] Normalized URL:", normalized)
      return normalized
    } catch (error) {
      console.error("[SCAN] URL normalization error:", error)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error instanceof Error ? error.message : "Invalid URL format",
      })
      return z.NEVER
    }
  }),
})

type FormValues = z.infer<typeof formSchema>

type ScanJobCreateProps = {
  variant?: "marketing" | "admin"
}

export function ScanJobCreate({ variant = "marketing" }: ScanJobCreateProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const complianceBadges = [
    { id: "wcag20", label: "WCAG 2.0" },
    { id: "wcag21", label: "WCAG 2.1" },
    { id: "wcag22", label: "WCAG 2.2" },
    { id: "eaa", label: "European Accessibility Act" },
    { id: "section508", label: "Section 508" },
    { id: "en301549", label: "EN 301 549" },
  ]

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    console.log("[SCAN] Form submitted with data:", data)
    try {
      setIsSubmitting(true)
      const result = await createScan(data)
      console.log("[SCAN] Server response:", result)

      if (result?.error) {
        console.error("[SCAN] Server error:", result.error)
        if (
          result.error.message === "You must be logged in to scan a website"
        ) {
          form.setError("root.serverError", {
            message: result.error.message,
            type: "server",
          })
          return
        }
        form.setError("root.serverError", {
          message:
            result.error.message +
            (result.error.details
              ? `: ${JSON.stringify(result.error.details)}`
              : ""),
          type: "server",
        })
        return
      }

      if (result?.success && result.data?.id) {
        console.log("[SCAN] Scan created successfully:", result.data)
        router.push(`/scans/${result.data.id}`)
      }
    } catch (error) {
      console.error("[SCAN] Unexpected error:", error)
      form.setError("root.serverError", {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        type: "server",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {variant === "marketing"
            ? "Web Accessibility Scanner"
            : "Run Accessibility Scan"}
        </CardTitle>
        <CardDescription>
          {variant === "marketing"
            ? "Check your website for accessibility compliance and get detailed reports."
            : "Run a new accessibility scan for this page."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-2">
                <Field
                  type="text"
                  name="url"
                  label="Website URL"
                  className="flex-1"
                  placeholder="Enter URL to scan"
                />
                <Button
                  type="submit"
                  className="md:mt-6 md:min-w-24 w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    "Scan Now"
                  )}
                </Button>
              </div>

              <div role="alert" aria-live="polite">
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
            </div>
          </form>
        </Form>
      </CardContent>
      {variant === "marketing" && (
        <CardFooter className="flex flex-wrap gap-2">
          {complianceBadges.map((badge) => (
            <Badge key={badge.id} variant="secondary">
              <CheckIcon size={16} className="mr-1" aria-hidden="true" />
              <span>{badge.label}</span>
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
