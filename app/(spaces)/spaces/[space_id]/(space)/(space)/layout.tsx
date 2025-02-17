import { notFound } from "next/navigation"
import { getSpace } from "@/features/spaces/actions"
import { SpaceNavigation } from "@/features/spaces/components/space-navigation"

interface LayoutProps {
  children: React.ReactNode
  params: {
    space_id: string
  }
}

export default async function Layout({ children, params }: LayoutProps) {
  const { data } = await getSpace(params.space_id)
  if (!data) notFound()

  return (
    <>
      <SpaceNavigation space_id={params.space_id} />
      {children}
    </>
  )
}
