import { SpaceCreateDialog } from "@/features/spaces/components/space-create-dialog"
import { PageHeader } from "@/features/websites/components/page-header"

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
        <SpaceCreateDialog />
      </PageHeader>

      {children}
    </div>
  )
}
