import Link from "next/link"
import type { Space } from "@prisma/client"

import { Card, CardHeader } from "@/components/ui/card"

export function SpaceIndex({ spaces }: { spaces: Space[] }) {
  return (
    <div className="grid gap-4 mt-8">
      {spaces.map((space) => (
        <Card key={space.id} className="transition-colors hover:bg-accent">
          <CardHeader>
            <Link
              href={`/${space.id}`}
              className="text-lg font-medium transition-colors hover:text-muted-foreground"
            >
              {space.name}
            </Link>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
