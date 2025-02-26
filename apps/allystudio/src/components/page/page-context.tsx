import { useActorRef } from "@xstate/react"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode
} from "react"
import type { ActorRef, SnapshotFrom } from "xstate"

import { pageMachine } from "./page-machine"
import type { PageMachineActorRef } from "./page-machine"

const PageContext = createContext<PageMachineActorRef | undefined>(undefined)

export function PageProvider({
  children,
  websiteId
}: {
  children: ReactNode
  websiteId: string | null
}) {
  const actorRef = useActorRef(pageMachine, {
    input: {
      websiteId
    }
  })

  const previousWebsiteIdRef = useRef<string | null>(websiteId)

  // Send WEBSITE_CHANGED event when websiteId changes
  useEffect(() => {
    // Only send the event if the website ID has actually changed and is not null
    if (previousWebsiteIdRef.current !== websiteId && websiteId !== null) {
      console.log(
        "Website changed, sending WEBSITE_CHANGED event with ID:",
        websiteId
      )
      actorRef.send({ type: "WEBSITE_CHANGED", websiteId })
      previousWebsiteIdRef.current = websiteId
    }
  }, [websiteId, actorRef])

  return (
    <PageContext.Provider value={actorRef}>{children}</PageContext.Provider>
  )
}

export function usePageContext() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error("usePageContext must be used within a <PageProvider>")
  }
  return context
}

export function useMaybePageContext() {
  const context = useContext(PageContext)
  if (!context) {
    return null
  }
  return context
}
