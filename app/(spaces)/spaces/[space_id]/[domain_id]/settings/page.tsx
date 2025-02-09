import { RouterLink } from "@/components/RouterLink"

type Props = {
  params: { space_id: string; domain_id: string }
}

export default async function SettingsPage({ params }: Props) {
  const { space_id, domain_id } = await params

  return (
    <>
      <div className="py-6">
        <h1>Settings</h1>
      </div>
      <div>
        <nav>
          <span className="sr-only">Settings</span>
          <RouterLink
            className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white justify-start"
            href={`/spaces/${space_id}/${domain_id}/settings/`}
          >
            General
          </RouterLink>
        </nav>
      </div>
    </>
  )
}
