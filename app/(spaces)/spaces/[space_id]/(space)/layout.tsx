import { SpaceNavigation } from "@/features/spaces/components/space-navigation"

interface LayoutProps {
  children: React.ReactNode
  params: {
    space_id: string
  }
}

export default async function Layout({ children, params }: LayoutProps) {
  const { space_id } = await params

  return (
    <>
      <SpaceNavigation space_id={space_id} />
      {children}
    </>
  )
}
