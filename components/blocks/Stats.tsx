import { DollarSign, Eye, TrendingUp, Users } from "lucide-react"

const stats = [
  {
    id: 1,
    title: "Global Aging Population",
    description:
      "By 2050, 16% of the world’s population will be over 65, increasing the need for accessible websites.",
    value: "16%",
    icon: <Users />,
  },
  {
    id: 2,
    title: "Increased Revenue",
    description:
      "Businesses that prioritize accessibility see a 20% increase in revenue due to better usability for all.",
    value: "+20%",
    icon: <DollarSign />,
  },
  {
    id: 3,
    title: "Market Reach",
    description:
      "Over 1 billion people worldwide live with disabilities, representing a significant market opportunity.",
    value: "1B+",
    icon: <Eye />,
  },
  {
    id: 4,
    title: "SEO Benefits",
    description:
      "Accessible websites rank higher on search engines, leading to increased traffic and visibility.",
    value: "+50%",
    icon: <TrendingUp />,
  },
]

export function Stats() {
  return (
    <div className="container py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Why Accessibility Matters
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-xl border bg-card text-card-foreground shadow p-6"
            aria-label={stat.title}
          >
            <div className="flex items-center justify-between pb-4">
              <div className="text-sm font-medium">{stat.title}</div>
              <div className="h-8 w-8 text-muted-foreground">{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold mb-2">{stat.value}</div>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
