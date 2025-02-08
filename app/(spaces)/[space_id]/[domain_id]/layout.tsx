import { RouterLink } from "@/components/RouterLink"

type LayoutProps = {
  params: { domain_id: string; space_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { domain_id, space_id } = await params

  return (
    <div className="container">
      <nav>
        <ul className="flex -mx-2">
          <li>
            <RouterLink
              className="inline-block p-2"
              href={`/${space_id}/${domain_id}`}
            >
              Pages
            </RouterLink>
          </li>
          <li>
            <RouterLink
              className="inline-block p-2"
              href={`/${space_id}/${domain_id}/audits`}
            >
              Audits
            </RouterLink>
          </li>
          <li>
            <RouterLink
              className="inline-block p-2"
              href={`/${space_id}/${domain_id}/settings`}
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
