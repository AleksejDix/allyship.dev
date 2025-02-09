"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Domain } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"

import { crawl } from "../actions/crawl"

interface CrawlButtonProps {
  domain: Domain
  onCrawlComplete?: (result: {
    type: "success" | "error"
    message: string
  }) => void
}

export function CrawlButton({ domain, onCrawlComplete }: CrawlButtonProps) {
  const router = useRouter()
  const { execute, isPending } = useServerAction(crawl)
  const [isLoading, setIsLoading] = useState(false)

  const handleCrawl = async () => {
    setIsLoading(true)
    try {
      const [result, error] = await execute({
        domain_id: domain.id,
        url: `https://${domain.name}`,
      })

      if (error) {
        onCrawlComplete?.({
          type: "error",
          message: "Failed to crawl website",
        })
        return
      }

      if (result?.success && result.stats) {
        onCrawlComplete?.({
          type: "success",
          message: `Found ${result.stats.total} pages (${result.stats.new} new, ${result.stats.existing} existing)`,
        })
        // Refresh the page to show updated timestamps
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCrawl}
      disabled={isLoading || isPending}
    >
      {(isLoading || isPending) && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      Crawl
    </Button>
  )
}
