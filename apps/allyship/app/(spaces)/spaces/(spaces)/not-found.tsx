import { CreateSpaceDialog as SpaceCreateDialog } from "@/features/spaces/components/CreateSpaceDialog"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">
        No Workspaces Found
      </h2>
      <p className="mt-2 text-muted-foreground">
        You don&apos;t have any workspaces yet. Create your first one to get
        started.
      </p>
      <div className="mt-4">
        <SpaceCreateDialog />
      </div>
    </div>
  )
}
