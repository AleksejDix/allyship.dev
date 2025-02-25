import { useActorRef } from "@xstate/react"
import { createContext, useContext, type ReactNode } from "react"
import type { ActorRef, SnapshotFrom } from "xstate"

import { spaceMachine, type SpaceEvent } from "./space-machine"

type SpaceActor = ActorRef<SnapshotFrom<typeof spaceMachine>, SpaceEvent>

const SpaceContext = createContext<SpaceActor | undefined>(undefined)

export function SpaceProvider({ children }: { children: ReactNode }) {
  const actorRef = useActorRef(spaceMachine)

  return (
    <SpaceContext.Provider value={actorRef}>{children}</SpaceContext.Provider>
  )
}

export function useSpaceContext() {
  const context = useContext(SpaceContext)
  if (!context) {
    throw new Error("useSpaceContext must be used within a <SpaceProvider>")
  }
  return context
}

export function useMaybeSpaceContext() {
  const context = useContext(SpaceContext)
  if (!context) {
    return null
  }
  return context
}
