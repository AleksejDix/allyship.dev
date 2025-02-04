"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  count: {
    label: "Issues",
  },
  critical: {
    label: "Critical",
    color: "hsl(var(--chart-5))",
  },
  high: {
    label: "High",
    color: "hsl(var(--destructive))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--chart-3))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--chart-3))",
  },
  info: {
    label: "Info",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type Issue = any

type ScanResults = {
  violations: Issue[]
  passes: Issue[]
  incomplete: Issue[]
  inapplicable: Issue[]
}

export function IssueDistribution({ results }: { results: ScanResults }) {
  const allIssues = React.useMemo(() => {
    return results.violations.concat(results.incomplete)
  }, [results])

  const chartData = [
    {
      severity: "critical",
      count: allIssues.filter((v) => v.impact === "critical").length,
      fill: "hsl(var(--chart-5))",
    },
    {
      severity: "serious",
      count: allIssues.filter((v) => v.impact === "serious").length,
      fill: "hsl(var(--destructive))",
    },
    {
      severity: "moderate",
      count: allIssues.filter((v) => v.impact === "moderate").length,
      fill: "hsl(var(--chart-3))",
    },
    {
      severity: "minor",
      count: allIssues.filter((v) => v.impact === "minor").length,
      fill: "hsl(var(--chart-3))",
    },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Issue Distribution</CardTitle>
        <CardDescription>By Severity Level</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="severity"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {allIssues.length}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Issues
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {allIssues.length} total issues found
        </div>
        <div className="leading-none text-muted-foreground">
          Distribution of issues by severity level
        </div>
      </CardFooter>
    </Card>
  )
}
