import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector } from "@xstate/react"
import { memo } from "react"

import { useSpaceContext } from "./space-context"

// Use memo to prevent unnecessary re-renders
export const SpaceEmpty = memo(function SpaceEmpty() {
  const actor = useSpaceContext()

  // Use memoized selector with Object.is comparison for better performance
  const shouldRender = useSelector(
    actor,
    (state) => state.matches("empty"),
    Object.is
  )

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
})
