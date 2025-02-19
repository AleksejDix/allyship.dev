import { remarkCodeHike } from "codehike/mdx"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import { remarkTableOfContents } from "remark-table-of-contents"

export const remarkPlugins = [
  [
    remarkTableOfContents,
    {
      containerAttributes: {
        id: "articleToc",
        className: "not-prose",
      },
      navAttributes: {
        "aria-label": "table of contents",
      },
      maxDepth: 3,
    },
  ],
  [remarkGfm, { singleTilde: false }],
  [
    remarkCodeHike,
    {
      components: { code: "Code" },
    },
  ],
]

export const rehypePlugins = [
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "wrap" }],
]
