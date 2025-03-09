'use client'

import { User } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'

type Testimonial = {
  name: string
  role: string
  quote: string
  avatarColor: 'blue' | 'purple' | 'orange'
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Accessibility Specialist',
    quote:
      'AllyShip found critical issues our previous scanner missed. The dashboard makes it easy to track improvements over time.',
    avatarColor: 'blue',
  },
  {
    name: 'David Chen',
    role: 'Frontend Lead',
    quote:
      "The Chrome extension is a game-changer for finding issues in our dynamic components. We've improved our WCAG compliance by 40%.",
    avatarColor: 'purple',
  },
  {
    name: 'Maria Rodriguez',
    role: 'Product Manager',
    quote:
      "Our stakeholders love the clear reports, and our developers appreciate the specific fix recommendations. It's been worth every penny.",
    avatarColor: 'orange',
  },
]

const getAvatarStyles = (color: string) => {
  switch (color) {
    case 'blue':
      return {
        bg: 'bg-blue-800/20',
        text: 'text-blue-400',
      }
    case 'purple':
      return {
        bg: 'bg-purple-800/20',
        text: 'text-purple-400',
      }
    case 'orange':
      return {
        bg: 'bg-orange-800/20',
        text: 'text-orange-400',
      }
    default:
      return {
        bg: 'bg-primary/20',
        text: 'text-primary',
      }
  }
}

export function UserTestimonials() {
  return (
    <div className="container mx-auto py-16">
      <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty text-center mb-10">
        What our beta users are saying
      </h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mt-10 max-w-5xl mx-auto">
        {testimonials.map((testimonial, index) => {
          const avatarStyles = getAvatarStyles(testimonial.avatarColor)

          return (
            <Card
              key={index}
              className="bg-card/5 dark:bg-background border border-border/30"
            >
              <CardHeader className="pb-3 pt-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full ${avatarStyles.bg} flex items-center justify-center`}
                  >
                    <User className={`h-5 w-5 ${avatarStyles.text}`} />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-sm leading-relaxed">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
