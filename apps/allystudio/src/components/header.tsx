"use client"

import { supabase } from "@/core/supabase"
import { type Session } from "@supabase/supabase-js"
import logo from "data-base64:~assets/logo.png"
import { LogOut as LogOutIcon } from "lucide-react"

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
    <header>
      <div className="container flex justify-between h-14 p-2 items-center">
        <div className="flex items-center gap-2 bg-black rounded-full">
          <img src={logo} alt="Ally Studio" width={32} height={32} />
        </div>
        <ThemeToggle />

        <div className="">
          <div className=" gap-2">
            {/* <ThemeToggle /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  {session.user.user_metadata.name}
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
                <DropdownMenuItem onClick={() => supabase.auth.signOut()}>
                  <LogOutIcon />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
