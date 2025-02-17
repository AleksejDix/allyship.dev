import Link from "next/link"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export async function SpaceIndex({ spaces }: { spaces: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {spaces.map((space) => (
        <Link href={`/spaces/${space.id}`} key={space.id}>
          <Card className="h-full transition-colors hover:bg-muted/50 overflow-hidden">
            <CardHeader>
              <CardTitle>
                <h2>{space.name}</h2>

                <pre>{JSON.stringify(space, null, 2)}</pre>
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
