import { useActorRef } from "@xstate/react"
import { createContext, useContext, type ReactNode } from "react"
import type { ActorRef, SnapshotFrom } from "xstate"

import { pageMachine, type PageEvent } from "./page-machine"

type PageActor = ActorRef<SnapshotFrom<typeof pageMachine>, PageEvent>

const PageContext = createContext<PageActor | undefined>(undefined)

export function PageProvider({ children }: { children: ReactNode }) {
  const actorRef = useActorRef(pageMachine)

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
