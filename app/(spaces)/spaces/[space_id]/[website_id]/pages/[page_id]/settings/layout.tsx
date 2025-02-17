import { PageNavigation } from "@/features/pages/components/page-navigation"
import { PageHeader } from "@/features/websites/components/page-header"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type LayoutProps = {
  params: { website_id: string; space_id: string; page_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { website_id, space_id, page_id } = params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from("Page")
    .select(
      `
      *,
      domain:Domain (*)
    `
    )
    .eq("id", page_id)
    .single()

  if (!page) {
    return null
  }

  return (
    <>
      <PageNavigation
        space_id={space_id}
        website_id={website_id}
        page_id={page_id}
      />

      <PageHeader
        title="Settings"
        description={`Manage settings and configuration for ${page.name}`}
      />

      <div className="container py-6">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
              <Button variant="ghost" className="justify-start" asChild>
                <RouterLink
                  exact={true}
                  href={`/spaces/${space_id}/${website_id}/pages/${page_id}/settings`}
                >
                  <span>General</span>
                </RouterLink>
              </Button>
            </nav>
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}
