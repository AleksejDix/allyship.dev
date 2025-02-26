import { useActor } from "@xstate/react"
import { createContext, useContext } from "react"
import { createActor } from "xstate"

import { pageMachine, type PageMachineActorRef } from "./page-machine"

const PageContext = createContext<PageMachineActorRef | null>(null)

export function PageProvider({
  children,
  websiteId
}: {
  children: React.ReactNode
  websiteId: string | null
}) {
  const pageActor = createActor(pageMachine, {
    input: { websiteId }
  })
  pageActor.start()

  return (
    <PageContext.Provider value={pageActor}>{children}</PageContext.Provider>
  )
}

export function usePageContext() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider")
  }
  return context
}

export function useMaybePageContext() {
  const context = useContext(PageContext)
  return context
}
