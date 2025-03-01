"use client"

import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"
import logo from "data-base64:~assets/logo.png"
import * as Icons from "lucide-react"

import { SpaceOptionsDropdown } from "./space/space-options-dropdown"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"

export function Header() {
  const { session, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const userInitials =
    session?.user?.email?.split("@")[0]?.slice(0, 2)?.toUpperCase() || "U"

  // Function to refresh the extension
  const handleRefresh = () => {
    // Just reload the current page instead of the entire runtime
    window.location.reload()
  }

  // If no session, show login button instead
  if (!session) {
    return (
      <header className="border-b">
        <div className="container flex justify-between h-14 px-4 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-black rounded-full p-1">
              <img src={logo} alt="Ally Studio" width={32} height={32} />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRefresh}
                    aria-label="Refresh extension">
                    <Icons.RefreshCw className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh extension</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="default" size="sm">
            Sign in
          </Button>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b">
      <div className="container flex justify-between h-14 px-4 items-center">
        <div className="flex items-center gap-2">
          <div className="bg-black rounded-full p-1">
            <img src={logo} alt="Ally Studio" width={32} height={32} />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRefresh}
                  aria-label="Refresh extension">
                  <Icons.RefreshCw className="h-4 w-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh extension</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <SpaceOptionsDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <span className="sr-only">
                {session.user.user_metadata.name || ""}
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
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <>
                  <Icons.Sun className="mr-2 h-4 w-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Icons.Moon className="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => chrome.runtime.openOptionsPage()}>
              <Icons.Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={signOut}
              className="text-red-600 dark:text-red-400">
              <Icons.LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
