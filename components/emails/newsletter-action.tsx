"use server"

import { Resend } from "resend"
import { z } from "zod"

import { env } from "@/env.mjs"
import { NewsletterTemplate } from "@/components/emails/newsletter-template"

import { newsletterShema } from "./newsletter-schema"

const resend = new Resend(env.RESEND_API_KEY)

export async function newsletterFormAction(
  _prevState: unknown,
  formData: FormData
) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData.entries()))

  try {
    const data = newsletterShema.parse(Object.fromEntries(formData))

    await resend.emails.send({
      from: `Newsletter: <newsletter@allyship.dev>`,
      to: [data.email],
      subject: `Confirm your newsletter subscription`,
      react: NewsletterTemplate(data) as React.ReactElement,
    })

    return {
      defaultValues: {
        email: "",
      },
      success: true,
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(", "),
          ])
        ),
      }
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    }
  }
}
