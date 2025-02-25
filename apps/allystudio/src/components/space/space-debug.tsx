import { useSelector } from "@xstate/react"

import { useSpaceContext } from "./space-context"

export function SpaceDebug() {
  const actor = useSpaceContext()

  const state = useSelector(actor, (state) => state.value)

  return (
    <div className="fixed border border-red-400 bottom-4 right-4 z-50 rounded-lg bg-card p-2 text-xs">
      <div className="font-medium">Space Machine: {JSON.stringify(state)}</div>
    </div>
  )
}
