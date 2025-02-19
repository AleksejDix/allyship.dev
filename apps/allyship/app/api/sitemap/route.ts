import { NextRequest, NextResponse } from 'next/server'

const crawledUrls = new Set<string>()

interface FetchError extends Error {
  status?: number
  statusText?: string
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Allyship-Crawler/1.0',
    },
    // Add a reasonable timeout
    signal: AbortSignal.timeout(10000),
  })

  if (!response.ok) {
    const error = new Error(`Failed to fetch ${url}`) as FetchError
    error.status = response.status
    error.statusText = response.statusText
    throw error
  }

  return response.text()
}

async function crawlWebsite(
  rootUrl: string,
  currentUrl: string,
  sitemap: Set<string> = new Set(),
  depth: number = 0
): Promise<string[]> {
  if (crawledUrls.has(currentUrl) || depth > 1) {
    return Array.from(sitemap)
  }

  crawledUrls.add(currentUrl)

  const html = await fetchHtml(currentUrl)

  const links = [...html.matchAll(/<a\s+[^>]*href="(.*?)"/g)]
    .map(match => match[1])
    .filter((link): link is string => typeof link === 'string')
    .filter(link => !link.includes('#'))

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
      // Silently continue on invalid URLs
      continue
    }
  }

  return Array.from(sitemap)
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const rootUrl = searchParams.get('url')

  if (!rootUrl || !/^https?:\/\//.test(rootUrl)) {
    return NextResponse.json(
      {
        error: 'Please provide a valid root URL (e.g., https://example.com)',
        code: 'invalid_url',
      },
      { status: 400 }
    )
  }

  try {
    const sitemap = await crawlWebsite(rootUrl, rootUrl)

    return NextResponse.json(
      {
        sitemap,
        stats: {
          totalUrls: sitemap.length,
          crawledUrls: crawledUrls.size,
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate sitemap',
        code: 'crawl_failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    // Clear the crawled URLs set for the next request
    crawledUrls.clear()
  }
}
