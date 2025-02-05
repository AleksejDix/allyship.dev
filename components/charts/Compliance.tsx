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
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-2 bg-success/10 rounded-md p-2">
            <ShieldCheck className="text-success" />
          </div>
          <div>
            <p className="font-medium">Legal Compliance:</p>
            <p className="text-muted-foreground">
              Avoid lawsuits and fines by ensuring your digital content meets
              accessibility standards.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-2 bg-success/10 rounded-md p-2">
            <ShieldCheck className="text-success" />
          </div>
          <div>
            <p className="font-medium">Equal Access:</p>
            <p className="text-muted-foreground">
              Make your content accessible to all users, regardless of ability.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-2 bg-success/10 rounded-md p-2">
            <ShieldCheck className="text-success" />
          </div>
          <div>
            <p className="font-medium">Improved User Experience:</p>
            <p className="text-muted-foreground">
              Accessibility compliance ensures a better user experience for all
              users.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex items-center gap-2 bg-success/10 rounded-md p-2">
            <ShieldCheck className="text-success" />
          </div>
          <div>
            <p className="font-medium">Expanded Audience:</p>
            <p className="text-muted-foreground">
              Reach a wider audience by providing accessible content.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
