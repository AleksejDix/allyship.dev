import Link from "next/link"
import { allPosts } from "contentlayer/generated"
import { compareDesc } from "date-fns"

import { formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"

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
    <div className="container max-w-4xl py-8">
      <PageHeader
        heading="Blog"
        description="Keep up to date with the latest news and updates."
      />

      <Separator className="my-4" />

      <div className="mt-12 max-w-prose">
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post._id}>
              <Link href={post.slug} className="block">
                <div className="gap-4 justify-between">
                  <h2 className="text-lg font-medium text-foreground ">
                    {post.title}
                  </h2>
                  {post.date && (
                    <time
                      dateTime={post.date}
                      className="text-sm text-muted-foreground tabular-nums whitespace-nowrap"
                    >
                      {formatDate(post.date)}
                    </time>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
