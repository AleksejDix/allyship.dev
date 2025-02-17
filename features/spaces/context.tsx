"use client"

import { createContext, useContext } from "react"

import type { SpaceData } from "./actions"

interface SpaceContextValue {
  space: SpaceData
}

const SpaceContext = createContext<SpaceContextValue | undefined>(undefined)

export function useSpace() {
  const context = useContext(SpaceContext)
  if (!context) {
    throw new Error("useSpace must be used within a SpaceProvider")
  }
  return context
}

interface SpaceProviderProps {
  space: SpaceData
  children: React.ReactNode
}

export function SpaceProvider({ space, children }: SpaceProviderProps) {
  return (
    <SpaceContext.Provider value={{ space }}>{children}</SpaceContext.Provider>
  )
}
