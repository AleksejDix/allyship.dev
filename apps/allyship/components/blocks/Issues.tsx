'use client'

import { Circle, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@workspace/ui/components/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart'

const chartData = [
  {
    issue: 'Contrast',
    percent: 80,
    fill: 'var(--color-low-contrast)',
  },
  {
    issue: 'Images',
    percent: 55,
    fill: 'var(--color-missing-alt)',
  },
  {
    issue: 'Links',
    percent: 48,
    fill: 'var(--color-empty-links)',
  },
  {
    issue: 'Labels',
    percent: 44,
    fill: 'var(--color-form-labels)',
  },
  {
    issue: 'Buttons',
    percent: 28,
    fill: 'var(--color-form-labels)',
  },
  {
    issue: 'Language',
    percent: 17,
    fill: 'var(--color-form-labels)',
  },
]

const chartConfig = {
  issue: {
    label: 'Issue',
  },
  'low-contrast': {
    label: 'Low Contrast',
    color: 'hsl(var(--chart-2))',
  },
  'missing-alt': {
    label: 'Missing Alt Text',
    color: 'hsl(var(--chart-2))',
  },
  'empty-links': {
    label: 'Empty Links',
    color: 'hsl(var(--chart-2))',
  },
  'form-labels': {
    label: 'Missing Form Labels',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

const getPath = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TriangleBar = (props: any) => {
  const { fill, x, y, width, height } = props

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />
}
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink']

export function Issues() {
  return (
    <div className="container  mx-auto py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="col-span-2">
          <CardHeader></CardHeader>
          <CardContent>
            <div className="w-full">
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <YAxis
                    dataKey="percent"
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    hide={true}
                  />
                  <CartesianGrid />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />

                  <XAxis dataKey="issue" tickLine={false} axisLine={false} />

                  <Bar
                    dataKey="percent"
                    fill="#8884d8"
                    shape={<TriangleBar />}
                    label={{
                      position: 'top',
                      formatter: (value: number) => `${value}%`,
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
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

        <div className="flex flex-col space-y-4 md:col-span-1 justify-center">
          <h3 className="text-2xl font-bold text-pretty font-display md:text-3xl">
            Accessibility Issues Overview
          </h3>
          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground mt-6">
            Top Issues in the WebAIM Million
          </p>
          <ul className="mt-6 space-y-4">
            {chartData.map(item => (
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
      </div>
    </div>
  )
}
