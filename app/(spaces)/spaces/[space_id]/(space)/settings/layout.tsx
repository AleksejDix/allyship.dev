import { PageHeader } from "@/features/websites/components/page-header"

import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type Props = {
  params: Promise<{ space_id: string }>
  children: React.ReactNode
}

export default async function Layout(props: Props) {
  const params = await props.params
  const { space_id } = params

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
          </nav>

          <div className="md:col-span-3">{props.children}</div>
        </div>
      </div>
    </>
  )
}
