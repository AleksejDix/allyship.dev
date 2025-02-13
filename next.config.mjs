import createMDX from "@next/mdx"
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx"
import remarkGfm from "remark-gfm"

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

const withMDX = createMDX({
  remarkPlugins: [
    [remarkCodeHike, chConfig],
    [remarkGfm, { singleTilde: false }],
  ],
  recmaPlugins: [[recmaCodeHike, chConfig]],
  extension: /\.mdx?$/,
  options: {
    // This is required for `MDXRemote` to work
    providerImportSource: "@mdx-js/react",
    jsx: true,
  },
})

export default withMDX(nextConfig)
