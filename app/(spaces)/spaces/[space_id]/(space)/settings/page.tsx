import { getSpace } from "@/features/spaces/actions"
import { SpaceDelete } from "@/features/spaces/components/space-delete"
import { SpaceUpdate } from "@/features/spaces/components/space-update"

type Props = {
  params: { space_id: string }
}

export default async function SettingsPage({ params }: Props) {
  const { space_id } = await params
  const { data } = await getSpace(space_id)

  return (
    <div className="space-y-6">
      <SpaceUpdate space={data} />
      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete this workspace and all of its data.
        </p>
        <div className="mt-4">
          <SpaceDelete space={data} />
        </div>
      </div>
    </div>
  )
}
