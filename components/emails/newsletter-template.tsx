import * as React from "react"

import { env } from "@/env.mjs"

import type { NewsletterSchema } from "./newsletter-schema"

export const NewsletterTemplate: React.FC<Readonly<NewsletterSchema>> = (
  props
) => {
  // TODO: Generate a confirmation token (in production, store this in a database)
  const confirmationToken = Buffer.from(props.email).toString("base64")
  const confirmationLink = `${env.NEXT_PUBLIC_APP_URL}/newsletter/confirm?token=${confirmationToken}`

  return (
    <div>
      <h1>Confirm your subscription</h1>
      <p>
        Thank you for subscribing to our newsletter! Please click the link below
        to confirm your subscription:
      </p>

      <a href={confirmationLink}>Confirm Subscription</a>
      <p>
        If you didn&apos;t request this subscription, you can safely ignore this
        email.
      </p>
    </div>
  )
}
