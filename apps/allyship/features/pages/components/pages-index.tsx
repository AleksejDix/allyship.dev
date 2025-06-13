'use client'

import * as React from 'react'
import type { Tables } from '@/database.types'
import { formatDate } from '@/utils/date-formatting'
import { FileText } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { Input } from '@workspace/ui/components/input'
import { RouterLink } from '@/components/RouterLink'
import { PageDeleteDialog } from './page-delete-dialog'

type Props = {
  pages: Tables<'Page'>[]
  website_id: string
  space_id: string
}

export function PagesIndex({ pages, space_id, website_id }: Props) {
  const [filter, setFilter] = React.useState('')

  const filteredPages = React.useMemo(() => {
    return pages.filter(page =>
      page.url.toLowerCase().includes(filter.toLowerCase())
    )
  }, [pages, filter])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter pages..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredPages.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page URL</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map(page => (
                <TableRow key={page.id}>
                  <TableCell>
                    <RouterLink
                      href={`/spaces/${space_id}/${website_id}/pages/${page.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <FileText
                        size="16"
                        aria-hidden="true"
                        className="shrink-0 text-muted-foreground"
                      />
                      <span>{page.url}</span>
                    </RouterLink>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(page.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <PageDeleteDialog
                      page={page}
                      space_id={space_id}
                      website_id={website_id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">No pages found</h3>
          <p className="text-sm text-muted-foreground">
            {filter
              ? 'Try adjusting your search'
              : 'Add your first page to get started'}
          </p>
        </div>
      )}
    </div>
  )
}
