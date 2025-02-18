import React from "react"

import { generateMetadata } from "@/lib/metadata"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"

export const metadata = generateMetadata({
  title: "Contact",
  description:
    "Get in touch with us about accessibility consulting and services",
  path: "/contact",
})

function ClientContactForm() {
  "use client"
  const { ContactForm } = require("@/components/emails/contact-form")
  return <ContactForm />
}

export default function ContactPage() {
  return (
    <div className="container py-8">
      <PageHeader heading="Contact" description="How can we help?" />
      <Separator className="my-8" />
      <ClientContactForm />
    </div>
  )
}
