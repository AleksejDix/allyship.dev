import Link from 'next/link'
import { Tables } from '@/apps/AllyShip/database.types'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface SpaceIndexProps {
  spaces: Tables<'Space'>[]
}

export async function SpaceIndex({ spaces }: SpaceIndexProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Existing Spaces */}
        {spaces.map(space => (
          <Link href={`/spaces/${space.id}`} key={space.id}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="line-clamp-1">{space.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {spaces.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No spaces yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first space to get started
          </p>
          <Button asChild>
            <Link href="/spaces/new">Create Space</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
