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
  errorTrend,
}: {
  mode: "light" | "dark"
  metrics: { totalViolations: number; totalPasses: number }
  screenshot?: string | null
  domain: DomainWithRelations
  errorTrend: number[]
}) {
  const { totalViolations, totalPasses } = metrics
  const total = totalPasses + totalViolations
  const passRate = total > 0 ? Math.round((totalPasses / total) * 100) : 0

  // Transform error trend data for the chart
  const chartData = errorTrend.map((value, index) => ({
    date: `Scan ${index + 1}`,
    violations: value,
    incomplete: Math.round(value * 0.3), // This is temporary - replace with actual incomplete data
  }))

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
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Error Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={chartData}>
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
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={mode === "light" ? "#ef4444" : "#f87171"}
                        stopOpacity={0.1}
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
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={mode === "light" ? "#f59e0b" : "#fbbf24"}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="violations"
                    type="natural"
                    fill="url(#fillViolations)"
                    stroke={mode === "light" ? "#ef4444" : "#f87171"}
                  />
                  <Area
                    dataKey="incomplete"
                    type="natural"
                    fill="url(#fillIncomplete)"
                    stroke={mode === "light" ? "#f59e0b" : "#fbbf24"}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Last {errorTrend.length} scans
            </p>
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
                errorTrend={calculateMetrics("light").errorTrend}
              />
            </TabsContent>
            <TabsContent value="dark">
              <ThemeModeContent
                mode="dark"
                metrics={calculateMetrics("dark")}
                screenshot={rootPage?.scans[0]?.screenshot_dark}
                domain={domain}
                errorTrend={calculateMetrics("dark").errorTrend}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}
