"use client"

import { Circle, TrendingUp } from "lucide-react"
import { Bar, BarChart, LabelList, Rectangle, YAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  {
    issue: "Low Contrast",
    percent: 80,
    fill: "var(--color-low-contrast)",
  },
  {
    issue: "Missing Alt Text",
    percent: 55,
    fill: "var(--color-missing-alt)",
  },
  {
    issue: "Empty Links",
    percent: 48,
    fill: "var(--color-empty-links)",
  },
  {
    issue: "Missing Form Labels",
    percent: 44,
    fill: "var(--color-form-labels)",
  },
  {
    issue: "Empty Buttons",
    percent: 28,
    fill: "var(--color-form-labels)",
  },
  {
    issue: "Missing Document Language",
    percent: 17,
    fill: "var(--color-form-labels)",
  },
]

const chartConfig = {
  issue: {
    label: "Issue",
  },
  "low-contrast": {
    label: "Low Contrast",
    color: "hsl(var(--chart-2))",
  },
  "missing-alt": {
    label: "Missing Alt Text",
    color: "hsl(var(--chart-2))",
  },
  "empty-links": {
    label: "Empty Links",
    color: "hsl(var(--chart-2))",
  },
  "form-labels": {
    label: "Missing Form Labels",
    color: "hsl(var(--chart-2))",
  },
  other: {
    label: "Other Issues",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Issues() {
  return (
    <div className="container py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col space-y-4 md:col-span-1 justify-center">
          <h3 className="text-2xl font-bold md:text-3xl">
            Accessibility Issues Overview
          </h3>
          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground mt-6">
            Top Issues in the WebAIM Million
          </p>
          <ul className="mt-6 space-y-4">
            {chartData.map((item) => (
              <li
                key={item.issue}
                className="flex items-center text-lg leading-snug text-muted-foreground"
              >
                <Circle className="h-4 w-4 text-primary mr-2" />
                <span className="font-medium text-foreground">
                  {item.issue}:
                </span>
                <span className="ml-2">{item.percent}%</span>
              </li>
            ))}
          </ul>
        </div>
        <Card className="col-span-2">
          <CardHeader></CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Bar
                  dataKey="percent"
                  strokeWidth={2}
                  radius={8}
                  fill="gray"
                  activeBar={({ ...props }) => {
                    return (
                      <Rectangle
                        {...props}
                        fillOpacity={0.8}
                        stroke={props.payload.fill}
                        strokeDasharray={4}
                        strokeDashoffset={4}
                      />
                    )
                  }}
                >
                  <LabelList
                    dataKey="issue"
                    position="top"
                    offset={10}
                    className="fill-foreground"
                    fontSize={10}
                  />
                  <LabelList
                    dataKey="percent"
                    position="top"
                    formatter={(value: number) => `${value}%`}
                    offset={-42}
                    className="fill-background"
                    fontSize={42}
                  />
                </Bar>
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 3.7% this year <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Based on the latest WebAIM Million report
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
