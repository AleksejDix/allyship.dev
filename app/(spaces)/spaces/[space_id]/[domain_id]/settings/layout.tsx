import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type LayoutProps = {
  children: React.ReactNode
  params: { space_id: string; domain_id: string }
}

export default async function Layout({ children, params }: LayoutProps) {
  const { space_id, domain_id } = await params

  return (
    <div className="container">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your domain settings and configuration
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
              <Button variant="ghost" className="justify-start" asChild>
                <RouterLink
                  exact={true}
                  href={`/spaces/${space_id}/${domain_id}/settings`}
                >
                  <span>General</span>
                </RouterLink>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <RouterLink
                  href={`/spaces/${space_id}/${domain_id}/settings/advanced`}
                >
                  <span>Advanced</span>
                </RouterLink>
              </Button>
            </nav>
          </aside>
          <div className="flex-1 ">{children}</div>
        </div>
      </div>
    </div>
  )
}
