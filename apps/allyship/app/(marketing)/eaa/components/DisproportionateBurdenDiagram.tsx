import React from 'react'
import { cn } from '@/lib/utils'

type DiagramNodeProps = {
  id: string
  title: string
  description?: string
  position: 'left' | 'right'
  className?: string
  children?: React.ReactNode
}

const DiagramNode = ({
  id,
  title,
  description,
  position,
  className,
  children,
}: DiagramNodeProps) => {
  return (
    <div
      id={id}
      className={cn(
        'relative mb-8 p-4 border rounded-lg bg-background',
        position === 'left' ? 'mr-auto' : 'ml-auto',
        'w-full sm:w-[90%] md:w-[85%]',
        'shadow-sm hover:shadow transition-shadow duration-200',
        className
      )}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}
      {children}

      {/* Connector line */}
      <div
        className={cn(
          'absolute w-4 h-4 rotate-45 border-b border-r border-border bg-background',
          'bottom-0 left-1/2 -mb-2 -ml-2'
        )}
        aria-hidden="true"
      />
    </div>
  )
}

export function DisproportionateBurdenDiagram() {
  return (
    <div className="my-8 relative" aria-labelledby="exemption-diagram-title">
      <h3
        id="exemption-diagram-title"
        className="text-xl font-semibold mb-6 text-center"
      >
        Disproportionate Burden Assessment Flow
      </h3>

      <div className="relative border-l-2 border-dashed border-primary/50 ml-4 md:ml-6 pl-6 md:pl-8">
        <DiagramNode
          id="step-1"
          title="1. Identify Applicable Requirements"
          description="Determine which accessibility requirements from Annex I apply to your specific product or service"
          position="right"
        />

        <DiagramNode
          id="step-2"
          title="2. Evaluate Implementation Options"
          description="For each requirement, identify technical and organizational measures needed"
          position="left"
        />

        <DiagramNode
          id="step-3"
          title="3. Estimate Costs"
          description="Calculate implementation costs, including design, development, testing, training, and maintenance"
          position="right"
        >
          <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
            <li>One-time costs</li>
            <li>Ongoing costs</li>
            <li>Resource allocation</li>
          </ul>
        </DiagramNode>

        <DiagramNode
          id="step-4"
          title="4. Estimate Benefits"
          description="Assess potential benefits of implementing each requirement"
          position="left"
        >
          <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
            <li>Market expansion</li>
            <li>Enhanced user experience</li>
            <li>Competitive advantage</li>
          </ul>
        </DiagramNode>

        <DiagramNode
          id="step-5"
          title="5. Determine Net Burden"
          description="Calculate net burden by comparing costs, benefits, and organizational resources"
          position="right"
          className="border-primary/50"
        />

        <DiagramNode
          id="step-6"
          title="6. Explore Alternatives"
          description="For requirements with disproportionate burden, find alternative approaches"
          position="left"
        />

        <DiagramNode
          id="step-7"
          title="7. Document Assessment"
          description="Create comprehensive documentation of the process, findings, and justifications"
          position="right"
        />

        <DiagramNode
          id="step-8"
          title="8. Set Reassessment Schedule"
          description="Establish timeline for periodic reassessment (minimum every 5 years)"
          position="left"
        />

        <div className="p-4 mt-4 border rounded-lg bg-secondary/10 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Ongoing Responsibility</h3>
          <p className="text-sm">
            Remember that disproportionate burden exemptions are temporary and
            subject to verification by market surveillance authorities.
            Reassessment is required when:
          </p>
          <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
            <li>The service is modified</li>
            <li>The product is changed or redesigned</li>
            <li>Requested by authorities</li>
            <li>Every five years (minimum)</li>
          </ul>
        </div>
      </div>

      {/* Visually hidden detailed explanation for screen readers */}
      <div className="sr-only">
        <p>
          This diagram illustrates the 8-step process for conducting a
          disproportionate burden assessment according to Annex IV of the
          European Accessibility Act. The process flows from identifying
          applicable requirements, through cost-benefit analysis, to
          documentation and reassessment scheduling. The assessment must be
          evidence-based, requirement-specific, and regularly updated.
        </p>
      </div>
    </div>
  )
}
