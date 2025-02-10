import { NextRequest, NextResponse } from "next/server"

import { logDebug, logError, logInfo } from "@/lib/logger"

const crawledUrls = new Set<string>()

interface FetchError extends Error {
  status?: number
  statusText?: string
}

async function fetchHtml(url: string): Promise<string> {
  logDebug("Attempting to fetch HTML", { url })
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Allyship-Crawler/1.0",
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

    const html = await response.text()
    logDebug("Successfully fetched HTML", {
      url,
      contentLength: html.length,
      status: response.status,
    })
    return html
  } catch (error) {
    logError("Error fetching HTML", {
      url,
      error: error instanceof Error ? error.message : String(error),
      status: (error as FetchError).status,
      statusText: (error as FetchError).statusText,
    })
    throw error
  }
}

async function crawlWebsite(
  rootUrl: string,
  currentUrl: string,
  sitemap: Set<string> = new Set(),
  depth: number = 0
): Promise<string[]> {
  if (crawledUrls.has(currentUrl) || depth > 1) {
    logDebug("Skipping URL", {
      currentUrl,
      reason: crawledUrls.has(currentUrl)
        ? "already crawled"
        : "max depth reached",
      depth,
    })
    return Array.from(sitemap)
  }

  crawledUrls.add(currentUrl)
  logInfo("Crawling URL", {
    currentUrl,
    depth,
    totalUrlsCrawled: crawledUrls.size,
  })

  try {
    const html = await fetchHtml(currentUrl)

    const links = [...html.matchAll(/<a\s+[^>]*href="(.*?)"/g)]
      .map((match) => match[1])
      .filter((link) => !link.includes("#"))

    logDebug("Found links on page", {
      currentUrl,
      totalLinks: links.length,
      sampleLinks: links.slice(0, 3),
    })

    for (const link of links) {
      try {
        const absoluteUrl = new URL(link, rootUrl).href

        if (absoluteUrl.startsWith(rootUrl) && !crawledUrls.has(absoluteUrl)) {
          sitemap.add(absoluteUrl)
          logDebug("Added URL to sitemap", { absoluteUrl, currentDepth: depth })

          // Only crawl deeper if we're at depth 0
          if (depth === 0) {
            await crawlWebsite(rootUrl, absoluteUrl, sitemap, depth + 1)
          }
        }
      } catch (error) {
        logError("Invalid URL encountered", {
          originalLink: link,
          currentUrl,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  } catch (error) {
    logError("Error during crawl", {
      currentUrl,
      error: error instanceof Error ? error.message : String(error),
      status: (error as FetchError).status,
      statusText: (error as FetchError).statusText,
    })
  }

  return Array.from(sitemap)
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const rootUrl = searchParams.get("url")

  logInfo("Received sitemap generation request", { rootUrl })

  if (!rootUrl || !/^https?:\/\//.test(rootUrl)) {
    logError("Invalid root URL provided", { rootUrl })
    return NextResponse.json(
      {
        error: "Please provide a valid root URL (e.g., https://example.com)",
        code: "invalid_url",
      },
      { status: 400 }
    )
  }

  try {
    logInfo("Starting sitemap generation", { rootUrl })
    const sitemap = await crawlWebsite(rootUrl, rootUrl)

    logInfo("Sitemap generation completed", {
      rootUrl,
      totalUrls: sitemap.length,
      sampleUrls: sitemap.slice(0, 3),
    })

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
    logError("Sitemap generation failed", {
      rootUrl,
      error: error instanceof Error ? error.message : String(error),
      status: (error as FetchError).status,
      statusText: (error as FetchError).statusText,
    })

    return NextResponse.json(
      {
        error: "Failed to generate sitemap",
        code: "crawl_failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  } finally {
    // Clear the crawled URLs set for the next request
    crawledUrls.clear()
    logDebug("Cleared crawled URLs cache", { rootUrl })
  }
}
