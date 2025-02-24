"use client"

import { cn } from "@/lib/utils"
import { usePage } from "@/providers/page-provider"
import { Link2 } from "lucide-react"

export function PagesList() {
  const { pages, isLoading } = usePage()

  if (isLoading) {
    return (
      <div className="flex h-[32px] items-center justify-between gap-2 border-b px-3">
        <div className="text-[10px] text-muted-foreground">
          Loading pages...
        </div>
      </div>
    )
  }

  if (!pages.length) {
    return (
      <div className="flex h-[32px] items-center justify-between gap-2 border-b px-3">
        <div className="text-[10px] text-muted-foreground">
          No pages tracked yet
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {pages.map((page) => (
        <div
          key={page.id}
          className="flex h-[32px] items-center justify-between gap-2 border-b px-3 hover:bg-muted/50">
          <div className="flex min-w-0 items-center gap-2">
            <Link2 className="h-3 w-3 text-green-600 dark:text-green-400" />
            <div className="text-[10px] font-medium flex items-center min-w-0">
              <span className="shrink-0 text-green-600 dark:text-green-400">
                {page.website.normalized_url}
              </span>
              <span className="truncate text-green-600 dark:text-green-400">
                {page.path}
              </span>
            </div>
          </div>
          <a
            href={`https://allyship.dev/spaces/${page.website.space_id}/${page.website_id}/pages/${page.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground hover:text-foreground">
            View in Dashboard
          </a>
        </div>
      ))}
    </div>
  )
}
