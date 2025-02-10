"use client"

import Image from "next/image"
import type { DomainWithRelations } from "@/features/domain/types"
import type { Page as PrismaPage } from "@prisma/client"
import { Moon, Sun } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
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

  // Aggregate all scans from all pages
  const allScans = domain.pages
    .flatMap((page) => page.scans)
    .filter(
      (
        scan
      ): scan is NonNullable<typeof scan> & {
        metrics: NonNullable<(typeof scan)["metrics"]>
        created_at: NonNullable<(typeof scan)["created_at"]>
      } => {
        return Boolean(scan?.metrics && scan.created_at)
      }
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

  // Create chart data from scans
  const chartData = allScans.map((scan) => ({
    date: new Date(scan.created_at).getTime(), // Convert to timestamp for proper axis handling
    violations: scan.metrics[mode]?.violations_count || 0,
    // For incomplete, we'll use 30% of violations as a placeholder
    incomplete: Math.round((scan.metrics[mode]?.violations_count || 0) * 0.3),
  }))

  console.log("All Scans:", allScans) // Debug log
  console.log("Chart Data:", chartData) // Debug log

  const chartConfig = {
    violations: {
      label: "Violations",
      color: mode === "light" ? "#ef4444" : "#f87171",
    },
    incomplete: {
      label: "Incomplete",
      color: mode === "light" ? "#f59e0b" : "#fbbf24",
    },
  }

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
        <div>
          <div className="flex aspect-[1440/900]  items-center justify-center rounded-lg border border-border bg-muted">
            <p className="text-sm text-muted-foreground">
              No screenshot available
            </p>
          </div>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Error Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="fillViolations"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={mode === "light" ? "#ef4444" : "#f87171"}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={mode === "light" ? "#ef4444" : "#f87171"}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillIncomplete"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={mode === "light" ? "#f59e0b" : "#fbbf24"}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={mode === "light" ? "#f59e0b" : "#fbbf24"}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke={mode === "light" ? "#e5e7eb" : "#374151"}
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={60}
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    scale="time"
                    tickFormatter={(timestamp) => {
                      const date = new Date(timestamp)
                      const hours = date.getHours().toString().padStart(2, "0")
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")
                      return `${hours}:${minutes}`
                    }}
                    stroke={mode === "light" ? "#6b7280" : "#9ca3af"}
                  />
                  <ChartTooltip
                    cursor={{
                      stroke: mode === "light" ? "#e5e7eb" : "#374151",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="violations"
                    type="monotone"
                    strokeWidth={2}
                    fill="url(#fillViolations)"
                    stroke={mode === "light" ? "#ef4444" : "#f87171"}
                  />
                  <Area
                    dataKey="incomplete"
                    type="monotone"
                    strokeWidth={2}
                    fill="url(#fillIncomplete)"
                    stroke={mode === "light" ? "#f59e0b" : "#fbbf24"}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Scan history</p>
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

    // Calculate error trend from all pages' scans
    const errorTrend = domain.pages
      .flatMap((page) =>
        page.scans
          .slice(0, 100) // Get last 10 scans
          .reverse() // Most recent first
          .map((scan) => scan.metrics?.[mode]?.violations_count ?? 0)
      )
      .reduce((acc, curr, i) => {
        acc[i] = (acc[i] || 0) + curr
        return acc
      }, [] as number[])

    return { totalViolations, totalPasses, errorTrend }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Website Preview</CardTitle>
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
    </>
  )
}
