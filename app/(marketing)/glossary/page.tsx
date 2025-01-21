import { notFound } from "next/navigation"
import { allTerms } from "contentlayer/generated"

// import { Mdx } from "@/components/mdx-components"

import "@/styles/mdx.css"

export default async function PostPage() {
  const terms = allTerms

  if (!terms) {
    notFound()
  }

  return (
    <div className="container max-w-3xl" aria-asdasd>
      <div>
        <header>
          <h1 className="text-4xl font-bold md:text-7xl max-w-2xl tracking-tighter text-pretty">
            Glossary
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn the language of web accessibility.
          </p>
        </header>
        <hr className="my-8" />

        <ul className="space-y-2">
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
