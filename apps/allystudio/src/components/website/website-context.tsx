import { type NormalizedUrl } from "@/utils/url"
import { useActorRef } from "@xstate/react"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode
} from "react"

import { WebsiteHostnameWatcher } from "./website-hostname-watcher"
import { websiteMachine } from "./website-machine"
import type { WebsiteMachineActorRef } from "./website-machine"

const WebsiteContext = createContext<WebsiteMachineActorRef | undefined>(
  undefined
)

export function WebsiteProvider({
  children,
  spaceId,
  normalizedUrl
}: {
  children: ReactNode
  spaceId: string
  normalizedUrl: NormalizedUrl | null
}) {
  const actorRef = useActorRef(websiteMachine, {
    input: {
      spaceId,
      normalizedUrl
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
      <WebsiteHostnameWatcher />
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
