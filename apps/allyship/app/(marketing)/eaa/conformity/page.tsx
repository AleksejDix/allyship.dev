import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conformity Under the European Accessibility Act',
  description:
    'Understanding conformity requirements and procedures under the European Accessibility Act (EAA).',
}

export default function ConformityPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">
        Conformity Under the European Accessibility Act
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview of Conformity Requirements
          </h2>
          <div className="space-y-4">
            <p>
              The European Accessibility Act establishes a framework for
              ensuring that products and services comply with accessibility
              requirements. The conformity assessment process verifies that
              economic operators have fulfilled their obligations regarding
              accessibility.
            </p>
            <p>
              Conformity with the EAA is a comprehensive process that covers the
              entire product or service lifecycle, from design and manufacturing
              to placing on the market and continued compliance.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="presumption">
            Presumption of Conformity
          </h2>
          <div className="space-y-4">
            <p>
              Products and services that conform to harmonized standards or
              parts thereof, the references of which have been published in the
              Official Journal of the European Union, are presumed to be in
              conformity with the accessibility requirements covered by those
              standards.
            </p>
            <p>
              When no harmonized standards have been published, products that
              comply with technical specifications adopted by the Commission
              shall be presumed to be in conformity with the accessibility
              requirements covered by those technical specifications.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="assessment-procedures"
          >
            Conformity Assessment Procedures
          </h2>
          <div className="space-y-4">
            <p>
              The EAA provides for different conformity assessment procedures
              depending on the type of economic operator and product or service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Internal production control</strong> (Module A) - the
                manufacturer ensures and declares on their sole responsibility
                that the products concerned satisfy the applicable requirements.
              </li>
              <li>
                <strong>EU-type examination</strong> (Module B) followed by
                conformity to type based on internal production control (Module
                C) - for certain products, a notified body examines the
                technical design and verifies that it meets the requirements.
              </li>
              <li>
                <strong>Service providers</strong> must conduct their conformity
                assessment in accordance with Annex V of the EAA, which involves
                an evaluation of services against the accessibility
                requirements.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="documentation">
            Documentation Requirements
          </h2>
          <div className="space-y-4">
            <p>
              Economic operators must maintain comprehensive documentation to
              demonstrate conformity:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Technical documentation</strong> - containing all
                relevant data or details of the means used by the economic
                operator to ensure the product or service meets accessibility
                requirements.
              </li>
              <li>
                <strong>EU Declaration of Conformity</strong> - a formal
                declaration that the product meets all the essential
                requirements of the EAA.
              </li>
              <li>
                <strong>CE marking</strong> - for products, indicating
                conformity with EU legislation and enabling free movement in the
                European market.
              </li>
              <li>
                <strong>Records of complaints</strong> and non-conforming
                products and services, along with product recalls and
                information provided to distributors.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="continued-obligations"
          >
            Continued Conformity Obligations
          </h2>
          <div className="space-y-4">
            <p>
              Economic operators have ongoing responsibilities to ensure
              continued conformity:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Market surveillance cooperation</strong> - providing all
                necessary information and documentation to demonstrate product
                conformity.
              </li>
              <li>
                <strong>Corrective measures</strong> - taking immediate action
                when a product or service is found to be non-compliant.
              </li>
              <li>
                <strong>Information provision</strong> - ensuring that competent
                authorities can obtain all information necessary to verify
                conformity.
              </li>
              <li>
                <strong>Sample testing</strong> - when appropriate, carrying out
                sample testing of products made available on the market.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="exceptions">
            Exceptions and Special Provisions
          </h2>
          <div className="space-y-4">
            <p>
              The EAA recognizes certain exceptions to the conformity
              requirements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Disproportionate burden</strong> - if compliance would
                impose a disproportionate burden, economic operators may be
                exempted from specific requirements.
              </li>
              <li>
                <strong>Fundamental alteration</strong> - if compliance would
                require a fundamental alteration of the basic nature of the
                product or service.
              </li>
              <li>
                <strong>Microenterprises</strong> - service providers that are
                microenterprises are exempt from certain requirements but must
                notify the relevant authority if claiming this exemption.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="related-topics">
            Related Conformity Topics
          </h2>
          <div className="space-y-4">
            <p>
              Explore detailed information about specific aspects of conformity
              under the EAA:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link
                  href="/eaa/harmonized-standards"
                  className="text-blue-600 hover:underline"
                >
                  Harmonized Standards
                </Link>{' '}
                - Understanding the role of harmonized standards in ensuring
                conformity
              </li>
              <li>
                <Link
                  href="/eaa/eu-declaration-conformity"
                  className="text-blue-600 hover:underline"
                >
                  EU Declaration of Conformity
                </Link>{' '}
                - Requirements for the EU Declaration of Conformity document
              </li>
              <li>
                <Link
                  href="/eaa/ce-marking"
                  className="text-blue-600 hover:underline"
                >
                  CE Marking
                </Link>{' '}
                - Rules for applying the CE marking to products under the EAA
              </li>
              <li>
                <Link
                  href="/eaa/conformity-services"
                  className="text-blue-600 hover:underline"
                >
                  Conformity of Services
                </Link>{' '}
                - Specific conformity assessment procedures for services
              </li>
            </ul>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/obligations-service-providers"
            className="text-blue-600 hover:underline"
          >
            ← Service Providers' Obligations
          </Link>
          <Link
            href="/eaa/harmonized-standards"
            className="text-blue-600 hover:underline"
          >
            Harmonized Standards →
          </Link>
        </nav>
      </div>
    </>
  )
}
