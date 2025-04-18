import React from 'react'
import { CheckCircle, AlertTriangle } from 'lucide-react'

interface TimelineEvent {
  date: Date
  title: string
  description: string
  status: 'completed' | 'upcoming'
}

interface EaaTimelineProps {
  events: TimelineEvent[]
}

export function EaaTimeline({ events }: EaaTimelineProps) {
  return (
    <div className="grid gap-4">
      {events.map((event, index) => (
        <div
          key={index}
          className={`p-4 rounded border ${
            event.status === 'completed'
              ? 'border-green-100 bg-green-50'
              : 'border-amber-100 bg-amber-50'
          }`}
        >
          <div className="flex items-center gap-2">
            {event.status === 'completed' ? (
              <CheckCircle
                className="h-5 w-5 text-green-600 flex-shrink-0"
                aria-hidden="true"
              />
            ) : (
              <AlertTriangle
                className="h-5 w-5 text-amber-600 flex-shrink-0"
                aria-hidden="true"
              />
            )}
            <time
              dateTime={event.date.toISOString()}
              className="text-base font-semibold"
            >
              {event.date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>

          <h3 className="font-medium text-lg ">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </div>
      ))}
    </div>
  )
}

// Default export with events for the EAA timeline
export default function DefaultEaaTimeline() {
  const eaaEvents: TimelineEvent[] = [
    {
      date: new Date('2019-04-17'),
      title: 'EAA Adoption',
      description:
        'European Accessibility Act adopted by European Parliament and Council',
      status: 'completed',
    },
    {
      date: new Date('2022-06-28'),
      title: 'National Implementation Deadline',
      description:
        'Deadline for EU Member States to adopt and publish laws, regulations and administrative provisions necessary to comply with the EAA',
      status: 'completed',
    },
    {
      date: new Date('2025-06-28'),
      title: 'Application of Requirements',
      description:
        'Member States shall apply the measures regarding the accessibility requirements for products and services',
      status: 'upcoming',
    },
    {
      date: new Date('2030-06-28'),
      title: 'Service Providers Transition Ends',
      description:
        'End of transition period for service providers to continue providing services using products which were lawfully used before this date',
      status: 'upcoming',
    },
  ]

  return <EaaTimeline events={eaaEvents} />
}
