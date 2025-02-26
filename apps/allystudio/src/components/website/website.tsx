import { useSelector } from "@xstate/react"
import { memo } from "react"
import type { PropsWithChildren } from "react"

import { useSpaceContext } from "../space/space-context"
import { WebsiteAdd } from "./website-add"
import { WebsiteProvider } from "./website-context"
import { WebsiteDebug } from "./website-debug"
import { WebsiteEmpty } from "./website-empty"
import { WebsiteOptions } from "./website-options"
import { WebsiteSelected } from "./website-selected"

// Root component that sets up the machine and provider
// Use memo to prevent unnecessary re-renders
const Website = memo(function Website({
  children,
  debug = false
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
      {/* <WebsiteAdd /> */}
      <WebsiteEmpty />
      <WebsiteOptions />
      <WebsiteSelected>{children}</WebsiteSelected>
      {debug && <WebsiteDebug />}
    </WebsiteProvider>
  )
})

// Named exports for composite components
export { Website, WebsiteEmpty, WebsiteOptions, WebsiteDebug }
