import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type Props = {
  params: { space_id: string; domain_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: Props) {
  const { space_id } = await params

  return (
    <div className="">
      <div className="py-6 container">
        <div>
          <h1 className="text-3xl">Space Settings</h1>
        </div>
      </div>
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
            className="md:col-span-3"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
