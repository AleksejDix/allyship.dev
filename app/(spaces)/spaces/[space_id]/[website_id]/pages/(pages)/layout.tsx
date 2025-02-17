import { Suspense } from "react"
import { WebsitesNavigation } from "@/features/websites/components/website-navigation"

type LayoutProps = {
  params: { website_id: string; space_id: string; page_id?: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { website_id, space_id } = params

  return (
    <div>
      <WebsitesNavigation space_id={space_id} website_id={website_id} />
      <Suspense fallback={<div className="mt-6">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  )
}
