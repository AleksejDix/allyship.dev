import { PageHeader } from "@/features/domain/components/page-header"
import { CreateSpaceDialog } from "@/features/space/components/create-space-dialog"

interface SpacesLayoutProps {
  children: React.ReactNode
}

export default function SpacesLayout({ children }: SpacesLayoutProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Workspaces"
        description="Manage your workspace memberships and access settings."
      >
        <CreateSpaceDialog />
      </PageHeader>

      <div className="container">{children}</div>
    </div>
  )
}
