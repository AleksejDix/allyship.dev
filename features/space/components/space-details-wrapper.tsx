"use client"

import { useUserSpace } from "@/features/userSpace/context"

interface SpaceDetailsWrapperProps {
  children: React.ReactNode
}

export function SpaceDetailsWrapper({ children }: SpaceDetailsWrapperProps) {
  const { space } = useUserSpace()

  return (
    <div className="container">
      <pre>{JSON.stringify(space)}</pre>
      <div className="mt-6">
        <h2>Admin Settings</h2>
        {children}
      </div>
    </div>
  )
}
