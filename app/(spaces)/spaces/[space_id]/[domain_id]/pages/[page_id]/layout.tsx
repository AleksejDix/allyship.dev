import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type LayoutProps = {
  params: { domain_id: string; space_id: string; page_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { domain_id, space_id, page_id } = params

  return (
    <>
      <nav className="border-b border-border">
        <div className="container">
          <ul className="flex items-center gap-1 py-2">
            <li>
              <Button variant="ghost" asChild>
                <RouterLink
                  exact={true}
                  href={`/spaces/${space_id}/${domain_id}/pages/${page_id}`}
                >
                  Overview
                </RouterLink>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <RouterLink
                  href={`/spaces/${space_id}/${domain_id}/pages/${page_id}/scans`}
                >
                  Scans
                </RouterLink>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <RouterLink
                  href={`/spaces/${space_id}/${domain_id}/pages/${page_id}/settings`}
                >
                  Settings
                </RouterLink>
              </Button>
            </li>
          </ul>
        </div>
      </nav>
      {children}
    </>
  )
}
