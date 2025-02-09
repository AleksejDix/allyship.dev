import * as React from "react"
import Link from "next/link"
import { BarChart2, FileText, Home, LucideIcon, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SpaceNavigationProps {
  spaceId: string
}

interface NavigationItem {
  title: string
  href: string
  icon: LucideIcon
}

export function SpaceNavigation({ spaceId }: SpaceNavigationProps) {
  const items: NavigationItem[] = [
    {
      title: "Overview",
      href: `/spaces/${spaceId}`,
      icon: Home,
    },
    {
      title: "Pages",
      href: `/spaces/${spaceId}/pages`,
      icon: FileText,
    },
    {
      title: "Scans",
      href: `/spaces/${spaceId}/scans`,
      icon: BarChart2,
    },
    {
      title: "Settings",
      href: `/spaces/${spaceId}/settings`,
      icon: Settings,
    },
  ]

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
        >
          <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
