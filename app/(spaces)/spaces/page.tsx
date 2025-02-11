import { PageHeader } from "@/features/domain/components/page-header"
import { getSpaces } from "@/features/space/actions"
import { CreateSpaceDialog } from "@/features/space/components/create-space-dialog"
import { SpaceIndex } from "@/features/space/components/space-index"

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
        <CreateSpaceDialog />
      </PageHeader>

      <div className="container">
        <SpaceIndex spaces={spaces} />
      </div>
    </div>
  )
}
