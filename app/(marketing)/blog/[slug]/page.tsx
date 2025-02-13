import { notFound } from "next/navigation"
import { format } from "date-fns"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"

import { getAllPostSlugs, getPostBySlug } from "@/lib/mdx"
import { AuthorCard } from "@/components/author-card"
import { components } from "@/components/mdx-components"

interface BlogPostPageProps {
  params: {
    slug: string
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

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="inline-block text-4xl font-bold lg:text-5xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-xl text-muted-foreground">{post.description}</p>
        )}
        <div className="flex flex-col space-y-4">
          <time dateTime={post.date} className="text-sm text-muted-foreground">
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
      <hr className="my-8" />
      <MDXRemote
        source={post.content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            format: "mdx",
          },
        }}
      />
    </article>
  )
}
