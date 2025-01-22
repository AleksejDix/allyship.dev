import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignoutButton } from "@/app/(auth)/_components/SignoutButton"

import { RouterLink } from "../RouterLink"

export async function UserMenu() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return (
      <RouterLink
        href="/login"
        className={buttonVariants({ variant: "default" })}
      >
        Log in
      </RouterLink>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm sm:inline-flex">{data.user.email}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <pre>{JSON.stringify(data.user.user_metadata, null, 2)}</pre>
              <AvatarImage
                src={
                  data.user.user_metadata.image ??
                  `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`
                }
                alt={data.user.user_metadata.full_name ?? ""}
              />
              <AvatarFallback>ally</AvatarFallback>
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
          <DropdownMenuItem>
            <SignoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
