import Link from "next/link"
import { SignoutButton } from "@/features/user/components/user-logout"

import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ThemeToggle from "../ThemeToggle"

export async function UserMenu() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/auth/login"
          className={buttonVariants({ variant: "default" })}
        >
          Sign in
        </Link>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm sm:inline-flex">{data.user.email}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {data.user.user_metadata.avatar_url && (
                <AvatarImage
                  src={data.user.user_metadata.avatar_url}
                  alt={data.user.user_metadata.full_name}
                />
              )}

              <AvatarImage
                src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${Math.floor(Math.random() * 100000) + 1}`}
                alt={data.user.user_metadata.full_name ?? ""}
              />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {data.user.user_metadata.full_name}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {data.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/account">Account</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/spaces">Spaces</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <SignoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
