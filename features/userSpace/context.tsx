"use client"

import { createContext, useContext } from "react"
import type { Tables } from "@/database.types"

type UserSpaceContextValue = {
  // The user's view of the space
  space: Tables<"UserSpaceView">
  // Computed permissions and helper functions
  permissions: {
    isOwner: boolean
    isAdmin: boolean
    isMember: boolean
    canEdit: boolean
    canDelete: boolean
    canInvite: boolean
  }
  // Space status
  status: {
    isActive: boolean
    isPending: boolean
    isInactive: boolean
  }
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
  space: Tables<"UserSpaceView">
  children: React.ReactNode
}

export function Provider({ space, children }: UserSpaceProviderProps) {
  // Compute permissions based on user role
  const permissions = {
    isOwner: space.user_role === "owner",
    isAdmin: space.user_role === "admin" || space.user_role === "owner",
    isMember: space.user_role !== null,
    canEdit: ["owner", "admin"].includes(space.user_role ?? ""),
    canDelete: space.user_role === "owner",
    canInvite: ["owner", "admin"].includes(space.user_role ?? ""),
  }

  // Compute status flags
  const status = {
    isActive: space.membership_status === "active",
    isPending: space.membership_status === "pending",
    isInactive: space.membership_status === "inactive",
  }

  return (
    <UserSpaceContext.Provider
      value={{
        space,
        permissions,
        status,
      }}
    >
      {children}
    </UserSpaceContext.Provider>
  )
}
