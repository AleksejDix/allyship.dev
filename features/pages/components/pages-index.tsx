"use client"

import * as React from "react"
import type { Tables } from "@/database.types"
import { formatDate } from "@/utils/date-formatting"

import { Card, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RouterLink } from "@/components/RouterLink"

import { PageDeleteDialog } from "./page-delete-dialog"

type Props = {
  pages: Tables<"Page">[]
  website_id: string
  space_id: string
}

export function PagesIndex({ pages, space_id, website_id }: Props) {
  const [filter, setFilter] = React.useState("")

  const filteredPages = React.useMemo(() => {
    return pages.filter((page) =>
      page.url.toLowerCase().includes(filter.toLowerCase())
    )
  }, [pages, filter])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter pages..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredPages.length > 0 ? (
          filteredPages.map((page) => (
            <Card key={page.id}>
              <CardHeader className="flex-row items-center justify-between space-y-0 p-4">
                <div className="space-y-1">
                  <RouterLink
                    href={`/spaces/${space_id}/${website_id}/pages/${page.id}`}
                    className="font-medium hover:underline"
                  >
                    {page.url}
                  </RouterLink>
                  <div className="text-sm text-muted-foreground">
                    Added {formatDate(page.created_at)}
                  </div>
                </div>
                <PageDeleteDialog
                  page={page}
                  space_id={space_id}
                  website_id={website_id}
                />
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-semibold">No pages found</h3>
            <p className="text-sm text-muted-foreground">
              {filter
                ? "Try adjusting your search"
                : "Add your first page to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
