"use client"

import { useUserSpace } from "@/features/userSpace/context"

interface SpaceDetailsWrapperProps {
  children: React.ReactNode
}

export function SpaceDetailsWrapper({ children }: SpaceDetailsWrapperProps) {
  const { space, permissions, status } = useUserSpace()

  return (
    <div className="container">
      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Role</dt>
          <dd className="text-sm capitalize">{space.user_role}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Status</dt>
          <dd className="text-sm capitalize">{space.membership_status}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Owner</dt>
          <dd className="text-sm">
            {space.owner_first_name} {space.owner_last_name}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Domains</dt>
          <dd className="text-sm">{space.domain_count}</dd>
        </div>
      </dl>

      {permissions.canEdit && (
        <div className="mt-6">
          <h2>Admin Settings</h2>
          {children}
        </div>
      )}

      {status.isPending && (
        <div className="mt-6 p-4 bg-yellow-50 text-yellow-700 rounded-md">
          Your membership is pending approval
        </div>
      )}
    </div>
  )
}
