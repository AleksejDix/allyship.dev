import { useActorRef } from "@xstate/react"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode
} from "react"
import type { ActorRef, SnapshotFrom } from "xstate"

import { websiteMachine } from "./website-machine"
import type { WebsiteMachineActorRef } from "./website-machine"

const WebsiteContext = createContext<WebsiteMachineActorRef | undefined>(
  undefined
)

export function WebsiteProvider({
  children,
  spaceId
}: {
  children: ReactNode
  spaceId: string
}) {
  const actorRef = useActorRef(websiteMachine, {
    input: {
      spaceId
    }
  })

  const previousSpaceIdRef = useRef<string>(spaceId)

  // Send SPACE_CHANGED event when spaceId changes
  useEffect(() => {
    // Only send the event if the space ID has actually changed
    if (previousSpaceIdRef.current !== spaceId) {
      console.log(
        "Space changed, sending SPACE_CHANGED event with ID:",
        spaceId
      )
      actorRef.send({ type: "SPACE_CHANGED", spaceId })
      previousSpaceIdRef.current = spaceId
    }
  }, [spaceId, actorRef])

  return (
    <WebsiteContext.Provider value={actorRef}>
      {children}
    </WebsiteContext.Provider>
  )
}

export function useWebsiteContext() {
  const context = useContext(WebsiteContext)
  if (!context) {
    throw new Error("useWebsiteContext must be used within a <WebsiteProvider>")
  }
  return context
}

export function useMaybeWebsiteContext() {
  const context = useContext(WebsiteContext)
  if (!context) {
    return null
  }
  return context
}
