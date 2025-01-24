import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

import "@/styles/index.css"

import { RouterLinkProvider } from "@/providers/RouterLinkContext"

import { ThemeProvider } from "@/components/ThemeProvider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["A11y", "Accessibility", "Testing", "Next.js", "Nuxt.js"],
  authors: [
    {
      name: "Aleksej Dix",
      url: "https://www.allyship.dev/",
    },
  ],
  creator: "Aleksej Dix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
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
    <html lang="en" className="dark  dark:bg-zinc-950 antialiased">
      <body className="stickyfooter">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RouterLinkProvider>{children}</RouterLinkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
