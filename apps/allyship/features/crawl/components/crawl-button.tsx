'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'

type Props = {
  website_id: string
  website_url: string
  onCrawlComplete?: (result: {
    type: 'success' | 'error'
    message: string
    stats?: {
      total: number
      new: number
      existing: number
      skipped: number
    }
  }) => void
}

export function CrawlButton({
  website_id,
  website_url,
  onCrawlComplete,
}: Props) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string>()

  const handleCrawl = async () => {
    setError(undefined)
    setIsPending(true)

    try {
      // Ensure URL has protocol
      const fullUrl = website_url.startsWith('http')
        ? website_url
        : `https://${website_url}`

      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          website_id,
          url: fullUrl,
          maxPages: 100, // Limit to 100 pages
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success || !data.data || !data.data.stats) {
        throw new Error(
          data?.error?.message || data?.error || 'Failed to crawl website'
        )
      }

      // Check if we hit the page limit
      const stats = data.data.stats
      const message =
        stats.skipped > 0
          ? `Successfully crawled ${stats.total} pages. ${stats.skipped} additional pages were skipped due to the 100 page limit.`
          : `Successfully crawled ${stats.total} pages`

      onCrawlComplete?.({
        type: 'success',
        message,
        stats,
      })

      router.refresh()
    } catch (error) {
      console.error('[CRAWL]', error)
      const message =
        error instanceof Error ? error.message : 'Failed to crawl website'
      setError(message)
      onCrawlComplete?.({
        type: 'error',
        message,
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCrawl}
        disabled={isPending}
        variant="outline"
        size="sm"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Crawling...</span>
          </>
        ) : (
          'Crawl Site'
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
