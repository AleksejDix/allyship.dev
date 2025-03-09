'use client'

import { CheckCircle, Code, Glasses, BarChart2 } from 'lucide-react'

type BenefitGroup = {
  title: string
  description: string
  features: string[]
  icon: 'code' | 'glasses' | 'chart'
  color: 'blue' | 'purple' | 'amber'
}

const benefitGroups: BenefitGroup[] = [
  {
    title: 'Development Teams',
    description: 'Find issues early in development to save costly rework',
    features: [
      'Integrate with CI/CD pipelines',
      'Actionable fix recommendations',
    ],
    icon: 'code',
    color: 'blue',
  },
  {
    title: 'Accessibility Specialists',
    description: 'Go beyond static scanning with comprehensive testing',
    features: ['Test dynamic interactions', 'Generate compliance reports'],
    icon: 'glasses',
    color: 'purple',
  },
  {
    title: 'Product Managers',
    description: 'Balance compliance with development speed',
    features: ['Track progress over time', 'Prioritize critical issues'],
    icon: 'chart',
    color: 'amber',
  },
]

const getIconComponent = (iconType: string, colorClass: string) => {
  switch (iconType) {
    case 'code':
      return <Code className={`h-6 w-6 ${colorClass}`} aria-hidden="true" />
    case 'glasses':
      return <Glasses className={`h-6 w-6 ${colorClass}`} aria-hidden="true" />
    case 'chart':
      return (
        <BarChart2 className={`h-6 w-6 ${colorClass}`} aria-hidden="true" />
      )
    default:
      return null
  }
}

const getColorStyles = (color: string) => {
  switch (color) {
    case 'blue':
      return {
        border: 'from-blue-500 to-cyan-500',
        bgIcon: 'bg-blue-900/20 dark:bg-blue-800/30',
        textIcon: 'text-blue-500',
        checkIcon: 'text-blue-500 dark:text-blue-400',
      }
    case 'purple':
      return {
        border: 'from-purple-500 to-pink-500',
        bgIcon: 'bg-purple-900/20 dark:bg-purple-800/30',
        textIcon: 'text-purple-500',
        checkIcon: 'text-purple-500 dark:text-purple-400',
      }
    case 'amber':
      return {
        border: 'from-orange-500 to-amber-500',
        bgIcon: 'bg-amber-900/20 dark:bg-amber-800/30',
        textIcon: 'text-amber-500',
        checkIcon: 'text-amber-500 dark:text-amber-400',
      }
    default:
      return {
        border: 'from-primary to-primary-light',
        bgIcon: 'bg-primary/20',
        textIcon: 'text-primary',
        checkIcon: 'text-primary',
      }
  }
}

export function BenefitsSection() {
  return (
    <div className="container mx-auto py-16">
      <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty text-center mb-10">
        Who benefits from our tools?
      </h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
        {benefitGroups.map((group, index) => {
          const colorStyles = getColorStyles(group.color)

          return (
            <div
              key={index}
              className="relative rounded-lg border bg-card/5 dark:bg-card/10 overflow-hidden"
            >
              {/* Top border */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorStyles.border}`}
              ></div>

              <div className="p-6">
                {/* Icon */}
                <div
                  className={`mb-5 w-14 h-14 rounded-full ${colorStyles.bgIcon} flex items-center justify-center`}
                >
                  {getIconComponent(group.icon, colorStyles.textIcon)}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{group.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {group.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-3">
                  {group.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2.5">
                      <CheckCircle
                        className={`h-5 w-5 ${colorStyles.checkIcon} mt-0.5 flex-shrink-0`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
