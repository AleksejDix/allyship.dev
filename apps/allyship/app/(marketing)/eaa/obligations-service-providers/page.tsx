import Link from 'next/link'
import React from 'react'

export default function ServiceProvidersObligationsPage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link
          href="/eaa/obligations"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Table of Contents
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        Obligations of Service Providers
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Role of Service Providers
        </h2>
        <p className="mb-4">
          Service providers have specific obligations under the European
          Accessibility Act to ensure their services are accessible to persons
          with disabilities. These obligations focus on ensuring that digital
          services and their related components meet established accessibility
          standards.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Design and Provision Requirements
        </h2>
        <p className="mb-4">
          Service providers must ensure that they design and provide services in
          accordance with the accessibility requirements of the EAA by:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Designing and providing services in accordance with the
            accessibility requirements set out in the EAA
          </li>
          <li>
            Preparing the necessary technical documentation to demonstrate that
            services meet the applicable accessibility requirements
          </li>
          <li>
            Providing information on how the service meets applicable
            accessibility requirements
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Documentation and Information
        </h2>
        <p className="mb-4">
          Service providers are required to maintain proper documentation about
          accessibility features:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Explaining how the accessibility requirements have been met</li>
          <li>
            Making this information available to the public in written and oral
            format, including in a manner which is accessible to persons with
            disabilities
          </li>
          <li>
            Retaining this documentation for a period of five years after the
            service was last provided
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Addressing Non-Compliance
        </h2>
        <p className="mb-4">
          When a service does not conform to applicable accessibility
          requirements, service providers must:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Take immediate corrective measures to bring the service into
            conformity, withdraw it, or cease its provision as appropriate
          </li>
          <li>
            Immediately inform the competent national authorities where the
            service presents a risk related to accessibility, giving details
            about the non-compliance and corrective measures taken
          </li>
          <li>
            Cooperate with competent authorities on any measures to ensure
            compliance
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Cooperation with Authorities
        </h2>
        <p className="mb-4">
          Service providers are obligated to cooperate with authorities by:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Demonstrating compliance with the applicable accessibility
            requirements, when requested
          </li>
          <li>
            Providing all information and documentation necessary to demonstrate
            conformity
          </li>
          <li>
            Cooperating on any action taken to eliminate non-compliance with the
            applicable accessibility requirements
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Disproportionate Burden Exception
        </h2>
        <p className="mb-4">
          Service providers may be exempt from accessibility requirements if
          they can demonstrate that meeting them would:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Impose a disproportionate burden on them based on criteria specified
            in Annex VI
          </li>
          <li>Require a fundamental alteration in the nature of the service</li>
        </ul>
        <p className="mb-4">
          When claiming disproportionate burden, service providers must:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Conduct an assessment of whether compliance would require a
            fundamental change or impose a disproportionate burden
          </li>
          <li>
            Document this assessment according to the requirements in Annex VI
          </li>
          <li>
            Re-evaluate the exemption at least every five years, or when the
            service offering is modified
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Microenterprise Exemption
        </h2>
        <p className="mb-4">
          Service providers that are microenterprises (fewer than 10 persons and
          an annual turnover not exceeding €2 million or an annual balance sheet
          total not exceeding €2 million) are exempt from compliance with the
          accessibility requirements. However, they must still:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Notify the relevant market surveillance authority when applying this
            exemption, if requested
          </li>
          <li>Provide relevant information on request</li>
        </ul>
      </section>

      <nav className="mt-12 pt-8 border-t">
        <div className="flex justify-between">
          <Link
            href="/eaa/obligations-distributors"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Distributors' Obligations
          </Link>
          <Link
            href="/eaa/conformity"
            className="text-blue-600 hover:text-blue-800"
          >
            Conformity →
          </Link>
        </div>
      </nav>
    </main>
  )
}
