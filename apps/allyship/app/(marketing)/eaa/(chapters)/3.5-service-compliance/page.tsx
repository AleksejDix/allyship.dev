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
            Compliance of Services.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview and Purpose.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#demonstrating-compliance"
                  id="demonstrating-compliance-link"
                >
                  Showing Compliance.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#assessment-methods"
                  id="assessment-methods-link"
                >
                  Assessment Methods.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#authority-checks"
                  id="authority-checks-link"
                >
                  Authority Checks of Services.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#corrective-actions"
                  id="corrective-actions-link"
                >
                  Corrective Actions.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#exceptions"
                  id="exceptions-link"
                >
                  Exceptions and Small Businesses.
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
              Overview and Purpose.
            </h2>
            <div className="space-y-4">
              <p>
                Under the European Accessibility Act, service providers must
                make sure their services meet the accessibility requirements.
                Services are handled differently from products. They don't need
                CE marking, but they still need conformity assessment.
              </p>
              <p>
                The compliance framework for services aims to ensure that people
                with disabilities can access and use services equally with
                others. It also provides a flexible and reasonable approach for
                service providers to show they are following the rules.
              </p>
              <p>
                Service compliance is essential to achieving the EAA's goal of
                improving the EU market for accessible services while ensuring
                consistent accessibility standards across all Member States.
              </p>
            </div>
          </section>

          <section aria-labelledby="demonstrating-compliance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="demonstrating-compliance"
              tabIndex={-1}
            >
              Showing Compliance.
            </h2>
            <div className="space-y-4">
              <p>According to the EAA, service providers show compliance by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Providing information in terms and conditions, or similar
                  documents, explaining how the service meets the accessibility
                  requirements.
                </li>
                <li>
                  Describing the accessibility requirements and how they are met
                  in the service's documentation.
                </li>
                <li>
                  Preparing and maintaining detailed technical documentation
                  about the service's accessibility features.
                </li>
                <li>
                  Making this information available to the public in written and
                  spoken format, including in ways accessible to people with
                  disabilities.
                </li>
                <li>
                  Keeping this documentation for five years after the service
                  was last provided.
                </li>
              </ul>
              <p>
                This documentation-based approach allows service providers to
                check themselves and show their compliance without needing
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
              Assessment Methods.
            </h2>
            <div className="space-y-4">
              <p>
                Service providers can use various methods to assess and ensure
                compliance with accessibility requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Self-assessment.</strong> Evaluating the service
                  against the accessibility requirements and documenting the
                  results.
                </li>
                <li>
                  <strong>User testing.</strong> Involving people with
                  disabilities in testing and providing feedback on
                  accessibility features.
                </li>
                <li>
                  <strong>Expert evaluation.</strong> Hiring accessibility
                  experts to review and assess the service against requirements.
                </li>
                <li>
                  <strong>Conformity with standards.</strong> Showing compliance
                  with harmonized standards or technical specifications to
                  create a presumption of conformity.
                </li>
                <li>
                  <strong>Ongoing monitoring.</strong> Implementing continuous
                  processes to maintain accessibility as the service changes.
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
              Authority Checks of Services.
            </h2>
            <div className="space-y-4">
              <p>
                Member States are responsible for checking compliance of
                services with the EAA requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Member States must appoint authorities responsible for
                  checking compliance of services.
                </li>
                <li>
                  These authorities verify that service providers have conducted
                  appropriate assessments of their services.
                </li>
                <li>
                  They check that documentation showing compliance is accurate
                  and complete.
                </li>
                <li>
                  Authorities follow up on complaints or reports related to
                  non-compliance.
                </li>
                <li>
                  They verify that any claimed exceptions based on
                  disproportionate burden are properly documented and justified.
                </li>
                <li>
                  Where non-compliance is found, authorities ensure that
                  corrective action is taken.
                </li>
              </ul>
              <p>
                The EAA recommends that Member States establish clear procedures
                for checking compliance of services and ensure that authorities
                have enough resources to carry out their tasks effectively.
              </p>
            </div>
          </section>

          <section aria-labelledby="corrective-actions">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="corrective-actions"
              tabIndex={-1}
            >
              Corrective Actions.
            </h2>
            <div className="space-y-4">
              <p>
                When non-compliance is identified, service providers must take
                appropriate corrective actions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Take immediate corrective measures to bring the service into
                  conformity with applicable accessibility requirements.
                </li>
                <li>
                  Stop providing the service if it presents a risk related to
                  accessibility (where appropriate).
                </li>
                <li>
                  Inform the competent national authorities about the
                  non-compliance and corrective measures taken.
                </li>
                <li>
                  Cooperate with authorities on any measures to ensure
                  compliance.
                </li>
                <li>
                  Document the corrective measures taken and their outcomes.
                </li>
                <li>
                  Implement preventive measures to avoid similar non-compliance
                  issues in the future.
                </li>
              </ul>
              <p>
                Authorities may require additional corrective measures if those
                taken by the service provider are not enough to address the
                non-compliance.
              </p>
            </div>
          </section>

          <section aria-labelledby="exceptions">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="exceptions"
              tabIndex={-1}
            >
              Exceptions and Small Businesses.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA provides for certain exceptions to service compliance
                requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Disproportionate burden.</strong> Service providers
                  may be exempt from meeting certain requirements if they can
                  show this would create too much burden.
                </li>
                <li>
                  <strong>Fundamental alteration.</strong> Requirements need not
                  be met if they would require a fundamental change in the
                  nature of the service.
                </li>
                <li>
                  <strong>Microenterprises.</strong> Service providers that are
                  very small businesses (fewer than 10 persons and annual
                  turnover or balance sheet not exceeding €2 million) are exempt
                  from compliance requirements.
                </li>
              </ul>
              <p>
                Even when claiming an exception, service providers must document
                their assessment of disproportionate burden or fundamental
                alteration, and small businesses must notify authorities if
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

          {/* Add References Section Here */}
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
              <li>
                Article 4, Paragraph 5. Microenterprise exemption for services.
              </li>
              <li>
                Article 13. Obligations of service providers, including
                demonstrating compliance and corrective actions.
              </li>
              <li>
                Article 14. Exemptions: Fundamental alteration /
                Disproportionate burden.
              </li>
              <li>Article 15. Presumption of conformity via standards.</li>
              <li>Article 23. Compliance of services - Authority checks.</li>
              <li>
                Annex V. Information on services meeting accessibility
                requirements.
              </li>
              <li>
                Recitals 81, 85. Context on service information and Member State
                checks.
              </li>
            </ul>
          </section>

          <footer>
            <nav
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation.
              </h2>
              <Button asChild id="next-chapter-button">
                <Link
                  href={COMPLIANCE_LINKS.NON_COMPLIANCE.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Non-Compliance Procedures.
                  </span>
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
