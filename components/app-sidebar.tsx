import * as React from "react"
import { getSpaces } from "@/features/space/actions"
import { SpaceNavigation } from "@/features/space/components/space-navigation"
import { SpaceSwitcher } from "@/features/space/components/space-switcher"
import { UserNav } from "@/features/user/components/user-nav"

import { createClient } from "@/lib/supabase/server"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

type AppSidebarProps = {
  activeSpaceId: string
} & React.ComponentProps<typeof Sidebar>

export async function AppSidebar({ activeSpaceId, ...props }: AppSidebarProps) {
  const supabase = await createClient()

  const { spaces } = await getSpaces()
  const { data } = await supabase.auth.getUser()

  const activeSpace = spaces.find((space) => space.id === activeSpaceId)

  if (!data.user) {
    return null
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SpaceSwitcher spaces={spaces} activeSpace={activeSpace!} />
      </SidebarHeader>
      <SidebarContent>
        <SpaceNavigation activeSpace={activeSpace!} />
      </SidebarContent>
      <SidebarFooter>
        <UserNav user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
