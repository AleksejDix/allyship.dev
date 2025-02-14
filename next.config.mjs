import createMDX from "@next/mdx"
import { remarkCodeHike } from "codehike/mdx"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import { remarkTableOfContents } from "remark-table-of-contents"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jzicfoncnrqfymqszmxp.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
}

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  // optional (see code docs):
  components: { code: "Code" },
  // if you can't use RSC:
  // syntaxHighlighting: {
  //   theme: "github-dark",
  // },
}

/** @type {import('remark-table-of-contents').IRemarkTableOfContentsOptions} */
const remarkTableOfContentsOptions = {
  containerAttributes: {
    id: "articleToc",
    className: "not-prose",
  },
  navAttributes: {
    "aria-label": "table of contents",
  },
  maxDepth: 3,
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [remarkTableOfContents, remarkTableOfContentsOptions],
      [remarkGfm, { singleTilde: false }],
      [remarkCodeHike, chConfig],
    ],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
})

export default withMDX(nextConfig)
