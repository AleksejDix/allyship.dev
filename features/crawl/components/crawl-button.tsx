"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"

import { crawl } from "../actions"

type Props = {
  website_id: string
  website_url: string
  onCrawlComplete?: (result: {
    type: "success" | "error"
    message: string
    stats?: {
      total: number
      new: number
      existing: number
    }
  }) => void
}

export function CrawlButton({
  website_id,
  website_url,
  onCrawlComplete,
}: Props) {
  const router = useRouter()
  const { execute, isPending } = useServerAction(crawl)
  const [error, setError] = useState<string>()

  const handleCrawl = async () => {
    setError(undefined)

    const [result, error] = await execute({
      website_id,
      url: website_url,
    })

    if (error) {
      setError(error.message)
      onCrawlComplete?.({
        type: "error",
        message: error.message,
      })
      return
    }

    if (!result?.success) {
      setError(result?.error?.message ?? "Failed to crawl site")
      onCrawlComplete?.({
        type: "error",
        message: result?.error?.message ?? "Failed to crawl site",
      })
      return
    }

    router.refresh()
    onCrawlComplete?.({
      type: "success",
      message: `Found ${result.stats.total} pages (${result.stats.new} new)`,
      stats: result.stats,
    })
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCrawl}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Crawling...
          </>
        ) : (
          "Crawl Site"
        )}
      </Button>
      {error && (
        <div className="text-xs text-destructive absolute mt-2">{error}</div>
      )}
    </div>
  )
}
