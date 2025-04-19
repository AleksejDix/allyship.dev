import React from 'react'
import { cn } from '@/lib/utils'

type NodeProps = {
  id: string
  title: string
  description: string
  link?: string
  position: { top: string; left: string }
  primary?: boolean
}

export function EAARelationshipDiagram() {
  const nodes: NodeProps[] = [
    {
      id: 'annex4',
      title: 'Annex IV: Disproportionate Burden',
      description: 'Assessment of financial and organizational burden',
      position: { top: '50%', left: '50%' },
      link: '/eaa/4.4-annex4-disproportionate-burden',
      primary: true,
    },
    {
      id: 'annex1',
      title: 'Annex I: Accessibility Requirements',
      description: 'Core requirements that may be exempted',
      position: { top: '20%', left: '20%' },
      link: '/eaa/4.1-annex1-accessibility-requirements',
    },
    {
      id: 'annex2',
      title: 'Annex II: Implementation Examples',
      description: 'Solutions to consider in assessment',
      position: { top: '20%', left: '80%' },
      link: '/eaa/4.2-annex2-examples',
    },
    {
      id: 'annex3',
      title: 'Annex III: Conformity Assessment',
      description: 'Process for verifying partial compliance',
      position: { top: '35%', left: '85%' },
      link: '/eaa/4.3-annex3-conformity-assessment',
    },
    {
      id: 'annex5',
      title: 'Annex V: Conformity Assessment Products',
      description: 'Product assessment despite exemptions',
      position: { top: '65%', left: '85%' },
      link: '/eaa/4.5-annex5-assessment-products',
    },
    {
      id: 'annex6',
      title: 'Annex VI: Conformity Assessment Services',
      description: 'Detailed criteria for assessment',
      position: { top: '80%', left: '80%' },
      link: '/eaa/4.6-annex6-assessment-criteria',
    },
    {
      id: 'enforcement',
      title: 'Enforcement',
      description: 'Market surveillance verification',
      position: { top: '80%', left: '20%' },
      link: '/eaa/3-enforcement',
    },
    {
      id: 'compliance',
      title: 'Compliance',
      description: 'Documentation of exemptions',
      position: { top: '35%', left: '15%' },
      link: '/eaa/2-compliance',
    },
  ]

  return (
    <div
      className="my-8 relative"
      aria-labelledby="eaa-relationship-diagram-title"
    >
      <h3
        id="eaa-relationship-diagram-title"
        className="text-xl font-semibold mb-6 text-center"
      >
        Disproportionate Burden Relationships in the EAA
      </h3>

      <div className="relative h-[600px] border rounded-lg p-4 bg-muted/20">
        {/* Connection lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          {nodes.map(node => {
            if (node.id === 'annex4') return null
            return (
              <line
                key={`line-${node.id}`}
                x1="50%"
                y1="50%"
                x2={node.position.left}
                y2={node.position.top}
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="2"
                strokeDasharray={node.id === 'annex6' ? '0' : '5,5'}
              />
            )
          })}
        </svg>

        {/* Center node - Annex IV */}
        {nodes
          .filter(node => node.primary)
          .map(node => (
            <div
              key={node.id}
              id={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 w-48 p-3 rounded-lg border-2 border-primary bg-background shadow-md z-10"
              style={{
                top: node.position.top,
                left: node.position.left,
              }}
            >
              <h4 className="text-sm font-semibold">{node.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {node.description}
              </p>
              {node.link && (
                <a
                  href={node.link}
                  className="text-xs text-primary hover:underline mt-1 block"
                >
                  Learn more
                </a>
              )}
            </div>
          ))}

        {/* Other nodes */}
        {nodes
          .filter(node => !node.primary)
          .map(node => (
            <div
              key={node.id}
              id={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 w-44 p-2 rounded-lg border border-border bg-background shadow-sm z-0 hover:z-20 hover:shadow-md transition-all"
              style={{
                top: node.position.top,
                left: node.position.left,
              }}
            >
              <h4 className="text-xs font-semibold">{node.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {node.description}
              </p>
              {node.link && (
                <a
                  href={node.link}
                  className="text-xs text-primary hover:underline mt-1 block"
                >
                  View details
                </a>
              )}
            </div>
          ))}
      </div>

      <div className="mt-6 text-sm space-y-2">
        <h4 className="font-semibold">Key Relationships:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Annex IV ↔ Annex I:</strong> Identifies which requirements
            can be exempted
          </li>
          <li>
            <strong>Annex IV ↔ Annex II:</strong> Provides alternative
            solutions to consider
          </li>
          <li>
            <strong>Annex IV ↔ Annex VI:</strong> Offers detailed assessment
            criteria
          </li>
          <li>
            <strong>Annex IV ↔ Enforcement:</strong> Authorities verify
            legitimacy of exemption claims
          </li>
          <li>
            <strong>Annex IV ↔ Compliance:</strong> Organizations must document
            exemption justification
          </li>
        </ul>
      </div>

      {/* Visually hidden detailed explanation for screen readers */}
      <div className="sr-only">
        <p>
          This diagram illustrates how Annex IV (Disproportionate Burden)
          connects to other components of the European Accessibility Act. Annex
          IV is positioned at the center, with connecting lines to eight related
          components: Annex I (Accessibility Requirements), which defines the
          core requirements that may be exempted; Annex II (Implementation
          Examples), which provides solutions to consider during assessment;
          Annex III (Conformity Assessment), which outlines the process for
          verifying partial compliance; Annex V (Conformity Assessment
          Products), which covers product assessment despite exemptions; Annex
          VI (Conformity Assessment Services), which provides detailed criteria
          for assessment; Enforcement (Market Surveillance), which involves
          authorities verifying the legitimacy of exemption claims; and
          Compliance (Verification & Documentation), which requires
          organizations to document exemption justifications.
        </p>
      </div>
    </div>
  )
}
