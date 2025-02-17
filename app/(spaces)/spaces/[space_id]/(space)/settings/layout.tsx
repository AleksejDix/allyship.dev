import { PageHeader } from "@/features/websites/components/page-header"

import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type Props = {
  params: { space_id: string; website_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: Props) {
  const { space_id } = await params

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your workspace settings"
      />
      <div className="container py-6">
        <div className="grid md:grid-cols-4 gap-8">
          <nav className="flex flex-col gap-[2px]">
            <span className="sr-only">Space</span>
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

          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </>
  )
}
