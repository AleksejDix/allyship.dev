import { notFound } from "next/navigation"
import { SpaceNavigation } from "@/features/spaces/components/space-navigation"
import { getUserSpace } from "@/features/userSpace/actions"
import { UserSpaceProvider } from "@/features/userSpace/components/user-space-provider"

interface LayoutProps {
  children: React.ReactNode
  params: {
    space_id: string
  }
}

export default async function Layout({ children, params }: LayoutProps) {
  const { data } = await getUserSpace(params.space_id)
  if (!data) notFound()

  return (
    <UserSpaceProvider space={data}>
      <SpaceNavigation space_id={params.space_id} />
      {children}
    </UserSpaceProvider>
  )
}
