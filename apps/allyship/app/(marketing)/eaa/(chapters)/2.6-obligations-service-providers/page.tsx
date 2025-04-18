import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Service Provider Obligations | European Accessibility Act',
  description:
    'Legal responsibilities of service providers under the European Accessibility Act, including accessibility requirements for services, documentation, and compliance procedures.',
}

export default function ServiceProvidersObligationsPage() {
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

      <h1 className="text-4xl font-bold mb-8">
        Obligations of Service Providers
      </h1>

      <div className="space-y-8">
        <section
          aria-labelledby="role-service-providers"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="role-service-providers"
          >
            Role of Service Providers
          </h2>
          <div className="space-y-4">
            <p>
              Article 13 of the European Accessibility Act outlines the
              obligations of service providers. Service providers are any
              natural or legal person who provides a service, as defined in the
              Directive, that falls within the scope of the Act.
            </p>
            <p>
              Service providers have a direct responsibility to ensure that
              their services are designed and provided in accordance with the
              accessibility requirements of this Directive. This includes
              digital services, e-commerce, banking services, transportation,
              and more.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="design-responsibility"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="design-responsibility"
          >
            Design and Provision Responsibility
          </h2>
          <div className="space-y-4">
            <p>
              Service providers shall ensure that they design and provide
              services in accordance with the accessibility requirements of this
              Directive. Their primary obligations include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Designing services to be accessible from the outset, following
                the principles of "universal design" where possible
              </li>
              <li>
                Ensuring that existing services are gradually brought into
                compliance with accessibility requirements
              </li>
              <li>
                Making information about how the service meets accessibility
                requirements available to the public
              </li>
              <li>
                Ensuring that the service and its accessibility features remain
                consistent over time
              </li>
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="information-requirements"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="information-requirements"
          >
            Information Requirements
          </h2>
          <div className="space-y-4">
            <p>
              Service providers shall prepare the necessary information in
              accordance with Annex V of the Directive. This information must
              explain how the service meets the applicable accessibility
              requirements and must be:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Made available to the public in written and oral format,
                including in a manner accessible to persons with disabilities
              </li>
              <li>Kept for as long as the service is in operation</li>
              <li>Provided upon reasoned request to competent authorities</li>
            </ul>
            <p>
              This information must detail the accessibility features of the
              service, how they are implemented, and any limitations in
              accessibility that might exist.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="compliance-assessment"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="compliance-assessment"
          >
            Compliance Assessment
          </h2>
          <div className="space-y-4">
            <p>
              Service providers are required to carry out and document a
              compliance assessment of their services. This assessment should:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Identify which accessibility requirements apply to their
                specific service
              </li>
              <li>
                Evaluate how the service currently meets those requirements
              </li>
              <li>Identify any gaps or areas of non-compliance</li>
              <li>Develop a plan for addressing non-compliance</li>
              <li>Document the assessment process and outcomes</li>
            </ul>
            <p>
              This assessment forms part of the documentation that service
              providers must maintain regarding accessibility compliance.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="non-compliance-action"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="non-compliance-action"
          >
            Action on Non-Compliance
          </h2>
          <div className="space-y-4">
            <p>
              When a service does not comply with accessibility requirements,
              service providers shall:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Take the corrective measures necessary to bring the service into
                conformity with the applicable accessibility requirements
              </li>
              <li>
                Immediately inform the competent national authorities of any
                identified non-compliance and the corrective measures being
                taken
              </li>
            </ul>
            <p>
              The corrective measures must be appropriate to the nature and
              impact of the non-compliance and must be implemented within a
              reasonable timeframe.
            </p>
          </div>
        </section>

        <section aria-labelledby="documentation" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="documentation">
            Documentation Requirements
          </h2>
          <div className="space-y-4">
            <p>
              Service providers must maintain documentation regarding
              accessibility that includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A general description of the service</li>
              <li>
                The criteria and methods used to ensure ongoing compliance with
                accessibility requirements
              </li>
              <li>Records of accessibility assessments carried out</li>
              <li>Documentation of any corrective measures implemented</li>
              <li>User feedback mechanisms related to accessibility</li>
            </ul>
            <p>
              This documentation must be kept up to date and available for
              inspection by competent authorities upon request.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="fundamental-alteration"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="fundamental-alteration"
          >
            Fundamental Alteration Exception
          </h2>
          <div className="space-y-4">
            <p>
              The accessibility requirements only need to be applied to the
              extent that they:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Do not require a significant change in a service that would
                result in the fundamental alteration of its basic nature
              </li>
              <li>
                Do not impose a disproportionate burden on the service provider
              </li>
            </ul>
            <p>
              Service providers claiming either exception must perform and
              document an assessment to justify their claim. The assessment must
              consider:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The relationship between the costs of compliance and the overall
                resources of the service provider
              </li>
              <li>
                The estimated costs and benefits for the service provider in
                relation to the estimated benefit for persons with disabilities
              </li>
              <li>The type and frequency of use of the particular service</li>
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="microenterprise-exemption"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="microenterprise-exemption"
          >
            Microenterprise Exemption
          </h2>
          <div className="space-y-4">
            <p>
              Microenterprises (fewer than 10 employees and annual turnover
              and/or annual balance sheet total of €2M or less) providing
              services are exempt from complying with the accessibility
              requirements and from having to document their assessment
              regarding disproportionate burden.
            </p>
            <p>
              However, microenterprises that provide services must still comply
              with any national rules implementing the Directive. Additionally,
              upon request from a competent authority, microenterprises must
              provide information relevant to assess compliance with applicable
              accessibility requirements.
            </p>
          </div>
        </section>

        <section aria-labelledby="cooperation" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="cooperation">
            Cooperation with Authorities
          </h2>
          <div className="space-y-4">
            <p>
              Service providers shall, further to a reasoned request from a
              competent authority, provide it with all information necessary to
              demonstrate the conformity of the service with the applicable
              accessibility requirements.
            </p>
            <p>
              They shall cooperate with that authority on any action taken to
              bring the service into compliance with those requirements. This
              cooperation may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing access to service documentation</li>
              <li>Sharing details of accessibility assessments conducted</li>
              <li>Outlining corrective measures undertaken</li>
              <li>
                Participating in any investigation or audit conducted by the
                authority
              </li>
            </ul>
          </div>
        </section>

        <nav
          className="flex justify-between mt-10 pt-4 border-t"
          aria-label="Chapter navigation"
        >
          <Link
            href="/eaa/2.5-obligations-distributors"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            ← Distributors' Obligations
          </Link>
          <Link
            href="/eaa/3.1-conformity-assessment"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Conformity Assessment →
          </Link>
        </nav>
      </div>
    </main>
  )
}
