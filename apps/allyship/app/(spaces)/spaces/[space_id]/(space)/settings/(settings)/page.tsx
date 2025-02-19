import { notFound } from "next/navigation"
import { getSpace } from "@/features/spaces/actions"
import { SpaceDelete } from "@/features/spaces/components/space-delete"
import { SpaceUpdate } from "@/features/spaces/components/space-update"

type Props = {
  params: Promise<{ space_id: string }>
}

export default async function SettingsPage(props: Props) {
  const params = await props.params;
  const { space_id } = params
  const { data: space } = await getSpace(space_id)

  if (!space) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <SpaceUpdate space={space} />
      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete this workspace and all of its data.
        </p>
        <div className="mt-4">
          <SpaceDelete space={space} />
        </div>
      </div>
    </div>
  )
}
