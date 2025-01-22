"use client"

import { HTMLAttributes } from "react"
import Link, { LinkProps } from "next/link"

import { cn } from "@/lib/utils"

import { useRouterLinkContext } from "../providers/RouterLinkContext"

type RouterLinkProps = LinkProps & HTMLAttributes<HTMLAnchorElement>

export const RouterLink = (props: RouterLinkProps) => {
  const currentPath = useRouterLinkContext()

  const isActive = currentPath === props.href
  const ariaCurrent = isActive ? "page" : undefined

  return (
    <Link
      {...props}
      aria-current={ariaCurrent}
      className={cn(
        "aria-[current=page]:text-orange-400 aria-[current=page]:underline",
        props.className
      )}
    ></Link>
  )
}
