import React from "react"

import { cn } from "@/lib/utils"

type LogoProps = React.HTMLAttributes<HTMLSpanElement>

export const Logo: React.FC<LogoProps> = ({ className, ...props }) => {
  return (
    <span className={cn("text-3xl font-bold", className)} {...props}>
      <span className="sr-only">Allyship</span>
      <span className="text-red-500" aria-hidden="true">
        a
      </span>
      <span className="text-orange-500" aria-hidden="true">
        1
      </span>
      <span className="text-amber-500" aria-hidden="true">
        1
      </span>
      <span className="text-yellow-500" aria-hidden="true">
        y
      </span>
      <span className="text-lime-500" aria-hidden="true">
        s
      </span>
      <span className="text-green-500" aria-hidden="true">
        h
      </span>
      <span className="text-emerald-500" aria-hidden="true">
        i
      </span>
      <span className="text-teal-500" aria-hidden="true">
        p
      </span>
    </span>
  )
}
