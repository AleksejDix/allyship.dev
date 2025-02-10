"use client"

import Image from "next/image"
import type { DomainWithRelations } from "@/features/domain/types"
import type { Page as PrismaPage } from "@prisma/client"
import { AlertTriangle, CheckCircle2, Circle, Moon, Sun } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function ThemeModeContent({
  mode,
  metrics,
  screenshot,
  domain,
}: {
  mode: "light" | "dark"
  metrics: { totalViolations: number; totalPasses: number }
  screenshot?: string | null
  domain: DomainWithRelations
}) {
  const { totalViolations, totalPasses } = metrics
  const total = totalPasses + totalViolations
  const passRate = total > 0 ? Math.round((totalPasses / total) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate}%</div>
            <Progress value={passRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {totalViolations}
            </div>
          </CardContent>
        </Card>
      </div>

      {screenshot && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={screenshot}
            alt={`${mode} mode screenshot of ${domain.name}`}
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  )
}

export function ThemeAwareContent({ domain }: { domain: DomainWithRelations }) {
  // Find the root page (usually "/" or shortest path)
  const rootPage = domain.pages
    .sort((a: PrismaPage, b: PrismaPage) => a.name.length - b.name.length)
    .find((page) => page.scans.length > 0)

  // Calculate domain-wide metrics by aggregating all latest scans
  const latestScans = domain.pages
    .map((page) => page.scans[0])
    .filter((scan): scan is NonNullable<typeof scan> => !!scan)

  const calculateMetrics = (mode: "light" | "dark") => {
    const totalViolations = latestScans.reduce(
      (sum: number, scan) =>
        sum + (scan.metrics?.[mode]?.violations_count ?? 0),
      0
    )
    const totalPasses = latestScans.reduce(
      (sum: number, scan) => sum + (scan.metrics?.[mode]?.passes_count ?? 0),
      0
    )
    return { totalViolations, totalPasses }
  }

  const totalPages = domain._count.pages
  const totalScans = latestScans.length
  const pagesWithIssues = domain.pages.filter(
    (page) =>
      (page.scans[0]?.metrics?.light?.violations_count ?? 0) > 0 ||
      (page.scans[0]?.metrics?.dark?.violations_count ?? 0) > 0
  ).length

  // Get the latest scan date
  const latestScanDate = latestScans.length
    ? Math.max(...latestScans.map((scan) => scan.created_at?.getTime() ?? 0))
    : null

  return (
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
      </div>

      {/* Theme-aware Results */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="light">
            <TabsList>
              <TabsTrigger value="light" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Light Mode
              </TabsTrigger>
              <TabsTrigger value="dark" className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Dark Mode
              </TabsTrigger>
            </TabsList>
            <TabsContent value="light" className="space-y-4">
              <ThemeModeContent
                mode="light"
                metrics={calculateMetrics("light")}
                screenshot={rootPage?.scans[0]?.screenshot_light}
                domain={domain}
              />
            </TabsContent>
            <TabsContent value="dark" className="space-y-4">
              <ThemeModeContent
                mode="dark"
                metrics={calculateMetrics("dark")}
                screenshot={rootPage?.scans[0]?.screenshot_dark}
                domain={domain}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Latest Scan Alert */}
      {latestScanDate ? (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Last scan completed {new Date(latestScanDate).toLocaleDateString()}.
            Found issues in {pagesWithIssues} pages.
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
    </div>
  )
}
