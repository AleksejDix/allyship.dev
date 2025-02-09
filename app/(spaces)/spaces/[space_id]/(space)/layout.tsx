import { RouterLink } from "@/components/RouterLink"

type LayoutProps = {
  params: { space_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { space_id } = await params

  return (
    <div className="container">
      <nav>
        <ul className="flex -mx-2">
          <li>
            <RouterLink className="inline-block p-2" href={`/${space_id}`}>
              Domains
            </RouterLink>
          </li>
          <li>
            <RouterLink
              className="inline-block p-2"
              href={`/${space_id}/members`}
            >
              Members
            </RouterLink>
          </li>
          <li>
            <RouterLink
              className="inline-block p-2"
              href={`/${space_id}/settings`}
            >
              Settings
            </RouterLink>
          </li>
        </ul>
      </nav>

      {children}
    </div>
  )
}
