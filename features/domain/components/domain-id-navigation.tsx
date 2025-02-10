import { Domain } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type Props = {
  domain: Domain
  space_id: string
  domain_id: string
}

export function DomainIdNavigation({ domain, space_id, domain_id }: Props) {
  return (
    <nav className="border-b border-border">
      <div className="container">
        <ul className="flex items-center gap-1 py-2">
          <li>
            <Button variant="ghost" asChild>
              <RouterLink
                exact={true}
                href={`/spaces/${space_id}/${domain_id}`}
              >
                {domain?.name}
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink href={`/spaces/${space_id}/${domain_id}/pages`}>
                Pages
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink href={`/spaces/${space_id}/${domain_id}/audits`}>
                Audits
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink href={`/spaces/${space_id}/${domain_id}/settings`}>
                Settings
              </RouterLink>
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
