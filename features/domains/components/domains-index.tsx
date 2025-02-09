import Link from "next/link"
import { Domain } from "@prisma/client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DomainsIndexProps = {
  spaceId: string
  domains: Domain[]
}

export function DomainsIndex({ spaceId, domains }: DomainsIndexProps) {
  return (
    <div className="rounded border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {domains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell>
                <Link
                  className="block"
                  href={`/spaces/${spaceId}/${domain.id}`}
                >
                  {domain.name}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
