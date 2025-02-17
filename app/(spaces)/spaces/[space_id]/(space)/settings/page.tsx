import { PageHeader } from "@/features/domain/components/page-header"
import { SpaceDelete } from "@/features/space/components/space-delete"
import { SpaceUpdate } from "@/features/space/components/space-update"

import { SettingsContent } from "./settings-content"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsContent />
    </div>
  )
}
