import bundleAnalyzer from '@next/bundle-analyzer'
import createMDX from '@next/mdx'
import { withSentryConfig } from '@sentry/nextjs'

import { rehypePlugins, remarkPlugins } from './mdx.config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  typescript: {
    // This will show type errors in the UI components but won't fail the build
    ignoreBuildErrors: true,
  },
  experimental: {
    clientTraceMetadata: ['sentry-trace', 'baggage'],
    instrumentationHook: undefined,
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jzicfoncnrqfymqszmxp.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
    rehypePlugins,
  },
})

// Apply MDX configuration first, then Sentry
export default withBundleAnalyzer(
  withSentryConfig(
    withMDX(nextConfig),
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,

      org: 'dix-consulting',
      project: 'allyshipdev',

      // Attempts to upload source maps 3 times with a 10 second delay between attempts
      uploadSourceMaps: {
        retries: 3,
        delay: 10000,
      },

      // Don't fail the build if source map upload fails
      errorHandler: (err, invokeErr, compilation) => {
        compilation.warnings.push('Sentry source map upload failed:', err)
        return null
      },
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: '/monitoring',

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,
    }
  )
)
