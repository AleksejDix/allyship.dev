"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Database } from "@/database.types"
import { Loader2 } from "lucide-react"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"

import { crawl } from "../actions/crawl"

type Domain = Database["public"]["Tables"]["Domain"]["Row"]

type Props = {
  domain: Domain
  onCrawlComplete?: (result: {
    type: "success" | "error"
    message: string
  }) => void
}

export function CrawlButton({ domain, onCrawlComplete }: Props) {
  const router = useRouter()
  const { execute, isPending } = useServerAction(crawl)
  const [error, setError] = useState<string>()

  const handleCrawl = async () => {
    setError(undefined)

    const [result, error] = await execute({
      domain_id: domain.id,
      url: `https://${domain.name}`,
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
      setError("Failed to crawl site")
      onCrawlComplete?.({
        type: "error",
        message: "Failed to crawl site",
      })
      return
    }

    router.refresh()
    onCrawlComplete?.({
      type: "success",
      message: "Site crawled successfully",
    })
  }

  return (
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
      {error && (
        <div className="text-xs text-destructive absolute mt-8">{error}</div>
      )}
    </Button>
  )
}
