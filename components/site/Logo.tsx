import React from "react"

import { cn } from "@/lib/utils"

type LogoProps = React.HTMLAttributes<HTMLSpanElement>

export const Logo: React.FC<LogoProps> = ({ className, ...props }) => {
  return (
    <span
      className={cn("text-3xl font-bold", className)}
      {...props}
      aria-label="allyship homepage"
    >
      <span className="text-red-400">A</span>
      <span className="text-orange-400">l</span>
      <span className="text-amber-400">l</span>
      <span className="text-yellow-500">y</span>
      <span className="text-lime-400">s</span>
      <span className="text-green-400">h</span>
      <span className="text-emerald-400">i</span>
      <span className="text-teal-400">p</span>
    </span>
  )
}
