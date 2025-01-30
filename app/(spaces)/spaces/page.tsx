import { Suspense } from "react"
import Link from "next/link"
import { getSpaces } from "@/features/space/actions"
import { SpaceCreate } from "@/features/space/components/space-create"

import { Card, CardHeader } from "@/components/ui/card"
import { Header } from "@/components/site/Header"

// Create a separate component for the spaces list
async function SpacesList() {
  const { spaces } = await getSpaces()
  return (
    <div className="grid gap-4 mt-8">
      {spaces.map((space) => (
        <Card key={space.id} className="transition-colors hover:bg-accent">
          <CardHeader>
            <Link
              href={`/spaces/${space.id}`}
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

export default function SpacePage() {
  return (
    <>
      <Header></Header>
      <div className="container mx-auto py-12">
        <Suspense fallback={<div>Loading spaces...</div>}>
          <SpaceCreate />
          <SpacesList />
        </Suspense>
      </div>
    </>
  )
}
