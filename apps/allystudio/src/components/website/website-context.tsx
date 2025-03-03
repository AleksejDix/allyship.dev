import { type NormalizedUrl } from "@/utils/url"
import { useActorRef } from "@xstate/react"
import { createContext, useContext, type ReactNode } from "react"

import { WebsiteHostnameWatcher } from "./website-hostname-watcher"
import { websiteMachine } from "./website-machine"
import type { WebsiteMachineActorRef } from "./website-machine"
import { WebsiteSpaceWatcher } from "./website-space-watcher"

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

  return (
    <WebsiteContext.Provider value={actorRef}>
      {spaceId && <WebsiteSpaceWatcher spaceId={spaceId} />}
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
