import dynamic from "next/dynamic"

import { generateMetadata } from "@/lib/metadata"
import { Separator } from "@/components/ui/separator"
import { ContactForm } from "@/components/emails/contact-form"
import { PageHeader } from "@/components/page-header"

export const metadata = generateMetadata({
  title: "Contact",
  description:
    "Get in touch with us about accessibility consulting and services",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <div className="container py-8">
      <PageHeader heading="Contact" description="How can we help?" />
      <Separator className="my-8" />
      <ContactForm />
    </div>
  )
}
