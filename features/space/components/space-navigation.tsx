import { space } from "@prisma/client"
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
]

export function SpaceNavigation({ activeSpace }: { activeSpace: space }) {
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
