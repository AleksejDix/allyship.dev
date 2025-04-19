import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  COMPLIANCE_LINKS,
  ANNEXES_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Compliance of Services | European Accessibility Act',
  description:
    'Learn about compliance requirements for services under the European Accessibility Act (EAA) and how service providers demonstrate conformity.',
}

export default function ServiceCompliancePage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Compliance of Services
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview and Purpose
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#demonstrating-compliance"
                  id="demonstrating-compliance-link"
                >
                  Demonstrating Compliance
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#assessment-methods"
                  id="assessment-methods-link"
                >
                  Assessment Methods
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#authority-checks"
                  id="authority-checks-link"
                >
                  Authority Checks of Services
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#corrective-actions"
                  id="corrective-actions-link"
                >
                  Corrective Actions
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#exceptions"
                  id="exceptions-link"
                >
                  Exceptions and Microenterprises
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2">
        <div className="space-y-8">
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview and Purpose
            </h2>
            <div className="space-y-4">
              <p>
                Under the European Accessibility Act, service providers must
                ensure their services comply with the applicable accessibility
                requirements. The approach to compliance for services differs
                from that for products, as services do not undergo CE marking
                but still require conformity assessment.
              </p>
              <p>
                The compliance framework for services aims to ensure that
                persons with disabilities can access and use services on an
                equal basis with others, while providing a flexible and
                proportionate approach for service providers to demonstrate
                conformity.
              </p>
              <p>
                Service compliance is essential to achieving the EAA's goal of
                improving the functioning of the internal market for accessible
                services while ensuring consistent accessibility standards
                across all Member States.
              </p>
            </div>
          </section>

          <section aria-labelledby="demonstrating-compliance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="demonstrating-compliance"
              tabIndex={-1}
            >
              Demonstrating Compliance
            </h2>
            <div className="space-y-4">
              <p>
                According to the EAA, service providers demonstrate compliance
                through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Providing information in general terms and conditions, or
                  equivalent documents, explaining how the service meets the
                  applicable accessibility requirements
                </li>
                <li>
                  Describing the applicable accessibility requirements and how
                  they are met in the service's documentation
                </li>
                <li>
                  Preparing and maintaining detailed technical documentation
                  regarding the service's accessibility features
                </li>
                <li>
                  Making this information available to the public in written and
                  oral format, including in a manner accessible to persons with
                  disabilities
                </li>
                <li>
                  Retaining this documentation for a period of five years after
                  the service was last provided
                </li>
              </ul>
              <p>
                This documentation-based approach allows service providers to
                self-assess and demonstrate their compliance without requiring
                third-party certification in most cases.
              </p>
            </div>
          </section>

          <section aria-labelledby="assessment-methods">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="assessment-methods"
              tabIndex={-1}
            >
              Assessment Methods
            </h2>
            <div className="space-y-4">
              <p>
                Service providers can use various methods to assess and ensure
                compliance with accessibility requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Self-assessment</strong> - Evaluating the service
                  against the applicable accessibility requirements and
                  documenting the results
                </li>
                <li>
                  <strong>User testing</strong> - Involving persons with
                  disabilities in testing and providing feedback on
                  accessibility features
                </li>
                <li>
                  <strong>Expert evaluation</strong> - Engaging accessibility
                  experts to review and assess the service against requirements
                </li>
                <li>
                  <strong>Conformity with standards</strong> - Demonstrating
                  compliance with harmonized standards or technical
                  specifications to create a presumption of conformity
                </li>
                <li>
                  <strong>Continuous monitoring</strong> - Implementing ongoing
                  processes to maintain accessibility as the service evolves
                </li>
              </ul>
              <p>
                Service providers should document these assessment activities
                and their results as part of their compliance documentation.
              </p>
            </div>
          </section>

          <section aria-labelledby="authority-checks">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="authority-checks"
              tabIndex={-1}
            >
              Authority Checks of Services
            </h2>
            <div className="space-y-4">
              <p>
                Member States are responsible for checking compliance of
                services with the EAA requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Member States must designate authorities responsible for
                  checking compliance of services
                </li>
                <li>
                  These authorities verify that service providers have conducted
                  appropriate assessments of their services
                </li>
                <li>
                  They check that documentation demonstrating compliance is
                  accurate and complete
                </li>
                <li>
                  Authorities follow up on complaints or reports related to
                  non-compliance
                </li>
                <li>
                  They verify that any claimed exceptions based on
                  disproportionate burden are properly documented and justified
                </li>
                <li>
                  Where non-compliance is found, authorities ensure that
                  corrective action is taken
                </li>
              </ul>
              <p>
                The EAA recommends that Member States establish clear procedures
                for checking compliance of services and ensure that authorities
                have sufficient resources to carry out their tasks effectively.
              </p>
            </div>
          </section>

          <section aria-labelledby="corrective-actions">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="corrective-actions"
              tabIndex={-1}
            >
              Corrective Actions
            </h2>
            <div className="space-y-4">
              <p>
                When non-compliance is identified, service providers must take
                appropriate corrective actions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Take immediate corrective measures to bring the service into
                  conformity with applicable accessibility requirements
                </li>
                <li>
                  Cease provision of the service if it presents a risk related
                  to accessibility (where appropriate)
                </li>
                <li>
                  Inform the competent national authorities about the
                  non-compliance and corrective measures taken
                </li>
                <li>
                  Cooperate with authorities on any measures to ensure
                  compliance
                </li>
                <li>
                  Document the corrective measures taken and their outcomes
                </li>
                <li>
                  Implement preventive measures to avoid similar non-compliance
                  issues in the future
                </li>
              </ul>
              <p>
                Authorities may require additional corrective measures if those
                taken by the service provider are deemed insufficient to address
                the non-compliance.
              </p>
            </div>
          </section>

          <section aria-labelledby="exceptions">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="exceptions"
              tabIndex={-1}
            >
              Exceptions and Microenterprises
            </h2>
            <div className="space-y-4">
              <p>
                The EAA provides for certain exceptions to service compliance
                requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Disproportionate burden</strong> - Service providers
                  may be exempt from meeting certain requirements if they can
                  demonstrate this would impose a disproportionate burden
                </li>
                <li>
                  <strong>Fundamental alteration</strong> - Requirements need
                  not be met if they would require a fundamental alteration in
                  the nature of the service
                </li>
                <li>
                  <strong>Microenterprises</strong> - Service providers that are
                  microenterprises (fewer than 10 persons and annual turnover or
                  balance sheet not exceeding €2 million) are exempt from
                  compliance requirements
                </li>
              </ul>
              <p>
                Even when claiming an exception, service providers must document
                their assessment of disproportionate burden or fundamental
                alteration, and microenterprises must notify authorities if
                requested.
              </p>
              <p>
                For more information about disproportionate burden assessments,
                see the
                <Link
                  href={ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Annex IV: Disproportionate Burden Assessment
                </Link>{' '}
                page.
              </p>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation
              </h2>
              <Button asChild id="next-chapter-button">
                <Link
                  href={COMPLIANCE_LINKS.NON_COMPLIANCE.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Non-Compliance Procedures</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Button>
            </nav>
          </footer>
        </div>
      </div>
    </section>
  )
}
