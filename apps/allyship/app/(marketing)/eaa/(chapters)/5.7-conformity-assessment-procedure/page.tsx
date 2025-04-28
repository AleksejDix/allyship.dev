import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { PAGES } from '../../constants/links'
import { ChapterNavigation } from '../../components/ChapterNavigation'

// Define annex links using PAGES for references
const ANNEXES_LINKS = {
  CONFORMITY_ASSESSMENT: {
    fullPath: PAGES['8.5-annex5-conformity-assessment']?.fullPath || '#',
  },
}

export const metadata: Metadata = {
  title: 'Conformity Assessment Procedure | European Accessibility Act',
  description:
    'Understanding the conformity assessment procedures for products and services under the European Accessibility Act (EAA).',
}

export default function ConformityAssessmentPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Conformity Assessment Procedure.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#internal-control"
                  id="internal-control-link"
                >
                  Internal Production Control.
                </a>
              </li>
              <li>
                <a className="underline" href="#module-a" id="module-a-link">
                  Module A Procedure.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#documentation"
                  id="documentation-link"
                >
                  Required Documentation.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#service-assessment"
                  id="service-assessment-link"
                >
                  Service Assessment.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2"
        id="eaa-content"
      >
        <div className="space-y-8">
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview of Conformity Assessment.
            </h2>
            <div className="space-y-4">
              <p>
                Conformity assessment is the process used to demonstrate that a
                product or service meets the accessibility requirements set out
                in the European Accessibility Act. The EAA establishes specific
                procedures that manufacturers, importers, distributors, and
                service providers must follow.
              </p>
              <p>
                For products, the EAA requires the use of the "internal
                production control" procedure (known as Module A), where
                manufacturers take full responsibility for ensuring and
                declaring conformity.
              </p>
              <p>
                For services, a similar but distinct assessment process is
                required, focusing on how services meet the accessibility
                requirements in Annex I.
              </p>
            </div>
          </section>

          <section aria-labelledby="internal-control">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="internal-control"
              tabIndex={-1}
            >
              Internal Production Control.
            </h2>
            <div className="space-y-4">
              <p>
                Internal production control (Module A) is the conformity
                assessment procedure where the manufacturer:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Takes sole responsibility for ensuring their products meet EAA
                  requirements
                </li>
                <li>
                  Creates technical documentation showing how requirements are
                  met
                </li>
                <li>
                  Carries out production controls to maintain consistent
                  accessibility
                </li>
                <li>Draws up an EU Declaration of Conformity</li>
                <li>Applies the CE marking to compliant products</li>
              </ul>
              <p>
                This procedure does not require the involvement of a notified
                body or third-party certification, which reduces costs and
                administrative burdens for businesses.
              </p>
            </div>
          </section>

          <section aria-labelledby="module-a">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="module-a"
              tabIndex={-1}
            >
              Module A Procedure Steps.
            </h2>
            <div className="space-y-4">
              <p>
                The manufacturer must follow these steps to complete the Module
                A procedure:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Product assessment:</strong> Analyze the product
                  against the accessibility requirements in Annex I of the EAA.
                </li>
                <li>
                  <strong>Technical documentation:</strong> Create detailed
                  documentation that includes:
                  <ul className="list-disc pl-6 mt-2">
                    <li>General description of the product</li>
                    <li>
                      List of applied harmonized standards or technical
                      specifications
                    </li>
                    <li>Design and manufacturing drawings where relevant</li>
                    <li>Explanations necessary to understand those drawings</li>
                    <li>Results of design calculations and examinations</li>
                    <li>Test reports demonstrating conformity</li>
                  </ul>
                </li>
                <li>
                  <strong>Production control:</strong> Implement measures to
                  ensure all manufactured products comply with requirements.
                </li>
                <li>
                  <strong>Conformity marking:</strong> Apply the CE marking to
                  each product.
                </li>
                <li>
                  <strong>Declaration of Conformity:</strong> Draw up a written
                  EU Declaration of Conformity for the product model.
                </li>
                <li>
                  <strong>Documentation storage:</strong> Keep technical
                  documentation and Declaration of Conformity for 5 years after
                  the product is placed on the market.
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="documentation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="documentation"
              tabIndex={-1}
            >
              Required Documentation.
            </h2>
            <div className="space-y-4">
              <p>
                The technical documentation for accessibility conformity
                assessment must include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  An assessment of which accessibility requirements apply to the
                  product
                </li>
                <li>
                  Details of how the product meets each applicable requirement
                </li>
                <li>Evidence of accessibility testing and results</li>
                <li>
                  Documentation of any exemptions claimed under
                  "disproportionate burden" or "fundamental alteration"
                </li>
                <li>
                  Information on how users will be informed about accessibility
                  features
                </li>
                <li>User instructions related to accessibility features</li>
              </ul>
              <p>
                This documentation serves as the basis for the EU Declaration of
                Conformity and should be made available to market surveillance
                authorities upon request.
              </p>
            </div>
          </section>

          <section aria-labelledby="service-assessment">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="service-assessment"
              tabIndex={-1}
            >
              Service Assessment Procedure.
            </h2>
            <div className="space-y-4">
              <p>
                For services, the assessment procedure is similar but with key
                differences:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>No CE marking</strong> is required for services
                </li>
                <li>
                  <strong>No formal Declaration of Conformity</strong> is
                  required, but documentation must be maintained
                </li>
                <li>
                  Service providers must maintain documentation demonstrating
                  how the service meets accessibility requirements
                </li>
                <li>
                  Documentation must be kept for as long as the service is
                  offered
                </li>
                <li>
                  The assessment must include how the service meets requirements
                  in Annex I, Section III of the EAA
                </li>
              </ul>
              <p>
                Service providers must also publish information about how their
                services meet accessibility requirements, typically through
                accessibility statements on their websites or in other
                user-facing documentation.
              </p>
            </div>
          </section>

          <section aria-labelledby="references" className="mt-12 pt-6 border-t">
            <h2
              id="references"
              className="text-xl font-semibold mb-4 scroll-mt-6"
              tabIndex={-1}
            >
              Source References.
            </h2>
            <p className="text-sm text-muted-foreground">
              This page references these sections of Directive (EU) 2019/882:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mt-2">
              <li>Article 17. General principles of CE marking.</li>
              <li>
                Article 20. Rules and procedures on conformity of services.
              </li>
              <li>Annex IV. Conformity assessment procedure for products.</li>
              <li>
                Annex V. Information on services meeting accessibility
                requirements.
              </li>
            </ul>
          </section>

          <footer>
            <ChapterNavigation currentPageId="5.7-conformity-assessment-procedure" />
          </footer>
        </div>
      </div>
    </section>
  )
}
