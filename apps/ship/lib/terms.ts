import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface Term {
  slug: string
  title: string
  description?: string
}

const termsDirectory = path.join(process.cwd(), "content/terms")

export function getAllTerms(): Term[] {
  // Get file names under /terms
  const fileNames = fs.readdirSync(termsDirectory)
  const terms = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      // Remove ".mdx" from file name to get slug
      const slug = fileName.replace(/\.mdx$/, "")

      // Read markdown file as string
      const fullPath = path.join(termsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")

      // Use gray-matter to parse the term metadata section
      const { data } = matter(fileContents)

      // Validate and return the term
      return {
        slug,
        title: data.title,
        description: data.description,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

  return terms
}
