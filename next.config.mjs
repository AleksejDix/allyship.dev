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

export default nextConfig
