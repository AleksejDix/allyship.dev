import { useSelector } from "@xstate/react"
import { memo } from "react"

import { useWebsiteContext } from "./website-context"

// Use memo to prevent unnecessary re-renders
export const WebsiteDebug = memo(function WebsiteDebug() {
  // Only show debug info in development mode
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const actor = useWebsiteContext()
  const state = useSelector(actor, (state) => state.value)
  const context = useSelector(actor, (state) => state.context)

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 bg-black/80 text-white text-xs font-mono max-w-xs overflow-auto max-h-64 rounded-tl-lg">
      <div className="mb-2">
        <strong>State:</strong> {JSON.stringify(state)}
      </div>
      <div>
        <strong>Context:</strong>
        <pre>{JSON.stringify(context, null, 2)}</pre>
      </div>
    </div>
  )
})
