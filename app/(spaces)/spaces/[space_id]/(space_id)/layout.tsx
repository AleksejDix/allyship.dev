import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type LayoutProps = {
  params: { space_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { space_id } = await params

  return (
    <div className="border-blue-500 border-2">
      <nav className="border-b border-border">
        <div className="container">
          <ul className="flex items-center gap-1 py-2">
            <li>
              <Button variant="ghost" asChild>
                <RouterLink exact={true} href={`/spaces/${space_id}`}>
                  Domains
                </RouterLink>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <RouterLink href={`/spaces/${space_id}/settings`}>
                  Settings
                </RouterLink>
              </Button>
            </li>
          </ul>
        </div>
      </nav>

      <div tabIndex={-1} aria-label="Space Content">
        {children}
      </div>
    </div>
  )
}
