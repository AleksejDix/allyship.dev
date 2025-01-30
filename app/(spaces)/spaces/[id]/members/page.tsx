import { MembershipList } from "@/features/membership/components/membership-list"
import { getSpace } from "@/features/space/actions"

type SpacePageProps = {
  params: { id: string }
}

export default async function SpaceMembersPage(props: SpacePageProps) {
  const params = await props.params
  const { space } = await getSpace(params.id)

  if (!space) {
    return <div>Space not found</div>
  }

  return (
    <div>
      Members
      <MembershipList />
    </div>
  )
}
