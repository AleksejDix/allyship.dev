import { Page } from "@prisma/client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RouterLink } from "@/components/RouterLink"

type PagesIndexProps = {
  page_id: string
  pages: Page[]
}

export function PagesIndex({ page_id, pages }: PagesIndexProps) {
  return (
    <div className="rounded border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pages</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>
                <RouterLink href={`/spaces/${page_id}/pages/${page.id}`}>
                  View: {page.id}
                </RouterLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
