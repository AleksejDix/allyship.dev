import { useSpaceContext } from "@/components/space/space-context"
import { useSelector } from "@xstate/react"
import { memo } from "react"
import type { PropsWithChildren } from "react"

// Use memo to prevent unnecessary re-renders of the entire component
export const SpaceSelected = memo(function SpaceSelected({
  children
}: PropsWithChildren) {
  const actor = useSpaceContext()

  // Use memoized selectors for better performance with Object.is comparison
  const selection = useSelector(
    actor,
    (state) => state.context.currentSpace,
    Object.is
  )

  const shouldRender = useSelector(
    actor,
    (state) => state.matches({ loaded: "selected" }),
    Object.is
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
})
