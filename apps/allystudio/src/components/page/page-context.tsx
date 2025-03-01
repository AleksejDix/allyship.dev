import type { NormalizedUrl } from "@/utils/url"
import { useActorRef, useSelector } from "@xstate/react"
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
import { PagePathWatcher } from "./page-path-watcher"
import { WebsiteWatcher } from "./page-website-watcher"

const PageContext = createContext<PageMachineActorRef | undefined>(undefined)

// Export the provider and hooks
export function PageProvider({
  children,
  websiteId,
  normalizedUrl
}: {
  children: ReactNode
  websiteId: string | null
  normalizedUrl: NormalizedUrl | null
}) {
  const actorRef = useActorRef(pageMachine, {
    input: {
      websiteId,
      normalizedUrl
    }
  })

  return (
    <PageContext.Provider value={actorRef}>
      {websiteId && <WebsiteWatcher websiteId={websiteId} />}
      <PagePathWatcher />
      {children}
    </PageContext.Provider>
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
