import { Suspense } from "react"
import { PageHeader } from "@/features/domain/components/page-header"
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
  if (!spaces) {
    return <div>No spaces found</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spaces"
        description="Manage your spaces and their accessibility settings."
      >
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
      </PageHeader>

      <div className="container">
        <SpaceIndex spaces={spaces} />
      </div>
    </div>
  )
}
