import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector } from "@xstate/react"

import { useSpaceContext } from "./space-context"

export function SpaceEmpty() {
  const actor = useSpaceContext()
  const shouldRender = useSelector(actor, (state) => state.matches("empty"))

  // Only render when in the empty state
  if (!shouldRender) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>No spaces found</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
