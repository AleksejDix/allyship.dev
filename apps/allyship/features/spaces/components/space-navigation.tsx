import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type Props = {
  space_id: string
}

export function SpaceNavigation({ space_id }: Props) {
  return (
    <nav className="border-b border-border">
      <div className="container">
        <ul className="flex items-center gap-1 py-2">
          <li>
            <Button variant="ghost" asChild>
              <RouterLink exact={true} href={`/spaces/`}>
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">Spaces</span>
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink exact={true} href={`/spaces/${space_id}`}>
                Space
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink href={`/spaces/${space_id}/websites`}>
                Websites
              </RouterLink>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <RouterLink href={`/spaces/${space_id}/settings`}>
                Settings
              </RouterLink>
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
