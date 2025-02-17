"use client"

// import { SpaceDelete } from "@/features/space/components/space-delete"
import { SpaceUpdate } from "@/features/space/components/space-update"
import { useUserSpace } from "@/features/userSpace/context"

export function SettingsContent() {
  const { space, permissions } = useUserSpace()

  return (
    <div className="container">
      <div className="space-y-8">
        {permissions.canEdit && <SpaceUpdate space={space} />}

        {permissions.canDelete && (
          <div>
            <h3 className="text-lg font-medium text-destructive">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete this workspace and all of its data.
            </p>
            <div className="mt-4">
              {/* <SpaceDelete id={space.id} name={space.name} /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
