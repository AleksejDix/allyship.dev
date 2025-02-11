import { SpaceNavigation } from "@/features/spaces/components/space-navigation"

type LayoutProps = {
  params: { space_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { space_id } = await params

  return (
    <>
      <SpaceNavigation space_id={space_id} />
      {children}
    </>
  )
}
