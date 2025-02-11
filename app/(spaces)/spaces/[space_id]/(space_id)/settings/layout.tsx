import { PageHeader } from "@/features/domain/components/page-header"

import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type Props = {
  params: { space_id: string; domain_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: Props) {
  const { space_id } = await params

  return (
    <>
      <PageHeader
        title="Space Settings"
        description="Manage your space settings and configuration."
      />
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <nav className="flex flex-col gap-[2px]">
            <span className="sr-only">Space Settings</span>
            <Button variant="ghost" className="justify-start" asChild>
              <RouterLink exact={true} href={`/spaces/${space_id}/settings/`}>
                General
              </RouterLink>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <RouterLink href={`/spaces/${space_id}/settings/members`}>
                Members
              </RouterLink>
            </Button>
          </nav>

          <main
            tabIndex={0}
            aria-label="General Settings"
            className="md:col-span-3 py-6"
          >
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
