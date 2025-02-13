import { Metadata } from "next"
import { notFound } from "next/navigation"
import { remarkCodeHike } from "codehike/mdx"
import { format } from "date-fns"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"

import { siteConfig } from "@/config/site"
import { getAllPostSlugs, getPostBySlug } from "@/lib/mdx"
import { AuthorCard } from "@/components/author-card"
import { components } from "@/components/mdx-components"

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  // optional (see code docs):
  components: { code: "Code" },
  theme: "github-light",
  lineNumbers: true,
  showCopyButton: true,
  skipLanguages: [],
  autoImport: false,
  // if you can't use RSC:
  // syntaxHighlighting: {
  //   theme: "github-dark",
  // },
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {}
  }

  const ogUrl = new URL("/api/og", process.env.NEXT_PUBLIC_APP_URL)
  ogUrl.searchParams.set("title", post.title)
  if (post.description) {
    ogUrl.searchParams.set("description", post.description)
  }

  return {
    title: post.title,
    description: post.description,
    authors: post.authors?.map((author) => ({
      name: author.name,
      url: author.twitter ? `https://twitter.com/${author.twitter}` : undefined,
    })),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/${params.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: post.authors?.map((author) => author.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
      creator: post.authors?.[0]?.twitter,
    },
  }
}

export async function generateStaticParams() {
  return getAllPostSlugs()
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const ogUrl = new URL("/api/og", process.env.NEXT_PUBLIC_APP_URL)
  ogUrl.searchParams.set("title", post.title)
  if (post.description) {
    ogUrl.searchParams.set("description", post.description)
  }

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="inline-block text-4xl font-bold lg:text-5xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-xl text-muted-foreground">{post.description}</p>
          )}
          <div className="flex flex-col space-y-4">
            <time
              dateTime={post.date}
              className="text-sm text-muted-foreground"
            >
              {format(new Date(post.date), "LLLL d, yyyy")}
            </time>
            {post.authors?.length ? (
              <div className="">
                {post.authors.map((author) => (
                  <AuthorCard key={author.name} author={author} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <hr className="my-8" />
      <MDXRemote
        source={post.content}
        components={components}
        options={{
          mdxOptions: {
            format: "mdx",
            remarkPlugins: [
              [remarkGfm, { singleTilde: false }],
              [remarkCodeHike, chConfig],
            ],
          },
        }}
      />
    </article>
  )
}
