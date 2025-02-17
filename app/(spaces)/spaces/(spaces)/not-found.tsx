import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">
        No Access to Workspaces
      </h2>
      <p className="mt-2 text-muted-foreground">
        You don't have access to any workspaces yet. Create your first one to
        get started.
      </p>
      <div className="mt-4">
        <Button asChild>
          <Link href="/spaces/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Workspace
          </Link>
        </Button>
      </div>
    </div>
  )
}
