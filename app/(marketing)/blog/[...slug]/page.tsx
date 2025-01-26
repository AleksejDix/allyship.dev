import { notFound } from "next/navigation"
import { allAuthors, allPosts } from "contentlayer/generated"

import { Mdx } from "@/components/mdx-components"

import "@/styles/mdx.css"

import { Metadata } from "next"
import Image from "next/image"
import RouterLink from "next/link"

import { env } from "@/env.mjs"
import { absoluteUrl, cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { PageHeader } from "@/components/page-header"

interface PostPageProps {
  params: {
    slug: string[]
  }
}

export async function generateMetadata(
  props: PostPageProps
): Promise<Metadata> {
  const params = await props.params

  const post = allPosts.find((post) => post.slugAsParams === params.slug[0])

  if (!post) {
    return {}
  }

  const url = env.NEXT_PUBLIC_APP_URL

  const ogUrl = new URL(`${url}/api/og`)
  ogUrl.searchParams.set("heading", post.title)
  ogUrl.searchParams.set("type", "Blog Post")
  ogUrl.searchParams.set("mode", "dark")

  return {
    title: post.title,
    description: post.description,
    authors: post.authors.map((author) => ({
      name: author,
    })),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(post.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  }
}

export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }))
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params

  const post = allPosts.find((post) => post.slugAsParams === params.slug[0])

  if (!post) {
    notFound()
  }

  const authors = post.authors.map((author) =>
    allAuthors.find(({ slug }) => slug === `/authors/${author}`)
  )

  return (
    <article className="container  px-4 sm:px-6 lg:px-8">
      <PageHeader
        heading={post.title}

      />
      <hr className="my-8" />
      {authors?.length ? (
        <div className="mt-4 flex flex-wrap gap-4">
          {authors.map((author) =>
            author ? (
              <RouterLink
                key={author._id}
                href={`https://twitter.com/${author.twitter}`}
                className="flex items-center space-x-2 text-sm"
              >
                <Image
                  src={author.avatar}
                  alt={author.title}
                  width={42}
                  height={42}
                  className="rounded-full bg-white"
                />
                <div className="flex-1 text-left leading-tight">
                  <p className="font-medium">{author.title}</p>
                  <p className="text-[12px] text-muted-foreground">
                    @{author.twitter}
                  </p>
                </div>
              </RouterLink>
            ) : null
          )}
        </div>
      ) : null}
      <hr className="my-8" />
      {post.image && (
        <div className="relative w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            width={720}
            height={405}
            className="my-8 rounded-md border bg-muted transition-colors"
            priority
          />
        </div>
      )}
      <div className="mdx mx-auto max-w-[42em]">
        <Mdx code={post.body.code} />
      </div>
      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <RouterLink
          href="/blog"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </RouterLink>
      </div>
    </article>
  )
}
