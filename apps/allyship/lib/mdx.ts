import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface Author {
  name: string
  role?: string
  avatar?: string
  twitter?: string
  linkedin?: string
  github?: string
  website?: string
}

export interface Post {
  title: string
  description?: string
  date: string
  authors: Author[]
  slug: string
  content: string
  tags?: string[]
  published?: boolean
}

export interface Page {
  title: string
  description?: string
  slug: string
  content: string
  authors?: Author[]
}

const postsDirectory = path.join(process.cwd(), "content/blog")
const pagesDirectory = path.join(process.cwd(), "content/pages")
const authorsDirectory = path.join(process.cwd(), "content/authors")

function getAuthorData(authorSlug: string): Author | null {
  try {
    const fullPath = path.join(authorsDirectory, `${authorSlug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data } = matter(fileContents)

    return {
      name: data.name,
      role: data.role,
      avatar: data.avatar,
      twitter: data.twitter,
      linkedin: data.linkedin,
      github: data.github,
      website: data.website,
    }
  } catch (error) {
    console.error("Error getting author data:", error)
    return null
  }
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      params: Promise.resolve({
        slug: fileName.replace(/\.mdx$/, ""),
      }),
    }
  })
}

export function getAllPageSlugs() {
  const pages: { params: Promise<{ slug: string[] }> }[] = []

  function traverse(dir: string, parentPath: string[] = []) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const filePath = path.join(dir, file)
      const relativePath = [...parentPath, file]
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        traverse(filePath, relativePath)
      } else if (file.endsWith(".mdx")) {
        pages.push({
          params: Promise.resolve({
            slug: relativePath
              .join("/")
              .replace(/\.mdx$/, "")
              .split("/"),
          }),
        })
      }
    })
  }

  traverse(pagesDirectory)
  return pages
}

export async function getPostBySlug(params: Promise<{ slug: string }>): Promise<Post> {
  const { slug } = await params
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  // Get author data for each author
  const authors = (data.authors || []).map((authorSlug: string) => {
    const authorData = getAuthorData(authorSlug)
    return authorData || { name: authorSlug }
  })

  return {
    slug,
    content,
    title: data.title,
    description: data.description,
    date: data.date,
    authors,
    tags: data.tags || [],
    published: data.published !== false,
  }
}

export async function getPageBySlug(params: Promise<{ slug: string }>): Promise<Page | null> {
  try {
    const { slug } = await params
    const fullPath = path.join(pagesDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Get author data if authors are specified
    const authors = data.authors
      ? data.authors.map((authorSlug: string) => {
          const authorData = getAuthorData(authorSlug)
          return authorData || { name: authorSlug }
        })
      : undefined

    return {
      slug,
      content,
      title: data.title,
      description: data.description,
      authors,
    }
  } catch (error) {
    console.error("Error getting page by slug:", error)
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = getAllPostSlugs()
  const posts = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug.params))
  ).then((posts) =>
    posts.sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
  )

  return posts
}
