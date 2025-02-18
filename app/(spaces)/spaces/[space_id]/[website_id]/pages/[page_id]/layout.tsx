import { PagesNavigation } from "@/features/pages/components/pages-navigation"

type Props = {
  params: Promise<{ website_id: string; space_id: string; page_id: string }>
  children: React.ReactNode
}

export default async function Layout(props: Props) {
  const params = await props.params
  const { website_id, space_id, page_id } = params

  return (
    <>
      <PagesNavigation
        space_id={space_id}
        website_id={website_id}
        page_id={page_id}
      />
      {props.children}
    </>
  )
}
