'use client'

import Link from 'next/link'
import { Globe, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { WebsiteSearch } from './website-search'
import { useState } from 'react'

interface Website {
  id: string
  url: string
  created_at: string
}

interface WebsiteTableProps {
  websites: Website[]
  spaceId: string
}

export function WebsiteTable({ websites, spaceId }: WebsiteTableProps) {
  const [filteredWebsites, setFilteredWebsites] = useState(websites)

  const handleSearch = (query: string) => {
    const filtered = websites.filter(website =>
      website.url.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredWebsites(filtered)
  }

  return (
    <>
      <WebsiteSearch onSearch={handleSearch} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Website URL</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWebsites.map(website => (
              <TableRow key={website.id}>
                <TableCell>
                  <Link
                    href={`/spaces/${spaceId}/${website.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <Globe
                      size="16"
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground"
                    />
                    <span>{website.url}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(website.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink
                        size="16"
                        aria-hidden="true"
                        className="shrink-0"
                      />
                      <span className="sr-only">Visit {website.url}</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
