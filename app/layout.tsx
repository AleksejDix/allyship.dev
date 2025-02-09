import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

import "@/styles/index.css"

import { Outfit } from "next/font/google"
import { RouterLinkProvider } from "@/providers/RouterLinkContext"
import { Analytics } from "@vercel/analytics/react"

import AccessibleNavigation from "@/components/site/AccessibleNavigation"
import { ThemeProvider } from "@/components/ThemeProvider"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Accessibility & QA Services`,
    template: `%s | ${siteConfig.name} }`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: "Aleksej Dix",
      url: "https://www.allyship.dev/",
    },
  ],
  creator: "Aleksej Dix",
  verification: {
    google: "CJ2S8w3O_t5l-lKb0is1Cp4IxOHfiuboMfPM_hmFrYo",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/og-default.jpg`, // Default OG image
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} | Accessibility & QA Services`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og-default.jpg`],
    creator: "@aleksejdix",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
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
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
