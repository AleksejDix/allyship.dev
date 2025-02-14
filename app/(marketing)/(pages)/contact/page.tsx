"use client"

import React from "react"

import { ContactForm } from "@/components/emails/contact-form"
import { PageHeader } from "@/components/page-header"
import { Separator } from "@/components/ui/separator"

const Page = () => {
  return (
    <div className="container py-8">
      <PageHeader heading="Contact" description="How can we help?" />
      <Separator className="my-8" />
      <ContactForm />
    </div>
  )
}

export default Page
