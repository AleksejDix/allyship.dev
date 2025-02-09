// import { Suspense } from "react"
import { getSpaces } from "@/features/space/actions"
// import { SpaceCreate } from "@/features/space/components/space-create"
import { SpaceIndex } from "@/features/space/components/space-index"

import { Button } from "@/components/ui/button"

export default async function Page() {
  const { spaces } = await getSpaces()

  return (
    <div className="container  mx-auto">
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="text-2xl font-bold">Spaces</h1>
        </div>
        <div>
          <Button>Create Space</Button>
        </div>
      </div>
      {/* <Suspense fallback={<div>Loading spaces...</div>}> */}
      {/* <SpaceCreate />
       */}
      {/* </Suspense> */}
      <SpaceIndex spaces={spaces} />
    </div>
  )
}
