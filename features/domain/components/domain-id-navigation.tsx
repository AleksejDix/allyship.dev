import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type Props = {
  domain_id: string
  space_id: string
}

export function DomainIdNavigation({ space_id, domain_id }: Props) {
  return (
    <nav className="border-b border-border">
      <div className="container">
        <ul className="flex items-center gap-1 py-2">
          <li>
            <Button variant="ghost" asChild>
              <RouterLink exact={true} href={`/spaces/${space_id}`}>
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">Domain</span>
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink
                exact={true}
                href={`/spaces/${space_id}/${domain_id}`}
              >
                <span>Domain</span>
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
