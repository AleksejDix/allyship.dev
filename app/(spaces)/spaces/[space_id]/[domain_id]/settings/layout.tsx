import { DomainNavigation } from "@/features/domain/components/domain-navigation"
import { PageHeader } from "@/features/domain/components/page-header"

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type LayoutProps = {
  children: React.ReactNode
  params: { space_id: string; domain_id: string }
}

export default async function Layout({ children, params }: LayoutProps) {
  const { space_id, domain_id } = await params

  const domain = await prisma.domain.findUnique({
    where: {
      id: domain_id,
    },
  })

  if (!domain) {
    throw new Error("Domain not found")
  }

  return (
    <>
      <DomainNavigation
        domain={domain}
        space_id={space_id}
        domain_id={domain_id}
      />

      <PageHeader
        title="Settings"
        description={`Manage settings and configuration for ${domain.name}`}
      />

      <div className="container  py-6">
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
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}
