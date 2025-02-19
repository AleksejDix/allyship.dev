import { Suspense } from "react"
import { WebsitesNavigation } from "@/features/websites/components/website-navigation"

type LayoutProps = {
  params: Promise<{ website_id: string; space_id: string; page_id?: string }>
  children: React.ReactNode
}

export default async function Layout(props: LayoutProps) {
  const params = await props.params;

  const {
    children
  } = props;

  const { website_id, space_id } = params

  return (
    <div>
      <WebsitesNavigation space_id={space_id} website_id={website_id} />
      <Suspense fallback={<div className="container">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  )
}
