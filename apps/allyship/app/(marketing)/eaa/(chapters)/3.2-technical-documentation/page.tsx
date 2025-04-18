import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technical Documentation | European Accessibility Act',
  description:
    'Guidelines for creating and maintaining technical documentation that demonstrates compliance with the European Accessibility Act accessibility requirements.',
}

export default function TechnicalDocumentationPage() {
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

      <h1 className="text-4xl font-bold mb-8">Technical Documentation</h1>

      <div className="space-y-8">
        <section aria-labelledby="purpose" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="purpose">
            Purpose and Importance
          </h2>
          <div className="space-y-4">
            <p>
              Technical documentation is a critical component of demonstrating
              compliance with the European Accessibility Act (EAA). It serves as
              the primary evidence that a product or service meets the
              accessibility requirements and that all necessary conformity
              assessment procedures have been followed.
            </p>
            <p>Well-prepared technical documentation allows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Economic operators to demonstrate compliance with legal
                requirements
              </li>
              <li>Market surveillance authorities to verify compliance</li>
              <li>Transparent communication about accessibility features</li>
              <li>Consistent approach to accessibility implementation</li>
              <li>
                Traceability of design and development decisions related to
                accessibility
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="required-content" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="required-content">
            Required Content
          </h2>
          <div className="space-y-4">
            <p>
              According to the EAA, technical documentation must contain at
              least the following elements:
            </p>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <h3 className="text-xl font-medium mb-2">
                  General Description
                </h3>
                <p>
                  A comprehensive description of the product or service,
                  including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Intended use and user groups</li>
                  <li>Key features and functions</li>
                  <li>Physical characteristics for products</li>
                  <li>Delivery methods for services</li>
                  <li>Operational environments</li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">
                  List of Applied Standards
                </h3>
                <p>A complete list of:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Harmonized standards applied in full or in part</li>
                  <li>Technical specifications referenced</li>
                  <li>Other relevant standards or guidelines followed</li>
                  <li>
                    Clear indication of which parts of standards were applied
                  </li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">
                  Design Documentation
                </h3>
                <p>
                  Documentation related to design processes that affect
                  accessibility:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Design specifications with accessibility requirements</li>
                  <li>User interface designs and wireframes</li>
                  <li>Accessibility considerations in the design process</li>
                  <li>Design reviews and accessibility evaluation results</li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">
                  Technical Solutions
                </h3>
                <p>
                  Detailed description of solutions adopted to meet the
                  accessibility requirements:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Implementation details for each accessibility requirement
                  </li>
                  <li>Alternative solutions for different user needs</li>
                  <li>
                    Technical approaches to achieve accessibility compliance
                  </li>
                  <li>Explanations of how solutions meet the requirements</li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">
                  Design Calculations and Assessments
                </h3>
                <p>
                  Results of relevant assessments conducted during design and
                  development:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Risk assessments related to accessibility</li>
                  <li>Expert reviews and evaluations</li>
                  <li>Calculations and engineering analyses</li>
                  <li>Compatibility testing with assistive technologies</li>
                </ul>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">Test Reports</h3>
                <p>
                  Comprehensive documentation of testing conducted to verify
                  accessibility:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Accessibility test plans and methodologies</li>
                  <li>Test results with identified issues and resolutions</li>
                  <li>User testing with persons with disabilities</li>
                  <li>
                    Third-party testing or certification results when applicable
                  </li>
                  <li>Automated and manual testing documentation</li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        <section aria-labelledby="format-organization" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="format-organization">
            Format and Organization
          </h2>
          <div className="space-y-4">
            <p>
              While the EAA does not prescribe a specific format for technical
              documentation, it should be:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Clear and structured:</strong> Well-organized with a
                logical flow and clear section headings
              </li>
              <li>
                <strong>Comprehensive:</strong> Covering all relevant aspects of
                accessibility compliance
              </li>
              <li>
                <strong>Traceable:</strong> With proper version control and
                change history
              </li>
              <li>
                <strong>Accessible:</strong> Available in formats that can be
                reviewed by market surveillance authorities
              </li>
              <li>
                <strong>Consistent:</strong> Using standard terminology and
                reference frameworks
              </li>
            </ul>
            <p>Best practices for documentation organization include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Including a table of contents and document control information
              </li>
              <li>Grouping related information into clear sections</li>
              <li>
                Using appendices for detailed test results or additional
                technical information
              </li>
              <li>Providing cross-references between related sections</li>
              <li>Including a glossary of technical terms and abbreviations</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="maintenance" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="maintenance">
            Maintenance and Updates
          </h2>
          <div className="space-y-4">
            <p>
              Technical documentation is not a static document but needs to be
              maintained throughout the product lifecycle or service provision
              period:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Regular reviews:</strong> Documentation should be
                reviewed periodically to ensure it remains accurate
              </li>
              <li>
                <strong>Update triggers:</strong> Documentation must be updated
                when:
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    Product or service changes affect accessibility features
                  </li>
                  <li>New versions or models are released</li>
                  <li>Applicable standards or regulations change</li>
                  <li>
                    Issues are identified through market feedback or
                    surveillance
                  </li>
                </ul>
              </li>
              <li>
                <strong>Version control:</strong> A clear system for tracking
                document versions and changes
              </li>
              <li>
                <strong>Change logs:</strong> Documentation of what was changed,
                when, and why
              </li>
            </ul>
            <p>
              Economic operators must keep technical documentation updated and
              available for inspection for at least five years after the last
              product of the model has been placed on the market or the service
              has been provided.
            </p>
          </div>
        </section>

        <section aria-labelledby="responsibility" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="responsibility">
            Responsibility and Availability
          </h2>
          <div className="space-y-4">
            <p>
              The responsibility for creating and maintaining technical
              documentation falls primarily on:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Manufacturers:</strong> For products they design and
                produce
              </li>
              <li>
                <strong>Service providers:</strong> For services they design and
                deliver
              </li>
            </ul>
            <p>Other economic operators have related responsibilities:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Importers:</strong> Must ensure that manufacturers have
                drawn up proper technical documentation before placing products
                on the EU market
              </li>
              <li>
                <strong>Distributors:</strong> Must verify that products bear
                proper markings indicating that appropriate documentation exists
              </li>
            </ul>
            <p>
              Technical documentation must be made available to competent
              national authorities upon request. It should be:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Readily available within a reasonable timeframe (typically 10-30
                days of request)
              </li>
              <li>
                Provided in an official language of the Member State where the
                request is made, or in another language acceptable to the
                authority
              </li>
              <li>Complete and up-to-date at the time of request</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="confidentiality" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="confidentiality">
            Confidentiality Considerations
          </h2>
          <div className="space-y-4">
            <p>
              While technical documentation must be provided to authorities,
              there are provisions for protecting confidential business
              information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Market surveillance authorities are required to respect
                confidentiality when handling technical documentation
              </li>
              <li>
                Economic operators can identify which parts of the documentation
                contain confidential business information or intellectual
                property
              </li>
              <li>
                Confidentiality requirements do not prevent sharing information
                necessary for ensuring compliance with accessibility
                requirements
              </li>
            </ul>
            <p>
              It's recommended to structure documentation in a way that
              separates confidential technical details from general information
              about accessibility features and compliance approaches.
            </p>
          </div>
        </section>

        <section aria-labelledby="exemptions" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="exemptions">
            Documentation for Exemptions
          </h2>
          <div className="space-y-4">
            <p>
              When claiming exemptions from accessibility requirements under
              provisions for fundamental alteration or disproportionate burden,
              additional documentation is required:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Fundamental alteration:</strong> Documentation
                explaining how meeting accessibility requirements would
                fundamentally alter the basic nature of the product or service
              </li>
              <li>
                <strong>Disproportionate burden:</strong> Detailed assessment
                including:
                <ul className="list-disc pl-6 mt-2">
                  <li>Cost-benefit analysis</li>
                  <li>
                    Estimated costs and benefits for the economic operator
                  </li>
                  <li>Estimated benefits for persons with disabilities</li>
                  <li>Organization size, resources, and nature</li>
                </ul>
              </li>
              <li>
                <strong>Microenterprise exemption:</strong> For service
                providers, documentation of meeting the microenterprise
                definition (fewer than 10 employees and annual turnover/balance
                sheet ≤ €2 million)
              </li>
            </ul>
            <p>
              This documentation must be retained and updated when the
              assessment is reviewed, which must occur at least every five years
              or when changes to the product or service are made.
            </p>
          </div>
        </section>

        <nav
          className="flex justify-between mt-10 pt-4 border-t"
          aria-label="Chapter navigation"
        >
          <Link
            href="/eaa/3.1-conformity-assessment"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            ← Conformity Assessment
          </Link>
          <Link
            href="/eaa/3.3-eu-declaration"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            EU Declaration of Conformity →
          </Link>
        </nav>
      </div>
    </main>
  )
}
