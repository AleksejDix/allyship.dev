/// <reference lib="deno.ns" />
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

interface FetchError extends Error {
  status?: number
  statusText?: string
}

// Add delay between requests to be respectful to servers
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchHtml(url: string): Promise<string> {
  console.log(`[CRAWL] Starting fetch for ${url}`)
  try {
    console.log(`[CRAWL] Sending request to ${url}`)
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
    })

    console.log(
      `[CRAWL] Response status: ${response.status} ${response.statusText}`
    )
    console.log(
      `[CRAWL] Response headers:`,
      Object.fromEntries(response.headers.entries())
    )

    if (!response.ok) {
      const error = new Error(`Failed to fetch ${url}`) as FetchError
      error.status = response.status
      error.statusText = response.statusText
      throw error
    }

    // Wait for the full response body
    const html = await response.text()
    console.log(`[CRAWL] Received HTML (${html.length} bytes):`)
    console.log(html.substring(0, 500)) // Log first 500 chars for debugging

    // Test the HTML parsing directly
    console.log('[CRAWL] Testing link extraction:')
    const linkMatches = [
      ...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/g),
      ...html.matchAll(/["'](\/[^"']+)["']/g),
    ]
    console.log(`[CRAWL] Found ${linkMatches.length} potential links:`)
    linkMatches.forEach((match, i) => {
      console.log(`[CRAWL] Link ${i + 1}:`, match[1])
    })

    // Add a small delay between requests
    await delay(1000)

    return html
  } catch (error) {
    console.error(`[CRAWL] Error fetching ${url}:`, error)
    throw error
  }
}

interface CrawlStats {
  total: number
  new: number
  existing: number
  skipped: number
}

interface CrawlResult {
  urls: string[]
  stats: CrawlStats
}

interface EnqueueLinks {
  (options: { globs?: string[]; exclude?: string[] }): Promise<void>
}

// Update the crawl function to be more verbose
async function crawlWebsite(
  rootUrl: string,
  currentUrl: string,
  sitemap: Set<string> = new Set(),
  depth: number = 0,
  maxPages: number = 100,
  stats: CrawlStats = { total: 0, new: 0, existing: 0, skipped: 0 }
): Promise<CrawlResult> {
  console.log(`\n[CRAWL] ===== Starting crawl of ${currentUrl} =====`)
  console.log(`[CRAWL] Depth: ${depth}`)
  console.log(`[CRAWL] Current sitemap size: ${sitemap.size}`)
  console.log(`[CRAWL] Current stats:`, stats)

  if (sitemap.size >= maxPages) {
    console.log(`[CRAWL] Reached max pages limit (${maxPages})`)
    return { urls: Array.from(sitemap), stats }
  }

  if (crawledUrls.has(currentUrl)) {
    console.log(`[CRAWL] URL already crawled: ${currentUrl}`)
    stats.skipped++
    return { urls: Array.from(sitemap), stats }
  }

  if (depth > 2) {
    console.log(`[CRAWL] Max depth reached for: ${currentUrl}`)
    stats.skipped++
    return { urls: Array.from(sitemap), stats }
  }

  crawledUrls.add(currentUrl)
  console.log(
    `[CRAWL] Added to crawled URLs. Total crawled: ${crawledUrls.size}`
  )

  const isNew = !sitemap.has(currentUrl)
  sitemap.add(currentUrl)

  if (isNew) {
    stats.new++
    stats.total++
    console.log(`[CRAWL] New URL added. Stats:`, stats)
  } else {
    stats.existing++
    console.log(`[CRAWL] Existing URL found. Stats:`, stats)
  }

  try {
    const html = await fetchHtml(currentUrl)

    const links = [
      ...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/g),
      ...html.matchAll(/["'](\/[^"']+)["']/g),
    ]
      .map(match => match[1])
      .filter((link): link is string => typeof link === 'string')
      .map(link => {
        console.log(`[CRAWL] Processing link: ${link}`)
        try {
          const absoluteUrl = new URL(link, currentUrl).href
          console.log(`[CRAWL] Normalized to: ${absoluteUrl}`)
          return absoluteUrl
        } catch (error) {
          console.log(`[CRAWL] Invalid URL: ${link}`)
          return null
        }
      })
      .filter((link): link is string => {
        if (!link) return false

        const isWebpage = !link.match(
          /\.(jpg|jpeg|png|gif|pdf|doc|docx|zip|rar|exe|dmg|json|xml|csv|txt|ico|svg)$/i
        )
        const isNotFragment = !link.includes('#')
        const isNotMailto = !link.startsWith('mailto:')
        const isNotTel = !link.startsWith('tel:')
        const isNotJavaScript = !link.startsWith('javascript:')
        const isSameDomain = link.startsWith(rootUrl)
        const isNotCrawled = !crawledUrls.has(link)

        console.log(`[CRAWL] Link ${link} checks:`, {
          isWebpage,
          isNotFragment,
          isNotMailto,
          isNotTel,
          isNotJavaScript,
          isSameDomain,
          isNotCrawled,
        })

        return (
          isWebpage &&
          isNotFragment &&
          isNotMailto &&
          isNotTel &&
          isNotJavaScript &&
          isSameDomain &&
          isNotCrawled
        )
      })

    console.log(`[CRAWL] Found ${links.length} valid links on ${currentUrl}`)
    console.log(`[CRAWL] Valid links:`, links)

    for (const link of links) {
      if (sitemap.size >= maxPages) {
        console.log(`[CRAWL] Max pages reached during link processing`)
        break
      }

      try {
        if (depth < 2 && sitemap.size < maxPages) {
          const result = await crawlWebsite(
            rootUrl,
            link,
            sitemap,
            depth + 1,
            maxPages,
            stats
          )
          Object.assign(stats, result.stats)
        }
      } catch (error) {
        console.error(`[CRAWL] Error processing URL ${link}:`, error)
        continue
      }
    }
  } catch (error) {
    console.error(`[CRAWL] Failed to crawl ${currentUrl}:`, error)
  }

  console.log(`[CRAWL] ===== Finished crawl of ${currentUrl} =====`)
  console.log(`[CRAWL] Final stats for this branch:`, stats)
  return { urls: Array.from(sitemap), stats }
}

// Update the main handler
Deno.serve(async (req: Request) => {
  let browser: puppeteer.Browser | undefined

  try {
    const { url } = await req.json()
    if (!url) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { message: 'URL parameter is required' },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate environment variables
    const browsercatApiKey = Deno.env.get('BROWSERCAT_API_KEY')
    if (!browsercatApiKey) throw new Error('BROWSERCAT_API_KEY is not set')

    console.log(`[CRAWL] Starting crawl of ${url}`)
    const normalizedUrl = url.endsWith('/') ? url : `${url}/`
    const urls = new Set<string>()
    const stats: CrawlStats = { total: 0, new: 0, existing: 0, skipped: 0 }
    const crawledUrls = new Set<string>()

    // Connect to browsercat
    console.log('[BROWSER] Connecting to browsercat')
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://api.browsercat.com/connect?apiKey=${browsercatApiKey}`,
    })
    console.log('[BROWSER] Connected successfully')

    // Create a new page
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    )

    // Function to crawl a single page
    async function crawlPage(pageUrl: string, depth = 0) {
      if (depth > 2 || crawledUrls.has(pageUrl) || urls.size >= 100) {
        stats.skipped++
        return
      }

      console.log(`[CRAWL] Crawling ${pageUrl} at depth ${depth}`)
      crawledUrls.add(pageUrl)

      try {
        // Navigate to the page
        await page.goto(pageUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        })

        // Wait for network to be idle
        await page
          .waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 })
          .catch(() => console.warn(`[CRAWL] Page load timeout for ${pageUrl}`))

        // Track this URL
        if (!urls.has(pageUrl)) {
          urls.add(pageUrl)
          stats.new++
          stats.total++
        } else {
          stats.existing++
        }

        // Extract all links using Puppeteer
        const links = await page.evaluate(() => {
          const anchors = document.querySelectorAll('a')
          return Array.from(anchors, a => a.href)
        })

        // Process each link
        for (const href of links) {
          try {
            const absoluteUrl = new URL(href, pageUrl).href
            if (
              absoluteUrl.startsWith(normalizedUrl) && // Same domain
              !absoluteUrl.includes('#') && // No fragments
              !absoluteUrl.match(
                /\.(jpg|jpeg|png|gif|pdf|doc|docx|zip|rar|exe|dmg|json|xml|csv|txt|ico|svg)$/i
              ) && // No files
              !absoluteUrl.startsWith('mailto:') && // No mailto
              !absoluteUrl.startsWith('tel:') && // No tel
              !absoluteUrl.startsWith('javascript:') && // No javascript
              !crawledUrls.has(absoluteUrl) // Not crawled yet
            ) {
              await crawlPage(absoluteUrl, depth + 1)
            }
          } catch (error) {
            console.warn(`[CRAWL] Invalid URL ${href}:`, error)
          }
        }
      } catch (error) {
        console.error(`[CRAWL] Error crawling ${pageUrl}:`, error)
      }
    }

    // Start crawling from the root URL
    await crawlPage(normalizedUrl)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          urls: Array.from(urls),
          stats,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[CRAWL] Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: error.message || 'Unknown error occurred' },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } finally {
    if (browser) {
      console.log('[BROWSER] Disconnecting from remote browser')
      try {
        await browser.disconnect()
      } catch (error) {
        console.warn('[BROWSER] Failed to disconnect properly:', error)
      }
    }
  }
})
