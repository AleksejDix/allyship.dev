import { useActorRef } from "@xstate/react"
import { createContext, useContext, type ReactNode } from "react"
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
