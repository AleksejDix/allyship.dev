import { Suspense } from "react"
import { getSpaces } from "@/features/space/actions"
import { SpaceCreate } from "@/features/space/components/space-create"
import { SpaceIndex } from "@/features/space/components/space-index"

export default async function Page() {
  const { spaces } = await getSpaces()

  return (
    <>
      <div className="container mx-auto py-12">
        <Suspense fallback={<div>Loading spaces...</div>}>
          <SpaceCreate />
          <SpaceIndex spaces={spaces} />
        </Suspense>
      </div>
    </>
  )
}
