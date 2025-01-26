import Image from "next/image"
import Link from "next/link"
import { allPosts } from "contentlayer/generated"
import { compareDesc } from "date-fns"

import { formatDate } from "@/lib/utils"
import { PageHeader } from "@/components/page-header"
import { Separator } from "@/components/ui/separator"

export const metadata = {
  title: "Blog",
}

export default async function BlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    })

  return (

      <div className="container py-8 space-y-8 mx-auto">
        <PageHeader
          heading="Blog"
          description="Keep up to date with the latest news and updates."
        />

        <Separator className="my-4" />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post._id}
              className="group relative rounded-lg border border-border bg-card p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={804}
                  height={452}
                  className="rounded-md border bg-muted transition-colors mb-4"
                  priority={index <= 1}
                />
              )}
              <h2 className="text-xl font-bold">{post.title}</h2>
              {post.description && (
                <p className="mt-2 line-clamp-3 text-muted-foreground">
                  {post.description}
                </p>
              )}
              {post.date && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </p>
              )}
              <Link href={post.slug} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
    </div>
  )
}
