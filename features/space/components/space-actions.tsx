"use client"

import { useUserSpace } from "@/features/userSpace/context"

import { Button } from "@/components/ui/button"

export function SpaceActions() {
  const { permissions } = useUserSpace()

  return (
    <div className="space-y-2">
      {permissions.canInvite && (
        <Button variant="outline">Invite Members</Button>
      )}
      {permissions.canDelete && (
        <Button variant="destructive">Delete Space</Button>
      )}
    </div>
  )
}
