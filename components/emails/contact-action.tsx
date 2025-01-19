"use server"

import { Resend } from "resend"
import { z } from "zod"

import { env } from "@/env.mjs"
import { EmailTemplate } from "@/components/emails/contact-template"

import { contactFormSchema } from "./contact-shema"

const resend = new Resend(env.RESEND_API_KEY)

export async function contactFormAction(
  _prevState: unknown,
  formData: FormData
) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData.entries()))

  try {
    const data = contactFormSchema.parse(Object.fromEntries(formData))

    await resend.emails.send({
      from: `Allyship <contact@allyship.dev>`,
      to: ["privat@aleksejdix.com"],
      subject: `New Message from ${data.name}`,
      react: EmailTemplate({ firstName: "John" }) as React.ReactElement,
    })

    return {
      defaultValues: {
        name: "",
        email: "",
        message: "",
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
