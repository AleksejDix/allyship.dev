import { Button } from "@/components/ui/button"
import { useSelector } from "@xstate/react"
import { Plus } from "lucide-react"

import { usePageContext } from "./page-context"

// Component that displays when no pages are found
export function PageListEmpty() {
  const actor = usePageContext()
  const isSuccess = useSelector(actor, (state) => state.matches("success"))
  const hasPages = useSelector(actor, (state) => state.context.pages.length > 0)

  // Only show when in success state and there are no pages
  if (!isSuccess || hasPages) {
    return null
  }

  return (
    <div className="text-center p-8 border border-dashed rounded-lg">
      <h3 className="font-medium mb-2">No pages found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        There are no pages associated with this website yet.
      </p>
      <Button variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
        Add Page
      </Button>
    </div>
  )
}
