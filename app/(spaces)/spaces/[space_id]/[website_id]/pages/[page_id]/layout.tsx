import { PagesNavigation } from "@/features/pages/components/pages-navigation"

type Props = {
  params: { website_id: string; space_id: string; page_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: Props) {
  const { website_id, space_id, page_id } = await params

  return (
    <>
      <PagesNavigation
        space_id={space_id}
        website_id={website_id}
        page_id={page_id}
      />
      {children}
    </>
  )
}
