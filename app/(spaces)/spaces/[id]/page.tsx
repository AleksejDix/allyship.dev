import { getSpace } from "@/features/space/actions"

// import { SpaceDelete } from "@/features/space/components/space-delete"
// import { SpaceUpdate } from "@/features/space/components/space-update"

type PageProps = {
  params: {
    id: string
  }
}

export default async function SpacePage({ params }: PageProps) {
  const space = await getSpace(params.id)

  if (!space) {
    return <div>Space not found</div>
  }

  return (
    <div>
      {/* <SpaceUpdate space={space} />
      <SpaceDelete space={space} /> */}
    </div>
  )
}
