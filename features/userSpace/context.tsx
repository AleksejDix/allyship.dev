"use client"

import { createContext, useContext } from "react"
import type { Tables } from "@/database.types"

type UserSpaceContextValue = {
  space: Tables<"Space">
}

const UserSpaceContext = createContext<UserSpaceContextValue | null>(null)

export function useUserSpace() {
  const context = useContext(UserSpaceContext)
  if (!context) {
    throw new Error("useUserSpace must be used within a UserSpaceProvider")
  }
  return context
}

interface UserSpaceProviderProps {
  space: Tables<"Space">
  children: React.ReactNode
}

export function Provider({ space, children }: UserSpaceProviderProps) {
  // In our simplified schema, permissions are based on space ownership

  return (
    <UserSpaceContext.Provider
      value={{
        space,
      }}
    >
      {children}
    </UserSpaceContext.Provider>
  )
}
