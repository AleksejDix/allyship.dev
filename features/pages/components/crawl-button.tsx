"use client"

import { useState } from "react"
import { Domain } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"

import { crawl } from "../actions/crawl"

interface CrawlButtonProps {
  domain: Domain
}

export function CrawlButton({ domain }: CrawlButtonProps) {
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
        alert(`Failed to crawl website"`)
        return
      }

      if (result?.success) {
        alert(`Successfully crawled ${result.data?.length} pages`)
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
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Crawl
    </Button>
  )
}
