"use client"

import { HTMLAttributes } from "react"
import Link, { LinkProps } from "next/link"

import { cn } from "@/lib/utils"

import { useRouterLinkContext } from "../providers/RouterLinkContext"

type RouterLinkProps = LinkProps &
  HTMLAttributes<HTMLAnchorElement> & {
    exact?: boolean
  }

export const RouterLink = ({ exact = false, ...props }: RouterLinkProps) => {
  const currentPath = useRouterLinkContext()

  // Normalize paths by removing trailing slashes for comparison
  const normalizedCurrentPath = currentPath.replace(/\/$/, "")
  const normalizedHref = props.href.toString().replace(/\/$/, "")

  // Check if the current path exactly matches or contains the href
  const isExactMatch = normalizedCurrentPath === normalizedHref
  const isContained = !exact && normalizedCurrentPath.startsWith(normalizedHref + '/')
  const isActive = isExactMatch || isContained

  const ariaCurrent = isActive ? "page" : undefined

  return (
    <Link
      {...props}
      aria-current={ariaCurrent}
      className={cn(
        props.className,
        isActive && 'active'
      )}
    ></Link>
  )
}
