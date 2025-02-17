"use client"

import type { Tables } from "@/database.types"

import * as UserSpace from "../context"

type Props = {
  space: Tables<"UserSpaceView">
  children: React.ReactNode
}

export function UserSpaceProvider({ space, children }: Props) {
  return <UserSpace.Provider space={space}>{children}</UserSpace.Provider>
}
