"use server"

import { Resend } from "resend"
import { z } from "zod"

import { env } from "@/env.mjs"
import { NewsletterTemplate } from "@/components/emails/newsletter-template"

import { contactFormSchema } from "./contact-schema"

const resend = new Resend(env.RESEND_API_KEY)

type ContactResponse = {
  success: boolean
  defaultValues: {
    name: string
    email: string
    message: string
  }
  error?: {
    message: string
    code: string
    status: number
    details?: Record<string, string>
  }
}

export async function contactFormAction(
  _prevState: unknown,
  formData: FormData
): Promise<ContactResponse> {
  try {
    // 1. Validate input
    const data = contactFormSchema.parse(Object.fromEntries(formData))

    // 2. Send email
    await resend.emails.send({
      from: `Allyship <contact@allyship.dev>`,
      to: ["privat@aleksejdix.com"],
      subject: `New Message from ${data.name}`,
      react: NewsletterTemplate(data) as React.ReactElement,
    })

    // 3. Return success response
    return {
      success: true,
      defaultValues: {
        name: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        message: formData.get("message")?.toString() || "",
      },
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        defaultValues: {
          name: formData.get("name")?.toString() || "",
          email: formData.get("email")?.toString() || "",
          message: formData.get("message")?.toString() || "",
        },
        error: {
          message: "Validation failed",
          code: "validation_error",
          status: 400,
          details: Object.fromEntries(
            Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
              key,
              value?.join(", ") || "",
            ])
          ),
        },
      }
    }

    // Handle Resend API errors
    if (error instanceof Error) {
      return {
        success: false,
        defaultValues: {
          name: formData.get("name")?.toString() || "",
          email: formData.get("email")?.toString() || "",
          message: formData.get("message")?.toString() || "",
        },
        error: {
          message: "Failed to send email",
          code: "email_error",
          status: 500,
        },
      }
    }

    // Handle unknown errors
    return {
      success: false,
      defaultValues: {
        name: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        message: formData.get("message")?.toString() || "",
      },
      error: {
        message: "An unexpected error occurred",
        code: "internal_server_error",
        status: 500,
      },
    }
  }
}
