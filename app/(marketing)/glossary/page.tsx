import { notFound } from "next/navigation"
import { GlossarySearch } from "@/features/glossary/components/glossary-search"
import { allTerms } from "contentlayer/generated"

import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"

import "@/styles/mdx.css"

export default async function GlossaryPage() {
  const terms = allTerms

  if (!terms) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div>
        <PageHeader
          heading="Glossary"
          description="Learn the language of web accessibility and development."
        />
        <Separator className="mt-6 mb-8" />
        <GlossarySearch terms={terms} />
      </div>
    </div>
  )
}
