import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type LayoutProps = {
  params: { domain_id: string; space_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { domain_id, space_id } = await params

  return (
    <>
      <nav className="border-b border-border">
        <div className="container">
          <ul className="flex items-center gap-1 py-2">
            <li>
              <Button variant="ghost" asChild>
                <RouterLink
                  exact={true}
                  href={`/spaces/${space_id}/${domain_id}`}
                >
                  Domain
                </RouterLink>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <RouterLink href={`/spaces/${space_id}/${domain_id}/pages`}>
                  Pages
                </RouterLink>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <RouterLink href={`/spaces/${space_id}/${domain_id}/audits`}>
                  Audits
                </RouterLink>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <RouterLink href={`/spaces/${space_id}/${domain_id}/settings`}>
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
