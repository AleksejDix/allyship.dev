"use client"

import Link from "next/link"
import { signOut } from "@/features/user/actions/user-actions"
import { User } from "@supabase/supabase-js"
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

type UserNavProps = {
  user: User
}

export function UserNav(props: UserNavProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={props.user.user_metadata.avatar_url}
                  alt={props.user.user_metadata.full_name ?? ""}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {props.user.user_metadata.full_name}
                </span>
                <span className="truncate text-xs">{props.user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={props.user.user_metadata.avatar_url}
                    alt={props.user.user_metadata.full_name ?? ""}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {props.user.user_metadata.full_name}
                  </span>
                  <span className="truncate text-xs">{props.user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* <DropdownMenuItem asChild>
              <Link href="/account" className="w-full">
                <Sparkles />
                Upgrade to Pro
              </Link>
            </DropdownMenuItem> */}

            <DropdownMenuItem asChild>
              <Link href="/account" className="w-full">
                <BadgeCheck />
                Account
              </Link>
            </DropdownMenuItem>

            {/* <DropdownMenuItem>
              <CreditCard />
              Payments
            </DropdownMenuItem> */}

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form>
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  variant="ghost"
                  formAction={signOut}
                >
                  <LogOut />
                  Log out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
