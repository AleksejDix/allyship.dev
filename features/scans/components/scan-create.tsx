"use client"

import { create } from "@/features/scans/actions"
import { scanJobSchema, type ScanJobSchema } from "@/features/scans/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useServerAction } from "zsa-react"

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
    const [as, validationError] = await execute(formData)
    console.log(as, validationError)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Web Accessibility Scanner</CardTitle>
          <CardDescription>
            Accessibility is required by law. Scan your website for compliance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
