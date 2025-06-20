/// <reference lib="deno.ns" />
import { createClient } from 'jsr:@supabase/supabase-js@2'

interface PgmqMessage {
  msg_id: number
  message: {
    crawl_job_id: string
    url: string
    depth: number
    priority: number
    queued_at: string
  }
}

interface FoundLink {
  url: string
  depth: number
  priority: number
}

// Normalize URL for consistent storage
function normalizeUrl(
  url: string,
  baseUrl: string
): { url: string; path: string } | null {
  try {
    const urlObj = new URL(url, baseUrl)

    // Remove fragments and query parameters for crawling
    urlObj.hash = ''
    urlObj.search = ''

    const normalizedUrl = urlObj.href
    let path = urlObj.pathname

    // Normalize path
    if (path === '/' || path === '') {
      path = '/'
    } else {
      // Remove trailing slash unless it's root
      path = path.replace(/\/$/, '')
    }

    return { url: normalizedUrl, path }
  } catch (error) {
    console.error(`[NORMALIZE] Error normalizing URL ${url}:`, error)
    return null
  }
}

// Extract links from HTML
function extractLinks(
  html: string,
  baseUrl: string,
  currentDepth: number,
  maxDepth: number = 2
): FoundLink[] {
  try {
    console.log(
      `[EXTRACT] Extracting links from ${baseUrl} at depth ${currentDepth}`
    )

    // Don't extract links if we're at max depth
    if (currentDepth >= maxDepth) {
      console.log(
        `[EXTRACT] Max depth ${maxDepth} reached, skipping link extraction`
      )
      return []
    }

    const links: FoundLink[] = []
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi
    const baseDomain = new URL(baseUrl).origin

    let match
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1]

      // Skip if href is undefined
      if (!href) continue

      // Skip non-web links
      if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href.startsWith('#') ||
        href.match(
          /\.(jpg|jpeg|png|gif|pdf|doc|docx|zip|rar|exe|dmg|json|xml|csv|txt|ico|svg)$/i
        )
      ) {
        continue
      }

      const normalized = normalizeUrl(href, baseUrl)
      if (!normalized) continue

      // Only include links from the same domain
      if (!normalized.url.startsWith(baseDomain)) continue

      // Set priority based on depth (shallower = higher priority)
      const priority = Math.max(0, 10 - currentDepth)

      links.push({
        url: normalized.url,
        depth: currentDepth + 1,
        priority,
      })
    }

    // Remove duplicates
    const uniqueLinks = links.filter(
      (link, index, self) => index === self.findIndex(l => l.url === link.url)
    )

    console.log(`[EXTRACT] Found ${uniqueLinks.length} unique links`)
    return uniqueLinks
  } catch (error) {
    console.error(`[EXTRACT] Error extracting links from ${baseUrl}:`, error)
    return []
  }
}

// Fetch HTML content with timeout and error handling
async function fetchHtml(url: string): Promise<string> {
  console.log(`[FETCH] Starting to fetch ${url}`)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Allyship-Crawler/2.0 (+https://allyship.dev)',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
      signal: controller.signal,
      redirect: 'follow',
    })

    console.log(`[FETCH] Response status: ${response.status} for ${url}`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      throw new Error(`Not HTML content: ${contentType}`)
    }

    const html = await response.text()
    console.log(
      `[FETCH] Successfully fetched ${html.length} characters from ${url}`
    )
    return html
  } catch (error) {
    console.error(`[FETCH] Error fetching ${url}:`, error)
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

// Process a single message from pgmq
async function processMessage(
  supabase: any,
  message: PgmqMessage
): Promise<{ success: boolean; linksFound: number; error?: string }> {
  const { msg_id, message: msgData } = message
  const { crawl_job_id, url, depth } = msgData

  console.log(`[CRAWL] Processing ${url} (depth: ${depth}, msg_id: ${msg_id})`)

  try {
    // Fetch the HTML content
    console.log(`[CRAWL] Step 1: Fetching HTML for ${url}`)
    const html = await fetchHtml(url)

    // Extract links from the page
    console.log(`[CRAWL] Step 2: Extracting links from ${url}`)
    const foundLinks = extractLinks(html, url, depth)

    console.log(`[CRAWL] Found ${foundLinks.length} links on ${url}`)

    // Get the normalized path for this URL
    console.log(`[CRAWL] Step 3: Normalizing URL ${url}`)
    const normalized = normalizeUrl(url, url)
    const path = normalized?.path || '/'

    // Update job progress with this processed URL
    console.log(`[CRAWL] Step 4: Updating progress for job ${crawl_job_id}`)
    const { error: updateError } = await supabase.rpc('update_crawl_progress', {
      p_crawl_job_id: crawl_job_id,
      p_processed_url: url,
      p_path: path,
      p_depth: depth,
      p_links_found: foundLinks.length,
    })

    if (updateError) {
      console.error(`[CRAWL] Error updating progress:`, updateError)
    } else {
      console.log(`[CRAWL] Successfully updated progress`)
    }

    // Queue new URLs if any were found
    if (foundLinks.length > 0) {
      console.log(`[CRAWL] Step 5: Queuing ${foundLinks.length} new URLs`)
      for (const link of foundLinks) {
        const { error: queueError } = await supabase.rpc('queue_crawl_url', {
          p_crawl_job_id: crawl_job_id,
          p_url: link.url,
          p_depth: link.depth,
          p_priority: link.priority,
        })

        if (queueError) {
          console.error(`[CRAWL] Error queuing ${link.url}:`, queueError)
        } else {
          console.log(`[CRAWL] Queued ${link.url}`)
        }
      }
    } else {
      console.log(`[CRAWL] No links to queue`)
    }

    // Delete the processed message from pgmq
    console.log(`[CRAWL] Step 6: Deleting processed message ${msg_id}`)
    const { error: deleteError } = await supabase.rpc('pgmq_delete', {
      p_queue_name: 'crawl_queue',
      p_msg_id: msg_id,
    })

    if (deleteError) {
      console.error(`[CRAWL] Error deleting message:`, deleteError)
    } else {
      console.log(`[CRAWL] Successfully deleted message ${msg_id}`)
    }

    console.log(`[CRAWL] Successfully processed ${url}`)
    return { success: true, linksFound: foundLinks.length }
  } catch (error) {
    console.error(`[CRAWL] Error processing ${url}:`, error)

    // Update job progress with failed URL
    try {
      const { error: updateError } = await supabase.rpc(
        'update_crawl_progress_failed',
        {
          p_crawl_job_id: crawl_job_id,
          p_failed_url: url,
          p_error_message:
            error instanceof Error ? error.message : String(error),
        }
      )

      if (updateError) {
        console.error(`[CRAWL] Error updating failed progress:`, updateError)
      }
    } catch (updateErr) {
      console.error(`[CRAWL] Exception updating failed progress:`, updateErr)
    }

    // Delete the failed message from pgmq (don't retry for now)
    try {
      const { error: deleteError } = await supabase.rpc('pgmq_delete', {
        p_queue_name: 'crawl_queue',
        p_msg_id: msg_id,
      })

      if (deleteError) {
        console.error(`[CRAWL] Error deleting failed message:`, deleteError)
      }
    } catch (deleteErr) {
      console.error(`[CRAWL] Exception deleting failed message:`, deleteErr)
    }

    return {
      success: false,
      linksFound: 0,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

Deno.serve(async (req: Request) => {
  console.log(`[MAIN] Edge function called`)

  try {
    // Validate environment variables
    console.log(`[MAIN] Validating environment variables`)
    const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl) {
      console.error(`[MAIN] NEXT_PUBLIC_SUPABASE_URL is not set`)
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
    }
    if (!serviceRoleKey) {
      console.error(`[MAIN] SUPABASE_SERVICE_ROLE_KEY is not set`)
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
    }

    console.log(`[MAIN] Creating Supabase client`)
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Check if this is a request to start a new crawl job
    console.log(`[MAIN] Parsing request body`)
    const body = await req.json().catch(err => {
      console.log(`[MAIN] No JSON body or parse error:`, err)
      return {}
    })

    console.log(`[MAIN] Request body:`, body)

    if (body.action === 'start_crawl') {
      console.log(`[MAIN] Handling start_crawl action`)
      const { website_id, url } = body

      if (!website_id || !url) {
        console.error(
          `[MAIN] Missing required parameters: website_id=${website_id}, url=${url}`
        )
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              message: 'website_id and url are required for start_crawl',
            },
          }),
          { headers: { 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      console.log(`[CRAWL] Starting new crawl job for ${url}`)

      // Create a new crawl job
      console.log(`[CRAWL] Creating crawl job in database`)
      const { data: crawlJob, error: jobError } = await supabase
        .from('CrawlJob')
        .insert({
          website_id,
          status: 'running',
          started_at: new Date().toISOString(),
          progress: {
            urls_queued: 1,
            urls_processed: 0,
            urls_completed: 0,
            urls_failed: 0,
            crawled_urls: [],
          },
        })
        .select()
        .single()

      if (jobError) {
        console.error(`[CRAWL] Error creating crawl job:`, jobError)
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              message: 'Failed to create crawl job',
              details: jobError.message,
            },
          }),
          { headers: { 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      console.log(`[CRAWL] Created crawl job with ID: ${crawlJob.id}`)

      // Queue the initial URL
      console.log(`[CRAWL] Queuing initial URL: ${url}`)
      const { error: queueError } = await supabase.rpc('queue_crawl_url', {
        p_crawl_job_id: crawlJob.id,
        p_url: url,
        p_depth: 0,
        p_priority: 100,
      })

      if (queueError) {
        console.error(`[CRAWL] Error queuing initial URL:`, queueError)
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              message: 'Failed to queue initial URL',
              details: queueError.message,
            },
          }),
          { headers: { 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      console.log(`[CRAWL] Successfully queued initial URL`)

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            crawl_job_id: crawlJob.id,
            message: 'Crawl job started successfully',
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Default behavior: process next message from pgmq
    console.log(`[MAIN] Looking for next message in pgmq queue`)

    // Read next message from pgmq
    console.log(`[MAIN] Calling pgmq_read function`)
    const { data: messages, error: readError } = await supabase.rpc(
      'pgmq_read',
      {
        p_queue_name: 'crawl_queue',
        p_vt: 30, // 30 second visibility timeout
        p_qty: 1, // Read 1 message
      }
    )

    if (readError) {
      console.error(`[MAIN] Error reading from pgmq:`, readError)
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: 'Failed to read from queue',
            details: readError.message,
          },
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log(`[MAIN] pgmq_read returned:`, messages)

    if (!messages || messages.length === 0) {
      console.log(`[MAIN] No messages in queue to process`)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No messages in queue to process',
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    const message = messages[0] as PgmqMessage
    console.log(`[MAIN] Processing message:`, message)

    // Process the message
    const result = await processMessage(supabase, message)

    // Check if the crawl job is complete
    console.log(
      `[MAIN] Checking job completion for ${message.message.crawl_job_id}`
    )
    const { error: checkError } = await supabase.rpc(
      'check_crawl_job_completion',
      {
        p_crawl_job_id: message.message.crawl_job_id,
      }
    )

    if (checkError) {
      console.error(`[MAIN] Error checking job completion:`, checkError)
    }

    console.log(`[MAIN] Returning success response`)
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          processed_url: message.message.url,
          crawl_job_id: message.message.crawl_job_id,
          links_found: result.linksFound,
          processing_success: result.success,
          error: result.error,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[MAIN] Unexpected error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: 'Internal server error',
          details: error instanceof Error ? error.message : String(error),
        },
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
