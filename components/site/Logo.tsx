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
      className="!no-underline inline-flex items-center gap-2"
    >
      <Loader size={32} />
      <span
        className={cn(
          "text-3xl font-extrabold font-display leading-none uppercase text-foreground",
          className
        )}
        {...props}
      >
        Allyship
      </span>
    </RouterLink>
  )
}
