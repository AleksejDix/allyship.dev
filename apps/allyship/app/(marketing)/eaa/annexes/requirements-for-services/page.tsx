import React from 'react'
import { Metadata } from 'next'
import { RouterLink } from '../../components/RouterLink'

export const metadata: Metadata = {
  title: 'Annex III: Requirements for Services - European Accessibility Act',
  description:
    'Learn about the specific accessibility requirements for services under the European Accessibility Act (EAA) Annex III.',
}

export default function RequirementsForServices() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <RouterLink
          href="/eaa/annexes"
          className="text-blue-600 hover:underline mb-4 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Annexes
        </RouterLink>
        <h1 className="text-3xl font-bold mt-4">
          Annex III: Requirements for Services
        </h1>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview
          </h2>
          <div className="prose max-w-none">
            <p>
              Annex III of the European Accessibility Act (EAA) outlines
              specific requirements for services to make them more accessible to
              persons with disabilities. These requirements aim to ensure that
              service providers deliver their services in ways that maximize
              usability for people with various types of disabilities.
            </p>
            <p>
              The requirements in this Annex complement those in Annex I and
              provide more detailed guidelines for service providers to follow
              when designing and delivering their services.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="service-requirements">
            Service Requirements
          </h2>
          <div className="prose max-w-none">
            <p>
              The EAA establishes the following key requirements for services:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              1. Information Provision
            </h3>
            <ul>
              <li>
                Information about the functioning of the service must be
                provided in multiple accessible formats
              </li>
              <li>
                Electronic information, including websites and mobile
                applications, must comply with accessibility requirements
              </li>
              <li>
                Explanations about how the service can be used with assistive
                devices must be provided
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              2. User Interface and Functionality
            </h3>
            <ul>
              <li>
                Service interfaces must be perceivable, operable,
                understandable, and robust
              </li>
              <li>
                Digital services must be compatible with assistive technologies
              </li>
              <li>
                Services must offer alternatives to gesture-based operations for
                users with mobility disabilities
              </li>
              <li>
                Services must avoid triggering seizures and provide alternatives
                to color-based signaling
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              3. Support Services
            </h3>
            <ul>
              <li>
                Help desks, call centers, and technical support services must
                provide information about the service's accessibility
              </li>
              <li>
                Support services must be accessible through multiple
                communication channels
              </li>
              <li>
                Support documentation must be available in accessible formats
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="sector-specific-requirements"
          >
            Sector-Specific Requirements
          </h2>
          <div className="prose max-w-none">
            <p>
              Annex III also includes specific requirements for different
              service sectors covered by the EAA:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              E-commerce Services
            </h3>
            <ul>
              <li>Product descriptions must include accessibility features</li>
              <li>Checkout processes must be accessible</li>
              <li>
                Identification and payment methods must offer accessible
                alternatives
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Banking Services
            </h3>
            <ul>
              <li>
                Authentication methods must include accessible alternatives
              </li>
              <li>
                Financial information and statements must be understandable
              </li>
              <li>
                ATMs and payment terminals must have accessible interfaces
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Electronic Communications
            </h3>
            <ul>
              <li>Text communication must be provided in real-time</li>
              <li>Video communication must support sign language</li>
              <li>
                Emergency communications must be accessible through multiple
                means
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">Media Services</h3>
            <ul>
              <li>Electronic program guides must be accessible</li>
              <li>
                Content selection and control mechanisms must be usable by all
              </li>
              <li>
                Accessibility features like subtitles and audio description must
                be properly transmitted
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="implementation">
            Implementation Guidelines
          </h2>
          <div className="prose max-w-none">
            <p>
              To successfully implement the requirements in Annex III, service
              providers should:
            </p>
            <ul>
              <li>Conduct accessibility audits of their existing services</li>
              <li>
                Include persons with disabilities in testing and feedback
                processes
              </li>
              <li>Train staff on accessibility awareness and support</li>
              <li>Document accessibility features and limitations</li>
              <li>Create an accessibility statement for each service</li>
              <li>
                Establish a process for addressing accessibility feedback and
                complaints
              </li>
            </ul>
            <p>
              Service providers should integrate accessibility considerations
              into their service design process from the beginning, rather than
              treating it as an add-on feature.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="relationship-to-standards"
          >
            Relationship to Standards
          </h2>
          <div className="prose max-w-none">
            <p>
              The requirements in Annex III align with several international
              standards, including:
            </p>
            <ul>
              <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
              <li>EN 301 549 V3.2.1 (2021-03) for ICT products and services</li>
              <li>ISO/IEC 24756 for accessibility in user interfaces</li>
            </ul>
            <p>
              Service providers who already comply with these standards will
              have a solid foundation for meeting the requirements of Annex III,
              though they should review the specific EAA requirements to ensure
              full compliance.
            </p>
          </div>
        </section>
      </div>

      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Related Resources</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          <li>
            <RouterLink
              href="/eaa/guides/web-accessibility"
              className="hover:underline block p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Web Accessibility Guide
            </RouterLink>
          </li>
          <li>
            <RouterLink
              href="/eaa/guides/mobile-accessibility"
              className="hover:underline block p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Mobile Accessibility Guide
            </RouterLink>
          </li>
          <li>
            <RouterLink
              href="/eaa/guides/accessible-banking"
              className="hover:underline block p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Accessible Banking Services
            </RouterLink>
          </li>
          <li>
            <RouterLink
              href="/eaa/guides/accessible-media"
              className="hover:underline block p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Accessible Media Services
            </RouterLink>
          </li>
        </ul>
      </section>
    </div>
  )
}
