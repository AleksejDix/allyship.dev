import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Annexes | European Accessibility Act',
  description:
    'Detailed overview of the six annexes of the European Accessibility Act (EAA) including accessibility requirements, examples, and assessment methods.',
}

export default function AnnexesPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">
        Annexes of the European Accessibility Act
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview of the Annexes
          </h2>
          <div className="space-y-4">
            <p>
              The European Accessibility Act includes six annexes that provide
              detailed requirements, examples, assessment methods, and criteria
              essential for implementing the directive. These annexes form an
              integral part of the EAA and provide specific guidance for
              economic operators, conformity assessment bodies, and authorities.
            </p>
            <p>
              The annexes cover accessibility requirements for products and
              services, examples of how to implement these requirements,
              specifications for the built environment, methods for assessing
              disproportionate burden, conformity assessment procedures, and
              criteria for assessing exceptions.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3" id="annex-i">
              Annex I: Accessibility Requirements
            </h3>
            <p className="mb-4">
              Provides detailed accessibility requirements for products and
              services covered by the EAA, divided into sections for different
              types of products and services.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Requirements for all products</li>
              <li>Requirements for product packaging and instructions</li>
              <li>
                Requirements for the user interface and functionality design
              </li>
              <li>Requirements for all services</li>
              <li>
                Sector-specific requirements for e-commerce, banking, media,
                etc.
              </li>
            </ul>
            <Link
              href="/eaa/annexes/accessibility-requirements"
              className="text-blue-600 hover:underline"
            >
              View Annex I →
            </Link>
          </div>

          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3" id="annex-ii">
              Annex II: Examples of Implementation
            </h3>
            <p className="mb-4">
              Provides non-binding examples of possible solutions to meet the
              accessibility requirements of Annex I, helping economic operators
              understand practical implementation.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Examples for product accessibility</li>
              <li>Examples for service accessibility</li>
              <li>Practical approaches to information provision</li>
              <li>Examples of accessible user interfaces</li>
              <li>Examples for specific sectors</li>
            </ul>
            <Link
              href="/eaa/annexes/implementation-examples"
              className="text-blue-600 hover:underline"
            >
              View Annex II →
            </Link>
          </div>

          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3" id="annex-iii">
              Annex III: Requirements for Built Environment
            </h3>
            <p className="mb-4">
              Details the accessibility requirements for the built environment
              where services are provided, which Member States may choose to
              implement to improve the functioning of the internal market.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Use of related spaces and facilities</li>
              <li>Approaches to buildings and entrances</li>
              <li>Paths and navigation within service areas</li>
              <li>Signage and orientation information</li>
              <li>Use of service-related facilities</li>
            </ul>
            <Link
              href="/eaa/annexes/built-environment"
              className="text-blue-600 hover:underline"
            >
              View Annex III →
            </Link>
          </div>

          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3" id="annex-iv">
              Annex IV: Assessment of Disproportionate Burden
            </h3>
            <p className="mb-4">
              Outlines the criteria for assessing whether compliance with
              accessibility requirements would impose a disproportionate burden
              on economic operators.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                The ratio of costs of compliance to overall costs and revenues
              </li>
              <li>
                Estimated costs and benefits compared to the benefit for persons
                with disabilities
              </li>
              <li>The organization's size, resources, and nature</li>
              <li>
                Impact on economic operators versus benefits for persons with
                disabilities
              </li>
              <li>Frequency and duration of use of the product or service</li>
            </ul>
            <Link
              href="/eaa/annexes/disproportionate-burden-assessment"
              className="text-blue-600 hover:underline"
            >
              View Annex IV →
            </Link>
          </div>

          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3" id="annex-v">
              Annex V: Conformity Assessment for Products
            </h3>
            <p className="mb-4">
              Describes the procedure for product conformity assessment,
              including internal production control procedures that
              manufacturers must follow.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Technical documentation requirements</li>
              <li>Manufacturing process and quality controls</li>
              <li>Verification of accessibility requirements</li>
              <li>Product monitoring and assessment</li>
              <li>Declaration of conformity process</li>
            </ul>
            <Link
              href="/eaa/annexes/conformity-assessment-products"
              className="text-blue-600 hover:underline"
            >
              View Annex V →
            </Link>
          </div>

          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3" id="annex-vi">
              Annex VI: Criteria for Disproportionate Burden
            </h3>
            <p className="mb-4">
              Provides additional criteria for assessing fundamental alteration
              and disproportionate burden, with specific considerations for
              evaluating exceptions claimed by economic operators.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Criteria for determining fundamental alteration</li>
              <li>
                Additional financial considerations for disproportionate burden
              </li>
              <li>Assessment of organizational impact</li>
              <li>Evaluation of claimed exceptions</li>
              <li>Documentation requirements for exception claims</li>
            </ul>
            <Link
              href="/eaa/annexes/criteria-disproportionate-burden"
              className="text-blue-600 hover:underline"
            >
              View Annex VI →
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="importance">
            Importance of the Annexes
          </h2>
          <div className="space-y-4">
            <p>
              The annexes of the EAA provide the detailed technical
              specifications that transform the general principles of the
              directive into practical requirements. They are essential for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Economic operators</strong> – To understand specific
                accessibility requirements they must implement in their products
                and services
              </li>
              <li>
                <strong>Conformity assessment bodies</strong> – To evaluate
                products against established accessibility criteria
              </li>
              <li>
                <strong>Market surveillance authorities</strong> – To check for
                compliance with the accessibility requirements
              </li>
              <li>
                <strong>Service providers</strong> – To ensure their services
                meet accessibility standards
              </li>
              <li>
                <strong>Persons with disabilities</strong> – To understand their
                rights regarding the accessibility of products and services
              </li>
            </ul>
            <p>
              While the main text of the EAA establishes the legal framework,
              obligations, and procedures, the annexes provide the technical
              details necessary for practical implementation. Together, they
              form a comprehensive system to ensure accessibility for persons
              with disabilities throughout the European Union.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/non-compliance-procedure"
            className="text-blue-600 hover:underline"
          >
            ← Non-Compliance Procedures
          </Link>
          <Link
            href="/eaa/annexes/accessibility-requirements"
            className="text-blue-600 hover:underline"
          >
            Annex I: Accessibility Requirements →
          </Link>
        </nav>
      </div>
    </>
  )
}
