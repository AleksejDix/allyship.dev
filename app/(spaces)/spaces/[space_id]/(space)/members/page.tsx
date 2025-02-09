import { MembershipList } from "@/features/membership/components/membership-list"
import { getSpace } from "@/features/space/actions"

type SpacePageProps = {
  params: { space_id: string }
}

export default async function SpaceMembersPage({ params }: SpacePageProps) {
  const { space_id } = await params
  const { space } = await getSpace(space_id)

  if (!space) {
    return <div>Space not found</div>
  }

  return (
    <div>
      <h1>Members</h1>
      <MembershipList />
    </div>
  )
}
