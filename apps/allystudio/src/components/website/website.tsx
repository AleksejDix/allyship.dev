import { useSelector } from "@xstate/react"
import { memo, useEffect, useRef } from "react"
import type { PropsWithChildren } from "react"

import { useSpaceContext } from "../space/space-context"
import { useWebsiteContext, WebsiteProvider } from "./website-context"
import { WebsiteDebug } from "./website-debug"
import { WebsiteEmpty } from "./website-empty"
import { WebsiteOptions } from "./website-options"
import { WebsiteSelected } from "./website-selected"

// Root component that sets up the machine and provider
// Use memo to prevent unnecessary re-renders
const Website = memo(function Website({
  children,
  debug = process.env.NODE_ENV === "development" // Always show debug in development
}: PropsWithChildren<{ debug?: boolean }>) {
  const spaceActor = useSpaceContext()

  // Get the current space ID from the space context
  const currentSpace = useSelector(
    spaceActor,
    (state) => state.context.currentSpace,
    Object.is
  )

  // Only render when a space is selected
  if (!currentSpace) {
    return null
  }

  return (
    <WebsiteProvider spaceId={currentSpace.id}>
      <WebsiteContent spaceId={currentSpace.id}>{children}</WebsiteContent>
      {debug && <WebsiteDebug />}
    </WebsiteProvider>
  )
})

// Separate component to handle space changes
function WebsiteContent({
  children,
  spaceId
}: PropsWithChildren<{ spaceId: string }>) {
  const websiteActor = useWebsiteContext()
  const previousSpaceIdRef = useRef<string>(spaceId)

  // Send SPACE_CHANGED event when spaceId changes
  useEffect(() => {
    // Only send the event if the space ID has actually changed
    if (previousSpaceIdRef.current !== spaceId) {
      console.log(
        "Space changed, sending SPACE_CHANGED event with ID:",
        spaceId
      )
      websiteActor.send({ type: "SPACE_CHANGED", spaceId })
      previousSpaceIdRef.current = spaceId
    }
  }, [spaceId, websiteActor])

  return (
    <>
      <WebsiteEmpty />
      <WebsiteOptions />
      <WebsiteSelected>{children}</WebsiteSelected>
    </>
  )
}

// Named exports for composite components
export { Website, WebsiteEmpty, WebsiteOptions, WebsiteDebug }
