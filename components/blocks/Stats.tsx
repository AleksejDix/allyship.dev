"use client"

import { DollarSign, Eye, TrendingUp, Users } from "lucide-react"
import { Sparklines, SparklinesLine } from "react-sparklines"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

const stats = [
  {
    id: 1,
    title: "Global Aging Population",
    description:
      "By 2050, 16% of the world's population will be over 65, increasing the need for accessible websites.",
    value: "16%",
    icon: <Users size="16" />,
    data: [5, 6, 7, 8, 9, 13, 20], // Made steeper at the end
  },
  {
    id: 2,
    title: "Increased Revenue",
    description:
      "Businesses that prioritize accessibility see a 20% increase in revenue due to better usability for all.",
    value: "+20%",
    icon: <DollarSign size="16" />,
    data: [100, 105, 108, 112, 115, 120], // Made steeper at the end
  },
  {
    id: 3,
    title: "Market Reach",
    description:
      "Over 1 billion people worldwide live with disabilities, representing a significant market opportunity.",
    value: "1B+",
    icon: <Eye size="16" />,
    data: [800, 850, 880, 900, 940, 1000], // Made steeper at the end
  },
  {
    id: 4,
    title: "SEO Benefits",
    description:
      "Accessible websites rank higher on search engines, leading to increased traffic and visibility.",
    value: "+50%",
    icon: <TrendingUp size="16" />,
    data: [100, 110, 120, 130, 140, 155], // Made steeper at the end
  },
]

export function Stats() {
  return (
    <div className="container max-w-screen-xl mx-auto py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Why Accessibility Matters
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id} className="relative  overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="text-sm font-medium">{stat.title}</div>
              <div className="h-8 w-8 text-blue-500 bg-blue-500/20 rounded-md flex items-center justify-center">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <p className="text-sm text-muted-foreground mb-4">
                {stat.description}
              </p>
              <div className="h-16 absolute bottom-4 -left-4 -right-4">
                <Sparklines data={stat.data} width={100} height={30}>
                  <SparklinesLine color="#3b82f6" />
                </Sparklines>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
