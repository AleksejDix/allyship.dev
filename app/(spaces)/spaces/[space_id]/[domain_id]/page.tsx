import { ThemeAwareContent } from "@/features/domain/components/theme-aware-content"
import { PagesHeader } from "@/features/pages/components/pages-header"
import { PagesIndex } from "@/features/pages/components/pages-index"
import { Domain, Page, Scan } from "@prisma/client"

import { prisma } from "@/lib/prisma"

type Props = {
  params: { domain_id: string; space_id: string }
}

export type DomainWithRelations = Domain & {
  _count: {
    pages: number
  }
  pages: (Page & {
    scans: (Scan & {
      metrics: {
        light: {
          violations_count: number
          passes_count: number
        }
        dark: {
          violations_count: number
          passes_count: number
        }
      } | null
      screenshot_light?: string | null
      screenshot_dark?: string | null
    })[]
  })[]
}

export type PageWithRelations = Page & {
  domain: Domain
  scans: (Scan & {
    metrics: {
      light: {
        violations_count: number
      }
      dark: {
        violations_count: number
      }
    } | null
  })[]
}

export default async function DomainsPage({ params }: Props) {
  const { domain_id, space_id } = params

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
    },
  })) as DomainWithRelations | null

  if (!domain) {
    throw new Error("Domain not found")
  }

  const pages = (await prisma.page.findMany({
    where: {
      domain_id: domain_id,
    },
    include: {
      domain: true,
      scans: {
        where: {
          status: "completed",
        },
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      name: "asc",
    },
  })) as PageWithRelations[]

  return (
    <>
      <div className="container">
        <PagesHeader domain={domain} spaceId={space_id} domainId={domain_id} />
      </div>
      <ThemeAwareContent domain={domain} />
      <div className="container">
        <PagesIndex spaceId={space_id} domainId={domain_id} pages={pages} />
      </div>
    </>
  )
}
