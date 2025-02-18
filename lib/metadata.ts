import { Metadata } from "next"

import { siteConfig } from "@/config/site"

type GenerateMetadataOptions = {
  title?: string
  description?: string
  path: string
  ogImage?: string
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description = siteConfig.description,
  path,
  ogImage = "/og.png",
  noIndex = false,
}: GenerateMetadataOptions): Metadata {
  const canonicalUrl = `${siteConfig.url}${path}`

  return {
    title: title ? `${title} | ${siteConfig.name}` : undefined,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      title: title || siteConfig.name,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteConfig.name,
      description,
      images: [`${siteConfig.url}${ogImage}`],
      creator: "@aleksejdix",
      site: "@allyship_dev",
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  }
}
