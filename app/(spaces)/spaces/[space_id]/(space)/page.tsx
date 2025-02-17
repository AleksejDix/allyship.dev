import { PageHeader } from "@/features/domain/components/page-header"
import { SpaceDetails } from "@/features/space/components/space-details"

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Space Details"
        description="Manage your workspace settings and access controls."
      />
      <SpaceDetails />
    </div>
  )
}
