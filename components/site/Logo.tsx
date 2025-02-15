import React from "react"

import { cn } from "@/lib/utils"

import { Loader } from "../loader"
import { RouterLink } from "../RouterLink"

type LogoProps = React.HTMLAttributes<HTMLSpanElement>

export const Logo: React.FC<LogoProps> = ({ className, ...props }) => {
  return (
    <RouterLink
      href="/"
      aria-label="Allyship.dev"
      className="!no-underline inline-flex items-center gap-2 rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Loader size={32} />
      <span
        className={cn(
          "text-2xl sm:text-3xl font-extrabold font-display leading-none uppercase text-foreground",
          className
        )}
        {...props}
      >
        Allyship
      </span>
    </RouterLink>
  )
}
