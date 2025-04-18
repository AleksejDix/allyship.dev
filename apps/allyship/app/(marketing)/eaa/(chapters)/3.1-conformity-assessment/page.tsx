import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conformity Assessment | European Accessibility Act',
  description:
    'How manufacturers and service providers can verify and declare compliance with the European Accessibility Act through conformity assessment procedures.',
}

export default function ConformityAssessmentPage() {
  return (
    <main tabIndex={-1} id="main-content" className="focus:outline-none">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          href="/eaa"
          className="inline-flex items-center text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          ← Back to Table of Contents
        </Link>
      </nav>

      <h1 className="text-4xl font-bold mb-8">Conformity Assessment</h1>

      <div className="space-y-8">
        <section aria-labelledby="conformity-purpose" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="conformity-purpose">
            Purpose of Conformity Assessment
          </h2>
          <div className="space-y-4">
            <p>
              Conformity assessment is the process by which manufacturers and
              service providers verify that their products and services comply
              with the accessibility requirements of the European Accessibility
              Act (EAA). It is a critical step in ensuring that products and
              services placed on the EU market are accessible to persons with
              disabilities.
            </p>
            <p>
              The conformity assessment procedure provides a systematic approach
              to evaluating accessibility and demonstrating compliance with the
              legal requirements, giving both economic operators and market
              surveillance authorities confidence in the accessibility of
              products and services.
            </p>
          </div>
        </section>

        <section aria-labelledby="internal-control" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="internal-control">
            Internal Production Control
          </h2>
          <div className="space-y-4">
            <p>
              For products, the conformity assessment is based on internal
              production control, as described in Module A of Annex II to
              Decision No 768/2008/EC. This procedure consists of three key
              elements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Technical documentation:</strong> The manufacturer must
                establish technical documentation that enables assessment of the
                product's conformity with the relevant accessibility
                requirements.
              </li>
              <li>
                <strong>Manufacturing process:</strong> The manufacturer must
                take all measures necessary to ensure that the manufacturing
                process and its monitoring ensure that the manufactured products
                comply with the technical documentation and with the applicable
                accessibility requirements.
              </li>
              <li>
                <strong>CE marking and declaration:</strong> The manufacturer
                must affix the CE marking to each individual product that meets
                the applicable requirements and draw up a written EU declaration
                of conformity.
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="service-assessment" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="service-assessment">
            Service Provider Assessment
          </h2>
          <div className="space-y-4">
            <p>For services, providers must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Evaluate how the service meets the applicable accessibility
                requirements
              </li>
              <li>
                Prepare information explaining how the service meets the
                accessibility requirements, following the guidance in Annex V of
                the Directive
              </li>
              <li>
                Verify that their services comply with the accessibility
                requirements, and maintain records of this verification process
              </li>
              <li>
                Make the information available to the public and maintain it for
                as long as the service is in operation
              </li>
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="technical-documentation"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="technical-documentation"
          >
            Technical Documentation
          </h2>
          <div className="space-y-4">
            <p>
              Technical documentation is a fundamental part of the conformity
              assessment process. For both products and services, this
              documentation must contain:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A general description of the product or service</li>
              <li>
                A list of the applied harmonized standards and technical
                specifications
              </li>
              <li>
                Copies of documents concerning the design and manufacture that
                affect accessibility
              </li>
              <li>
                A description of solutions adopted to meet the accessibility
                requirements
              </li>
              <li>
                Results of design calculations and examinations carried out
              </li>
              <li>
                Test reports or assessments conducted to verify compliance
              </li>
            </ul>
            <p>
              This documentation must be kept up to date and available for
              inspection by market surveillance authorities for at least five
              years after the product has been placed on the market or the
              service has been provided.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="harmonized-standards"
          className="scroll-mt-24"
        >
          <h2 className="text-2xl font-semibold mb-4" id="harmonized-standards">
            Use of Harmonized Standards
          </h2>
          <div className="space-y-4">
            <p>
              Products and services that comply with harmonized standards or
              parts thereof, the references to which have been published in the
              Official Journal of the European Union, are presumed to be in
              conformity with the accessibility requirements covered by those
              standards or parts thereof.
            </p>
            <p>
              Using harmonized standards can significantly simplify the
              conformity assessment process, as it provides a presumption of
              conformity with the EAA requirements. This approach:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reduces the burden of proof for economic operators</li>
              <li>Provides a clear technical path to compliance</li>
              <li>
                Creates consistency in accessibility implementation across the
                EU market
              </li>
              <li>
                Makes the conformity assessment process more efficient and
                cost-effective
              </li>
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="timeline-implementation"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="timeline-implementation"
          >
            Timeline for Implementation
          </h2>
          <div className="space-y-4">
            <p>
              The EAA provides for a phased implementation of conformity
              assessment requirements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>June 28, 2022:</strong> Deadline for Member States to
                adopt and publish the laws, regulations, and administrative
                provisions necessary to comply with the Directive
              </li>
              <li>
                <strong>June 28, 2025:</strong> Deadline for applying those
                measures
              </li>
              <li>
                <strong>June 28, 2030:</strong> Latest date by which service
                providers may continue to provide their services using products
                which were lawfully used before this date
              </li>
              <li>
                <strong>June 28, 2030:</strong> Latest date for compliance for
                service contracts concluded before June 28, 2025
              </li>
            </ul>
            <p>
              After these dates, all products and services within the scope of
              the EAA must undergo appropriate conformity assessment and meet
              the accessibility requirements, unless an exemption applies.
            </p>
          </div>
        </section>

        <section aria-labelledby="responsibility" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="responsibility">
            Responsibility for Conformity Assessment
          </h2>
          <div className="space-y-4">
            <p>
              The responsibility for performing the conformity assessment lies
              with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Manufacturers:</strong> For products they design,
                manufacture, and place on the market under their name
              </li>
              <li>
                <strong>Importers:</strong> When they place products from third
                countries on the EU market (though the assessment itself is
                typically conducted by the manufacturer)
              </li>
              <li>
                <strong>Service providers:</strong> For services they design and
                provide to consumers within the EU market
              </li>
            </ul>
            <p>
              In cases where multiple economic operators are involved in the
              supply chain, each has specific responsibilities to ensure that
              the conformity assessment has been properly conducted and
              documented.
            </p>
          </div>
        </section>

        <section aria-labelledby="non-compliance" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="non-compliance">
            Addressing Non-Compliance
          </h2>
          <div className="space-y-4">
            <p>
              If a conformity assessment reveals that a product or service does
              not meet the applicable accessibility requirements, economic
              operators must:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Take appropriate corrective measures to bring the product or
                service into conformity
              </li>
              <li>
                If the product or service presents an accessibility-related
                risk, immediately inform the competent national authorities
              </li>
              <li>
                Provide detailed information about the non-compliance and the
                corrective measures taken
              </li>
              <li>
                Cooperate with national authorities on any actions required to
                eliminate the non-compliance
              </li>
            </ul>
            <p>
              Failure to conduct proper conformity assessment or addressing
              identified non-compliance can result in sanctions imposed by
              national market surveillance authorities.
            </p>
          </div>
        </section>

        <nav
          className="flex justify-between mt-10 pt-4 border-t"
          aria-label="Chapter navigation"
        >
          <Link
            href="/eaa/2.6-obligations-service-providers"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            ← Service Providers' Obligations
          </Link>
          <Link
            href="/eaa/3.2-technical-documentation"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Technical Documentation →
          </Link>
        </nav>
      </div>
    </main>
  )
}
