import { Domain, Page } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RouterLink } from "@/components/RouterLink"

type PageWithDomain = Page & {
  domain: Domain
}

type Props = {
  pages: PageWithDomain[]
  domainId: string
  spaceId: string
}

export function PagesIndex({ pages, domainId, spaceId }: Props) {
  return (
    <div className="container">
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
                  <RouterLink
                    href={`/spaces/${spaceId}/${domainId}/pages/${page.id}`}
                  >
                    <Badge variant="outline">{page.domain.name}</Badge>
                    <Badge variant="outline">{page.name}</Badge>
                  </RouterLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
