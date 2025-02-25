import { Header } from "@/components/header"
import type { PropsWithChildren } from "react"

import { SpaceProvider } from "./space-context"
import { SpaceDebug } from "./space-debug"
import { SpaceOptions } from "./space-options"
import { SpaceOptionsDropdown } from "./space-options-dropdown"
import { SpaceSelected } from "./space-selected"

// Root component that sets up the machine and provider
function Space({
  children,
  debug = false
}: PropsWithChildren<{ debug?: boolean }>) {
  return (
    <SpaceProvider>
      <SpaceOptions></SpaceOptions>
      <SpaceSelected>{children}</SpaceSelected>
      {debug && <SpaceDebug />}
      <Header />
    </SpaceProvider>
  )
}

// Named exports for composite components
export {
  Space,
  // SpaceList,
  // SpaceError,
  SpaceOptions,
  SpaceDebug
}
