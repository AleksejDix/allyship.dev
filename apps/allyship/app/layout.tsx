import type { Metadata } from 'next'

import { siteConfig } from '@/config/site'

import '@/styles/index.css'
import '@/styles/allystudio-toolbar.css'

import { Outfit } from 'next/font/google'
import { RouterLinkProvider } from '@/providers/RouterLinkContext'
import { Analytics } from '@vercel/analytics/react'

import AccessibleNavigation from '@/components/site/AccessibleNavigation'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AccessibilityToolbar } from '@/components/tools/toolbar'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Accessibility & QA Services`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'web accessibility',
    'WCAG',
    'accessibility tools',
    'QA services',
    'digital accessibility',
    'a11y',
    'accessibility testing',
    'web development',
    'inclusive design',
  ],
  authors: [
    {
      name: 'Aleksej Dix',
      url: siteConfig.url,
    },
  ],
  creator: 'Aleksej Dix',
  publisher: 'Allyship.dev',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
    creator: '@aleksejdix',
    creatorId: '1467726470533754880',
    site: '@allyship_dev',
  },
  verification: {
    google: 'CJ2S8w3O_t5l-lKb0is1Cp4IxOHfiuboMfPM_hmFrYo',
  },
  category: 'technology',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#0f172a',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.name,
    startupImage: [
      {
        url: '/apple-touch-icon.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} dark  dark:bg-zinc-950 antialiased`}
    >
      <body>
        <AccessibleNavigation />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RouterLinkProvider>{children}</RouterLinkProvider>
          <AccessibilityToolbar />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
