import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

// Using the same Post interface from the blog page
interface Post {
  title: string
  description: string
  date: string
  slug: string
  published?: boolean
  author?: {
    name: string
    role: string
    avatar: string
  }
  coverImage?: string
  category?: string
}

interface FooterLink {
  show?: boolean
  text?: string
  href?: string
}

interface BlogBlockProps {
  title?: string
  subtitle?: string
  posts: Post[]
  showMax?: number
  footerLink?: FooterLink
}

export function BlogBlock({
  title = 'From the blog',
  subtitle = 'Learn how to grow your business with our expert advice.',
  posts = [],
  showMax = 3,
  footerLink = {
    show: true,
    text: 'View all posts',
    href: '/blog',
  },
}: BlogBlockProps) {
  // Show only the latest posts based on showMax parameter
  const latestPosts = posts
    .filter(post => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, showMax)

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {latestPosts.length > 0 ? (
            latestPosts.map((post, index) => (
              <article
                key={post.slug || index}
                className="flex flex-col items-start justify-between"
              >
                <div className="relative w-full">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={800}
                      height={450}
                      className="aspect-video w-full rounded-2xl bg-gray-100 dark:bg-gray-800 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    />
                  ) : (
                    <div className="aspect-video w-full rounded-2xl bg-gray-100 dark:bg-gray-800 sm:aspect-[2/1] lg:aspect-[3/2] flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">
                        No image
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10"></div>
                </div>

                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time
                      dateTime={post.date}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      {format(new Date(post.date), 'MMM d, yyyy')}
                    </time>

                    {post.category && (
                      <Link
                        href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="relative z-10 rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {post.category}
                      </Link>
                    )}
                  </div>

                  <div className="group relative">
                    <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      <Link href={`/blog/${post.slug}`}>
                        <span className="absolute inset-0"></span>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-400">
                      {post.description}
                    </p>
                  </div>

                  {post.author && (
                    <div className="relative mt-8 flex items-center gap-x-4">
                      {post.author.avatar ? (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-100 dark:bg-gray-800"
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                            {post.author.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      <div className="text-sm/6">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          <Link
                            href={`/blog/author/${post.author.name.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <span className="absolute inset-0"></span>
                            {post.author.name}
                          </Link>
                        </p>
                        {post.author.role && (
                          <p className="text-gray-600 dark:text-gray-400">
                            {post.author.role}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No blog posts available.
              </p>
            </div>
          )}
        </div>

        {footerLink.show && (
          <div className="mt-12 text-center">
            <Link
              href={footerLink.href || '/blog'}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
              {footerLink.text || 'View all posts'}{' '}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogBlock
