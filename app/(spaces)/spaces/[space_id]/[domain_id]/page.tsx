import { ThemeAwareContent } from "@/features/domain/components/theme-aware-content"
import type { DomainWithRelations } from "@/features/domain/types"
import { ExternalLink } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Props = {
  params: { domain_id: string; space_id: string }
}

export default async function DomainsPage({ params }: Props) {
  const { domain_id } = params

  const domain = (await prisma.domain.findUnique({
    where: {
      id: domain_id,
    },
    include: {
      _count: {
        select: {
          pages: true,
        },
      },
      pages: {
        include: {
          scans: {
            where: {
              status: "completed",
            },
            orderBy: {
              created_at: "desc",
            },
            take: 1,
            select: {
              id: true,
              created_at: true,
              status: true,
              metrics: true,
              screenshot_light: true,
              screenshot_dark: true,
            },
          },
        },
      },
      space: {
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      },
    },
  })) as DomainWithRelations

  if (!domain) {
    throw new Error("Domain not found")
  }

  // Get the latest scan date
  const latestScan = domain.pages
    .flatMap((page) => page.scans)
    .sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0
      return b.created_at.getTime() - a.created_at.getTime()
    })[0]

  const userName = [domain.space.user.first_name, domain.space.user.last_name]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="container  space-y-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">{domain.name}</h1>
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://${domain.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <span>Visit Site</span>
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Created by</span>
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{userName || "Unknown User"}</span>
          </div>
          {latestScan && (
            <Badge variant="outline">
              Last scan {latestScan.created_at?.toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>
      <ThemeAwareContent domain={domain} />
    </div>
  )
}
