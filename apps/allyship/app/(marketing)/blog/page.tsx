import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { compareDesc } from 'date-fns'

import { generateMetadata } from '@/lib/metadata'
import { formatDate } from '@/lib/utils'
import { Separator } from '@workspace/ui/components/separator'
import { PageHeader } from '@/components/page-header'
import BlogBlock from '@/components/blocks/blog'

export const metadata = generateMetadata({
  title: 'Blog',
  description:
    'Keep up to date with the latest news and updates about web accessibility, testing, and inclusive design.',
  path: '/blog',
})

interface Post {
  title: string
  description: string
  date: string
  slug: string
  published?: boolean
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(
    process.cwd(),
    'app/(marketing)/blog/(posts)'
  )
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true })

  const postPromises = entries
    .filter(entry => entry.isDirectory())
    .flatMap(async entry => {
      // Handle date-grouped directories (new structure)
      if (entry.name.startsWith('(')) {
        const datePostsPath = path.join(postsDirectory, entry.name)
        const postEntries = fs
          .readdirSync(datePostsPath, { withFileTypes: true })
          .filter(entry => entry.isDirectory())

        const posts = await Promise.all(
          postEntries.map(async postEntry => {
            const { metadata, frontmatter } = await import(
              `./(posts)/${entry.name}/${postEntry.name}/page.mdx`
            )

            return {
              slug: postEntry.name,
              title: metadata.title,
              description: metadata.description,
              date: frontmatter.date,
              published: frontmatter.status === 'published',
              coverImage: frontmatter.coverImage,
            }
          })
        )

        return posts
      }

      // Handle old structure during migration
      if (entry.name.match(/^\d{4}-\d{2}-\d{2}/)) {
        const { metadata, frontmatter } = await import(
          `./(posts)/${entry.name}/page.mdx`
        )

        // Extract the slug without the date prefix
        const slug = entry.name.replace(/^\d{4}-\d{2}-\d{2}-/, '')

        return [
          {
            slug,
            title: metadata.title,
            description: metadata.description,
            date: frontmatter.date,
            published: frontmatter.status === 'published',
          },
        ]
      }

      return []
    })

  const nestedPosts = await Promise.all(postPromises)
  return nestedPosts.flat()
}

export default async function BlogPage() {
  const posts = (await getAllPosts())
    .filter(post => post.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    })

  return (
    <div className="container">
      <BlogBlock
        title="Latest News"
        subtitle="Updates from our team"
        posts={posts}
        showMax={Infinity} // Show up to 5 posts
        footerLink={{
          show: false,
        }}
      />
    </div>
  )
}
