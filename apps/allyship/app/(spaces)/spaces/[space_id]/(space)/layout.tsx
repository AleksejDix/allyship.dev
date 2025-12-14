import { SpaceNavigation } from "@/features/spaces/components/SpaceNavigation"

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ space_id: string }>
}

export default async function Layout(props: LayoutProps) {
  const params = await props.params
  const { space_id } = params

  return (
    <>
      <SpaceNavigation space_id={space_id} />
      {props.children}
    </>
  )
}
