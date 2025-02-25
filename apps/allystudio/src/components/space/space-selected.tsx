import { useSpaceContext } from "@/components/space/space-context"
import { useSelector } from "@xstate/react"
import type { PropsWithChildren } from "react"

export function SpaceSelected({ children }: PropsWithChildren) {
  const actor = useSpaceContext()
  const selection = useSelector(actor, (state) => state.context.currentSpace)
  const shouldRender = useSelector(actor, (state) =>
    state.matches({ loaded: "selected" })
  )

  // Only render when in the loaded.selected state
  if (!shouldRender) {
    return null
  }

  return (
    <>
      {selection?.name}
      {children}
    </>
  )
}
