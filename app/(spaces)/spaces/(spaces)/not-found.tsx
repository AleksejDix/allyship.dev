import { CreateSpaceDialog } from "@/features/space/components/create-space-dialog"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">
        No Workspaces Found
      </h2>
      <p className="mt-2 text-muted-foreground">
        You don't have any workspaces yet. Create your first one to get started.
      </p>
      <div className="mt-4">
        <CreateSpaceDialog />
      </div>
    </div>
  )
}
