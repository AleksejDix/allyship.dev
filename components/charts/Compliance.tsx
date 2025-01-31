"use client"

import { ShieldCheck, TrendingUp } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts"

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

const complianceData = [
  { month: "January", compliance: 0 },
  { month: "February", compliance: 20 },
  { month: "March", compliance: 15 },
  { month: "April", compliance: 10 },
  { month: "May", compliance: 70 },
  { month: "June", compliance: 90 },
]

const complianceConfig = {
  compliance: {
    label: "WCAG Compliance",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Compliance() {
  return (
    <div className="grid md:grid-cols-3 gap-8 items-center">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>WCAG Compliance Over Time</CardTitle>
          <CardDescription>
            Track how your product improves accessibility and reduces legal
            risks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={complianceConfig}>
            <LineChart
              accessibilityLayer
              data={complianceData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="compliance"
                type="natural"
                stroke="var(--color-compliance)"
                strokeWidth={7}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            WCAG Compliance increased by 5% this month
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Consistent testing ensures faster, better product delivery and
            reduces the risk of lawsuits.
          </div>
          <div className="flex  gap-2 text-green-600">
            <ShieldCheck className="h-4 w-4" />
            Better accessibility fosters inclusivity and builds trust.
          </div>
        </CardFooter>
      </Card>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold md:text-3xl">
          Compliance is the act of adhering to legal standards and guidelines.
        </h3>
        <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground mt-6">
          Accessibility compliance ensures your digital content meets standards
          like WCAG, providing equal access to users with disabilities.
        </p>
        <p>
          <ShieldCheck className="h-6 w-6 text-green-400 inline-block mr-4" />
          <strong>Legal Compliance:</strong> Avoid lawsuits and fines by
          ensuring your digital content meets accessibility standards.
        </p>
        <p>
          <ShieldCheck className="h-6 w-6 text-green-400 inline-block mr-4" />
          <strong>Equal Access:</strong> Make your content accessible to all
          users, regardless of ability.
        </p>
        <p>
          <ShieldCheck className="h-6 w-6 text-green-400 inline-block mr-4" />
          <strong>Improved User Experience:</strong> Accessibility compliance
          ensures a better user experience for all users.
        </p>

        <p>
          <ShieldCheck className="h-6 w-6 text-green-400 inline-block mr-4" />
          <strong>Expanded Audience:</strong>
          <span className="text-foreground">
            Reach a wider audience by providing accessible content.
          </span>
        </p>

        <p>
          <ShieldCheck className="h-6 w-6 text-green-400 inline-block mr-4" />
          <strong>Better SEO:</strong> Improve your search engine ranking by
          making your content accessible.
        </p>
      </div>
    </div>
  )
}
