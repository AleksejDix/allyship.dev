import Link from "next/link"
import type { Space } from "@prisma/client"

import { Card, CardHeader } from "@/components/ui/card"

export function SpaceIndex({ spaces }: { spaces: Space[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {spaces.map((space) => (
        <Card key={space.id}>
          <CardHeader>
            <Link href={`/spaces/${space.id}`}>{space.name}</Link>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
