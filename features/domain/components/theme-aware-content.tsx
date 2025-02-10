"use client"

import Image from "next/image"
import type { DomainWithRelations } from "@/features/domain/types"
import type { Page as PrismaPage } from "@prisma/client"
import { Moon, Sun } from "lucide-react"

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
    <div className="grid gap-8 md:grid-cols-[3fr_5fr]">
      {screenshot ? (
        <div className="relative aspect-[1440/900] w-full overflow-hidden rounded-lg border border-border bg-muted">
          <Image
            src={screenshot}
            alt={`${mode} mode screenshot of ${domain.name}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="flex aspect-[1440/900] w-full items-center justify-center rounded-lg border border-border bg-muted">
          <p className="text-sm text-muted-foreground">
            No screenshot available
          </p>
        </div>
      )}

      <div className="space-y-6">
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

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="light" className="space-y-6">
          <TabsList>
            <TabsTrigger value="light" className="flex items-center gap-2">
              <Sun className="h-4 w-4" aria-hidden="true" />
              Light Mode
            </TabsTrigger>
            <TabsTrigger value="dark" className="flex items-center gap-2">
              <Moon className="h-4 w-4" aria-hidden="true" />
              Dark Mode
            </TabsTrigger>
          </TabsList>
          <TabsContent value="light">
            <ThemeModeContent
              mode="light"
              metrics={calculateMetrics("light")}
              screenshot={rootPage?.scans[0]?.screenshot_light}
              domain={domain}
            />
          </TabsContent>
          <TabsContent value="dark">
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
  )
}
