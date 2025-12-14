import { CreateSpaceDialog } from "@/features/spaces/components/CreateSpaceDialog"
import { PageHeader } from "@/features/websites/components/page-header"

interface SpacesLayoutProps {
  children: React.ReactNode
}

export default function SpacesLayout({ children }: SpacesLayoutProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Workspaces"
        description="Manage your personal and team workspaces."
      >
        <CreateSpaceDialog />
      </PageHeader>

      {children}
    </div>
  )
}
