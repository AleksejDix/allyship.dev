import { notFound } from "next/navigation"
import { allTerms } from "contentlayer/generated"
import { PageHeader } from "@/components/page-header"
import { Separator } from "@/components/ui/separator"
// import { Mdx } from "@/components/mdx-components"

import "@/styles/mdx.css"

export default async function PostPage() {
  const terms = allTerms

  if (!terms) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div>
        <PageHeader heading="Glossary" description="Learn the language of web accessibility." />
        <Separator className="my-8" />

        <ul className="space-y-2 max-w-[65ch]">
          {terms.map((term) => {
            return (
              <li
                key={term.slug}
                className="border-accent border p-4 rounded-lg"
              >
                <h2 className="lg font-bold text-foreground">{term.title}</h2>
                <div className="text-sm text-muted-foreground">
                  {term.description}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
