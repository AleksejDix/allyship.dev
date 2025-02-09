import { Suspense } from "react"
import { getSpaces } from "@/features/space/actions"
import { SpaceCreate } from "@/features/space/components/space-create"
import { SpaceIndex } from "@/features/space/components/space-index"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default async function Page() {
  const { spaces } = await getSpaces()

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="text-2xl font-bold">Spaces</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Space</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Space</DialogTitle>
              <DialogDescription>
                Create a new space to manage your websites and track their
                accessibility.
              </DialogDescription>
            </DialogHeader>
            <Suspense fallback={<div>Loading...</div>}>
              <SpaceCreate />
            </Suspense>
          </DialogContent>
        </Dialog>
      </div>
      <SpaceIndex spaces={spaces} />
    </div>
  )
}
