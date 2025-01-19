import createMDX from "@next/mdx"
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx"
import { withContentlayer } from "next-contentlayer2"

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
}

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  components: { code: "Code" },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [[remarkCodeHike, chConfig]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
    jsx: true,
  },
})

export default withContentlayer(withMDX(nextConfig))
