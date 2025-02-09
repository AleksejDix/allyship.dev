import { NextRequest, NextResponse } from "next/server"

const crawledUrls = new Set<string>()

async function fetchHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok)
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    return await response.text()
  } catch (error) {
    throw new Error(`Error fetching ${url}: ${(error as Error).message}`)
  }
}

async function crawlWebsite(
  rootUrl: string,
  currentUrl: string,
  sitemap: Set<string> = new Set(),
  depth: number = 0
): Promise<string[]> {
  if (crawledUrls.has(currentUrl) || depth > 1) return Array.from(sitemap)
  crawledUrls.add(currentUrl)

  try {
    const html = await fetchHtml(currentUrl)

    const links = [...html.matchAll(/<a\s+[^>]*href="(.*?)"/g)]
      .map((match) => match[1])
      .filter((link) => !link.includes("#"))

    for (const link of links) {
      try {
        const absoluteUrl = new URL(link, rootUrl).href

        if (absoluteUrl.startsWith(rootUrl) && !crawledUrls.has(absoluteUrl)) {
          sitemap.add(absoluteUrl)
          // Only crawl deeper if we're at depth 0
          if (depth === 0) {
            await crawlWebsite(rootUrl, absoluteUrl, sitemap, depth + 1)
          }
        }
      } catch {
        // Ignore invalid URLs
      }
    }
  } catch (err) {
    console.error(`Error crawling ${currentUrl}:`, (err as Error).message)
  }

  return Array.from(sitemap)
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Extract URL from query parameters
  const { searchParams } = new URL(request.url)
  const rootUrl = searchParams.get("url")

  console.log("sf", { rootUrl })

  if (!rootUrl || !/^https?:\/\//.test(rootUrl)) {
    return NextResponse.json(
      { error: "Please provide a valid root URL (e.g., https://example.com)" },
      { status: 400 }
    )
  }

  try {
    // Generate sitemap
    const sitemap = await crawlWebsite(rootUrl, rootUrl)
    return NextResponse.json({ sitemap }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate sitemap." },
      { status: 500 }
    )
  }
}
