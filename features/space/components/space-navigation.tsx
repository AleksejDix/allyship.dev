import { Space } from "@prisma/client"
import { HomeIcon, UsersIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { RouterLink } from "@/components/RouterLink"

const items = (id: string) => [
  {
    title: "Space",
    url: `/spaces/${id}`,
    icon: HomeIcon,
  },
  {
    title: "Members",
    url: `/spaces/${id}/members`,
    icon: UsersIcon,
  },
  {
    title: "Domains",
    url: `/spaces/${id}/domains`,
    icon: UsersIcon,
  },
]

type SpaceNavigationProps = {
  activeSpace: Space
}

export function SpaceNavigation({ activeSpace }: SpaceNavigationProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items(activeSpace.id).map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <RouterLink href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
