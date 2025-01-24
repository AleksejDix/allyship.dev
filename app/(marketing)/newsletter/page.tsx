"use client"

import React from "react"

import { NewsletterForm } from "@/components/emails/newsletter-form"

const Page = () => {
  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1
            id="contact-heading"
            className="text-4xl font-bold md:text-7xl max-w-2xl tracking-tighter text-pretty"
          >
            Newsletter
          </h1>
          <p className="text-xl text-muted-foreground">
            Keep up to date with the latest news and updates
          </p>
        </div>
      </div>
      <hr className="my-8" />
      <NewsletterForm />
    </div>
  )
}

export default Page
