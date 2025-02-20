import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@workspace/ui/components/card'

interface FeatureCard {
  icon: LucideIcon
  title: string
  description: string
}

interface FeatureCardsGridProps {
  title?: string
  items: FeatureCard[]
  columns?: 2 | 3 | 4
}

export function FeatureCardsGrid({
  title,
  items,
  columns = 4,
}: FeatureCardsGridProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="container py-20">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      )}
      <div className={`grid ${gridCols[columns]} gap-8`}>
        {items.map(item => (
          <Card key={item.title} className="border-primary/10">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <item.icon className="h-8 w-8 text-primary" />
                <h3 className="font-semibold text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
