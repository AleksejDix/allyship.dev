"use client"

import { supabase } from "@/core/supabase"
import { type Session } from "@supabase/supabase-js"
import logo from "data-base64:~assets/logo.png"
import { LogOut as LogOutIcon, Settings as SettingsIcon } from "lucide-react"

import { ThemeToggle } from "./theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu"

interface HeaderProps {
  session: Session
}

export function Header({ session }: HeaderProps) {
  const userInitials = session.user.email
    ?.split("@")[0]
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="border-b">
      <div className="container flex justify-between h-14 px-4 items-center">
        <div className="flex items-center gap-2 bg-black rounded-full p-1">
          <img src={logo} alt="Ally Studio" width={32} height={32} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="sr-only">
                  {session.user.user_metadata.name}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session.user.user_metadata.avatar_url}
                    alt={session.user.email || ""}
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => chrome.runtime.openOptionsPage()}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => supabase.auth.signOut()}
                className="text-red-600 dark:text-red-400">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
