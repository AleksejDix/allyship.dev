import { Header } from "@/components/header"
import { memo } from "react"
import type { PropsWithChildren } from "react"

import { ColorVisionSimulator } from "../color-vision-simulator/color-vision-simulator"
import { DOMMonitorToggle } from "../dom-monitor-toggle"
import { ElementInspector } from "../element-inspector/element-inspector"
import { ElementOutliner } from "../element-outliner/element-outliner"
import { FocusOrderVisualizer } from "../focus-order/focus-order"
import { VisualAcuitySimulator } from "../visual-acuity-simulator/visual-acuity-simulator"
import { SpaceProvider } from "./space-context"
import { SpaceDebug } from "./space-debug"
import { SpaceEmpty } from "./space-empty"
import { SpaceOptions } from "./space-options"
import { SpaceSelected } from "./space-selected"

// Root component that sets up the machine and provider
// Use memo to prevent unnecessary re-renders
const Space = memo(function Space({
  children,
  debug = false
}: PropsWithChildren<{ debug?: boolean }>) {
  return (
    <SpaceProvider>
      <div className="overflow-y-auto h-full">
        <SpaceEmpty />
        <SpaceOptions />
        <SpaceSelected>{children}</SpaceSelected>
        {debug && <SpaceDebug />}
      </div>
      <div>
        <div className="px-2 flex space-x-2">
          <ElementInspector />
          <ElementOutliner />
          <FocusOrderVisualizer />
          <ColorVisionSimulator />
          <VisualAcuitySimulator />
          <DOMMonitorToggle />
        </div>
        <Header />
      </div>
    </SpaceProvider>
  )
})

// Named exports for composite components
export { Space, SpaceEmpty, SpaceOptions, SpaceDebug }
