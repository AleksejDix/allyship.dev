import { getSpace } from "@/features/space/actions"
import { SpaceDelete } from "@/features/space/components/space-delete"
import { SpaceUpdate } from "@/features/space/components/space-update"

type Props = {
  params: { space_id: string }
}

export default async function SettingsPage({ params }: Props) {
  const { space_id } = await params
  const { space } = await getSpace(space_id)

  if (!space) {
    return <div>Space not found</div>
  }

  return (
    <div className="space-y-4">
      <SpaceUpdate space={space} />
      <SpaceDelete space={space} />
    </div>
  )
}
