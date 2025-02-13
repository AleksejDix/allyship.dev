import createMDX from "@next/mdx"
import remarkGfm from 'remark-gfm'


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

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkGfm, { singleTilde: false }]],
    rehypePlugins: [],
    // This is required for `MDXRemote` to work
    providerImportSource: "@mdx-js/react",
  },
})

export default withMDX(nextConfig)
