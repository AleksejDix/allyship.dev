import Image from "next/image"
import { PagesHeader } from "@/features/pages/components/pages-header"
import { PagesIndex } from "@/features/pages/components/pages-index"
import { Domain, Page, Scan } from "@prisma/client"
import { AlertTriangle, CheckCircle2, Circle } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Props = {
  params: { domain_id: string; space_id: string }
}

type DomainWithRelations = Domain & {
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
      } | null
      screenshot_light?: string | null
    })[]
  })[]
}

type PageWithRelations = Page & {
  domain: Domain
  scans: (Scan & {
    metrics: {
      light: {
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

  // Find the root page (usually "/" or shortest path)
  const rootPage = domain.pages
    .sort((a, b) => a.name.length - b.name.length)
    .find((page) => page.scans.length > 0)

  // Calculate domain-wide metrics by aggregating all latest scans
  const latestScans = domain.pages
    .map((page) => page.scans[0])
    .filter((scan): scan is NonNullable<typeof scan> => !!scan)

  const totalViolations = latestScans.reduce(
    (sum, scan) => sum + (scan.metrics?.light?.violations_count ?? 0),
    0
  )
  const totalPasses = latestScans.reduce(
    (sum, scan) => sum + (scan.metrics?.light?.passes_count ?? 0),
    0
  )

  const totalPages = domain._count.pages
  const totalScans = latestScans.length
  const pagesWithIssues = domain.pages.filter(
    (page) => page.scans[0]?.metrics?.light?.violations_count > 0
  ).length

  // Get the latest scan date
  const latestScanDate = latestScans.length
    ? Math.max(...latestScans.map((scan) => scan.created_at?.getTime() ?? 0))
    : null

  return (
    <>
      <div className="container space-y-8">
        {/* Domain Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <Circle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPages}</div>
              <p className="text-xs text-muted-foreground">
                Pages being monitored
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Circle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalScans}</div>
              <p className="text-xs text-muted-foreground">
                Accessibility scans run
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pages with Issues
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagesWithIssues}</div>
              <p className="text-xs text-muted-foreground">
                Pages needing attention
              </p>
            </CardContent>
          </Card>
          {totalPasses + totalViolations > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (totalPasses / (totalPasses + totalViolations)) * 100
                  )}
                  %
                </div>
                <Progress
                  value={Math.round(
                    (totalPasses / (totalPasses + totalViolations)) * 100
                  )}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Root Page Preview */}
        {rootPage?.scans[0]?.screenshot_light && (
          <Card>
            <CardHeader>
              <CardTitle>Homepage Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={rootPage.scans[0].screenshot_light}
                  alt={`Screenshot of ${domain.name} homepage`}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Latest Scan Alert */}
        {latestScanDate ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Last scan completed{" "}
              {new Date(latestScanDate).toLocaleDateString()}. Found{" "}
              {totalViolations} issues across all pages.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No scans have been run yet. Run a scan to get accessibility
              insights.
            </AlertDescription>
          </Alert>
        )}

        {/* Pages Section */}
        <div>
          <PagesHeader
            domain={domain}
            spaceId={space_id}
            domainId={domain_id}
          />
          <PagesIndex spaceId={space_id} domainId={domain_id} pages={pages} />
        </div>
      </div>
    </>
  )
}
