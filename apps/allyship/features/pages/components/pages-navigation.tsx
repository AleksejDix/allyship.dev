import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type Props = {
  page_id: string
  space_id: string
  website_id: string
}

export function PagesNavigation({ page_id, space_id, website_id }: Props) {
  return (
    <nav className="border-b border-border">
      <div className="container">
        <ul className="flex items-center gap-1 py-2">
          <li>
            <Button variant="ghost" asChild>
              <RouterLink
                exact={true}
                href={`/spaces/${space_id}/${website_id}`}
              >
                <ArrowLeft aria-hidden="true" />
                <span className="sr-only">Space</span>
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink
                exact={true}
                href={`/spaces/${space_id}/${website_id}/pages/${page_id}`}
              >
                Page
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink
                href={`/spaces/${space_id}/${website_id}/pages/${page_id}/scans`}
              >
                Scans
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink
                href={`/spaces/${space_id}/${website_id}/pages/${page_id}/settings`}
              >
                Settings
              </RouterLink>
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
