import Link from "next/link"
import { compareDesc } from "date-fns"

import { getAllPosts } from "@/lib/mdx"
import { formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Blog",
}

export default async function BlogPage() {
  const posts = getAllPosts()
    .filter((post) => post.published !== false)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    })

  return (
    <div className="container max-w-4xl py-8">
      <PageHeader
        heading="Blog"
        description="Keep up to date with the latest news and updates."
      />

      <Separator className="my-4" />

      <main className="mt-12">
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                <Link
                  href={`/blog/${post.slug}`}
                  className="grid grid-cols-4 group p-2 rounded-md
                    transition-colors duration-200
                    hover:bg-muted hover:shadow-sm
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    focus-visible:bg-muted focus-visible:shadow-sm"
                >
                  {post.date && (
                    <time
                      dateTime={post.date}
                      className="text-sm text-muted-foreground tabular-nums whitespace-nowrap
                        group-hover:text-foreground group-focus-visible:text-foreground"
                    >
                      {formatDate(post.date)}
                    </time>
                  )}
                  <div className="col-span-12 md:col-span-3">
                    <h2
                      className="text-base font-normal text-foreground
                      border-b border-transparent
                      group-hover:border-current group-focus-visible:border-current
                      transition-[border-color]"
                    >
                      {post.title}
                    </h2>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
