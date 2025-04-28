import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { PAGES } from '../../constants/links'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Complaint Systems | European Accessibility Act',
  description:
    'Understanding the complaint handling systems required under the European Accessibility Act (EAA) for addressing accessibility concerns with products and services.',
}

export default function ComplaintSystemsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Complaint Systems.
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
                  href="#legal-requirements"
                  id="legal-requirements-link"
                >
                  Legal Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#complaint-handling-process"
                  id="complaint-handling-process-link"
                >
                  Complaint Handling Process.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#accessibility-requirements"
                  id="accessibility-requirements-link"
                >
                  Accessibility Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#operator-responsibilities"
                  id="operator-responsibilities-link"
                >
                  Operator Responsibilities.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#best-practices"
                  id="best-practices-link"
                >
                  Best Practices.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert py-4 pt-2"
        id="eaa-content"
        aria-labelledby="page-title"
      >
        <div className="space-y-8">
          <section aria-labelledby="overview-heading">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act (EAA) requires the establishment
                of effective complaint systems to ensure that accessibility
                issues with products and services can be addressed. These
                systems serve as a crucial feedback mechanism and enforcement
                tool, allowing persons with disabilities and other stakeholders
                to report non-compliance with accessibility requirements.
              </p>
              <p>
                Effective complaint systems under the EAA have several key
                purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Identifying non-compliant products and services</li>
                <li>
                  Providing redress for consumers facing accessibility barriers
                </li>
                <li>Gathering data on common accessibility challenges</li>
                <li>Supporting market surveillance activities</li>
                <li>
                  Promoting continuous improvement in accessibility practices
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="legal-requirements-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="legal-requirements"
              tabIndex={-1}
            >
              Legal Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA establishes specific requirements for complaint systems
                at both the national and operator levels:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Member State requirements</strong> - Each EU Member
                  State must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Establish procedures for handling complaints about
                      accessibility non-compliance
                    </li>
                    <li>
                      Designate authorities responsible for receiving and
                      processing complaints
                    </li>
                    <li>
                      Ensure complaints can lead to appropriate enforcement
                      actions
                    </li>
                    <li>
                      Provide transparent information about complaint procedures
                      to the public
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Economic operator obligations</strong> -
                  Manufacturers, importers, distributors, and service providers
                  must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Implement procedures to address complaints about
                      accessibility issues
                    </li>
                    <li>Maintain records of complaints and their resolution</li>
                    <li>
                      Take corrective actions when valid accessibility
                      complaints are received
                    </li>
                    <li>Cooperate with authorities investigating complaints</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="complaint-handling-process-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="complaint-handling-process"
              tabIndex={-1}
            >
              Complaint Handling Process.
            </h2>
            <div className="space-y-4">
              <p>
                While specific procedures may vary between Member States, the
                typical complaint handling process under the EAA includes:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Submission</strong> - Consumers submit complaints
                  about accessibility issues through designated channels (online
                  forms, email, telephone, or in person)
                </li>
                <li>
                  <strong>Initial assessment</strong> - Authorities or economic
                  operators evaluate whether the complaint falls within the
                  scope of the EAA
                </li>
                <li>
                  <strong>Investigation</strong> - Relevant information is
                  gathered, including technical documentation and accessibility
                  assessments
                </li>
                <li>
                  <strong>Determination</strong> - A decision is made regarding
                  whether the product or service complies with accessibility
                  requirements
                </li>
                <li>
                  <strong>Corrective action</strong> - If non-compliance is
                  found, appropriate measures are required, such as:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Modifications to make the product or service accessible
                    </li>
                    <li>
                      Withdrawal of non-compliant products from the market
                    </li>
                    <li>
                      Penalties or sanctions in cases of serious non-compliance
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Follow-up</strong> - Monitoring to ensure that
                  corrective actions are implemented effectively
                </li>
                <li>
                  <strong>Feedback</strong> - Communication with the complainant
                  about the outcome and actions taken
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="accessibility-requirements-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="accessibility-requirements"
              tabIndex={-1}
            >
              Accessibility Requirements for Complaint Systems.
            </h2>
            <div className="space-y-4">
              <p>
                Complaint systems themselves must be accessible to ensure that
                persons with disabilities can effectively report accessibility
                issues. Key accessibility requirements include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Multiple contact channels</strong> - Providing various
                  ways to submit complaints (digital, telephone, in-person) to
                  accommodate different disabilities and preferences
                </li>
                <li>
                  <strong>Digital accessibility</strong> - Ensuring online
                  complaint forms and portals comply with web accessibility
                  standards (WCAG)
                </li>
                <li>
                  <strong>Alternative formats</strong> - Making complaint
                  information available in accessible formats (large print,
                  Braille, audio, easy-to-read)
                </li>
                <li>
                  <strong>Assistance availability</strong> - Providing support
                  for persons who need help filing complaints
                </li>
                <li>
                  <strong>Clear communication</strong> - Using plain language in
                  all communications about the complaint process and outcomes
                </li>
                <li>
                  <strong>Reasonable accommodation</strong> - Making adjustments
                  to the complaint procedure when needed to ensure accessibility
                </li>
              </ul>
              <p>
                These requirements ensure that the very systems designed to
                address accessibility issues don't create additional barriers
                for the people they are intended to serve.
              </p>
            </div>
          </section>

          <section aria-labelledby="operator-responsibilities-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="operator-responsibilities"
              tabIndex={-1}
            >
              Operator Responsibilities.
            </h2>
            <div className="space-y-4">
              <p>
                Economic operators have specific responsibilities regarding
                complaint handling:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Manufacturers</strong> must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Establish procedures to register and track accessibility
                      complaints
                    </li>
                    <li>
                      Inform distributors and importers about complaint
                      monitoring systems
                    </li>
                    <li>
                      Investigate accessibility complaints and maintain a
                      register
                    </li>
                    <li>
                      Take appropriate corrective measures for non-compliant
                      products
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Importers</strong> must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Forward complaints to manufacturers when appropriate
                    </li>
                    <li>
                      Keep manufacturers informed about implemented monitoring
                    </li>
                    <li>
                      Maintain their own complaint registers when acting as
                      representatives
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Distributors</strong> must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Forward complaints to manufacturers or importers</li>
                    <li>Cooperate in providing information to authorities</li>
                    <li>
                      Take corrective actions within their scope of activity
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Service providers</strong> must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Establish accessible complaint procedures for their
                      services
                    </li>
                    <li>
                      Address accessibility barriers identified through
                      complaints
                    </li>
                    <li>Document how complaints have been addressed</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="best-practices-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="best-practices"
              tabIndex={-1}
            >
              Best Practices.
            </h2>
            <div className="space-y-4">
              <p>
                Beyond the minimum legal requirements, organizations can
                implement these best practices for effective complaint systems:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>User-centered design</strong> - Involve persons with
                  disabilities in designing complaint systems
                </li>
                <li>
                  <strong>Clear timeframes</strong> - Establish and communicate
                  expected response times for different complaint stages
                </li>
                <li>
                  <strong>Training staff</strong> - Ensure personnel handling
                  complaints understand accessibility requirements and
                  disability etiquette
                </li>
                <li>
                  <strong>Systematic tracking</strong> - Implement systems to
                  track complaint patterns to identify recurring issues
                </li>
                <li>
                  <strong>Proactive monitoring</strong> - Use complaint data to
                  improve products and services before problems escalate
                </li>
                <li>
                  <strong>Regular auditing</strong> - Periodically review the
                  effectiveness of the complaint handling system
                </li>
                <li>
                  <strong>Transparent reporting</strong> - Publish anonymized
                  data about accessibility complaints and resolutions
                </li>
                <li>
                  <strong>Stakeholder engagement</strong> - Collaborate with
                  disability organizations to improve complaint procedures
                </li>
              </ul>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="6.3-complaint-systems" />
          </footer>
        </div>
      </div>
    </section>
  )
}
