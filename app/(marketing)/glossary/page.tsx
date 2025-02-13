import { Metadata } from "next"
import { notFound } from "next/navigation"
import { GlossarySearch } from "@/features/glossary/components/glossary-search"

import { siteConfig } from "@/config/site"
import { getAllTerms } from "@/lib/terms"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Glossary",
  description: "Learn the language of web accessibility and development.",
  openGraph: {
    title: "Glossary | Allyship.dev",
    description: "Learn the language of web accessibility and development.",
    url: `${siteConfig.url}/glossary`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glossary | Allyship.dev",
    description: "Learn the language of web accessibility and development.",
  },
}

export default async function GlossaryPage() {
  const terms = getAllTerms()

  if (!terms.length) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div>
        <PageHeader
          heading="Glossary"
          description="Learn the language of web accessibility and development."
        />
        <Separator className="my-8" />
        <GlossarySearch terms={terms} />
      </div>
    </div>
  )
}
