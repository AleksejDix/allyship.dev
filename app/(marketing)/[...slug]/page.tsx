import { notFound } from "next/navigation"
import { allPages } from "contentlayer/generated"
import { Separator } from "@/components/ui/separator"
import { Mdx } from "@/components/mdx-components"
import { PageHeader } from "@/components/page-header"

import "@/styles/mdx.css"

import { Metadata } from "next"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { absoluteUrl } from "@/lib/utils"

interface PageProps {
  params: {
    slug: string[]
  }
}

function getPageFromParams(params: PageProps["params"]) {
  const slug = params?.slug?.join("/")
  const page = allPages.find((page) => page.slugAsParams === slug)

  if (!page) {
    return null
  }

  return page
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageFromParams(params)

  if (!page) {
    return {}
  }

  const url = env.NEXT_PUBLIC_APP_URL

  const ogUrl = new URL(`${url}/api/og`)
  ogUrl.searchParams.set("heading", page.title)
  ogUrl.searchParams.set("type", siteConfig.name)
  ogUrl.searchParams.set("mode", "light")

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
      url: absoluteUrl(page.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogUrl.toString()],
    },
  }
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return allPages.map((page) => ({
    slug: page.slugAsParams.split("/"),
  }))
}

export default async function PagePage(props: PageProps) {
  const params = await props.params
  const page = await getPageFromParams(params)

  if (!page) {
    notFound()
  }

  return (
    <div>
      <article className="container py-8">
        <PageHeader heading={page.title} description={page.description}/>
        <Separator className="my-4" />
        <div className="max-w-[65ch]">
          <Mdx code={page.body.code} />
        </div>
      </article>
    </div>
  )
}
