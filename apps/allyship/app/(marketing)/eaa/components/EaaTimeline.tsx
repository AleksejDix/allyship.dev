import React from 'react'
import { CheckCircle, Clock, AlarmClock } from 'lucide-react'

interface TimelineEvent {
  date: Date
  title: string
  description: string
  status: 'current' | 'upcoming' | 'past'
}

interface EaaTimelineProps {
  events: TimelineEvent[]
}

const statusColors = {
  past: 'border-black',
  current: 'border-green-400',
  upcoming: 'border-red-400',
}

const statusIcons = {
  past: () => <CheckCircle className="text-black" aria-hidden="true" />,
  current: () => <Clock className="text-green-600" aria-hidden="true" />,
  upcoming: () => <AlarmClock className="text-red-600" aria-hidden="true" />,
}

export function EaaTimeline({ events }: EaaTimelineProps) {
  function getBorderColor(event: TimelineEvent) {
    return statusColors[event.status]
  }

  function getStatusIcon(event: TimelineEvent) {
    return statusIcons[event.status]()
  }

  return (
    <div className="grid text-left">
      {events.map((event, index) => (
        <div
          key={index}
          className={`p-4 relative border-l-4 ${getBorderColor(event)}`}
        >
          <div className="absolute top-4 right-0">{getStatusIcon(event)}</div>

          <div className="pr-8">
            <time
              dateTime={event.date.toISOString()}
              className="text-base font-semibold"
            >
              {event.date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {' - '}
            </time>
            <h3 className="font-medium text-lg inline-block">{event.title}</h3>
          </div>
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
      status: 'past',
    },
    {
      date: new Date('2022-06-28'),
      title: 'National Implementation Deadline',
      description:
        'Deadline for EU Member States to adopt and publish laws, regulations and administrative provisions necessary to comply with the EAA',
      status: 'past',
    },
    {
      date: new Date('2025-06-28'),
      title: 'Application of Requirements',
      description:
        'Member States shall apply the measures regarding the accessibility requirements for products and services',
      status: 'current',
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
