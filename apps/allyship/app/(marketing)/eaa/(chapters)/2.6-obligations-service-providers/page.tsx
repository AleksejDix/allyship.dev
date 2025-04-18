import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  OBLIGATIONS_LINKS,
  COMPLIANCE_LINKS,
  EXTERNAL_LINKS,
  ANNEXES_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Service Provider Obligations | European Accessibility Act',
  description:
    'Legal obligations for service providers under the European Accessibility Act, including digital accessibility requirements, documentation, exemptions, and compliance procedures.',
}

export default function ServiceProvidersObligationsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <div className="py-2">
            <Button asChild variant="secondary">
              <Link
                className="no-underline"
                href={INTRODUCTION_LINKS.OVERVIEW.fullPath}
                aria-labelledby="toc-button-label"
                id="toc-button"
              >
                <List size={16} aria-hidden="true" />
                <span id="toc-button-label">EAA Table of Contents</span>
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations of Service Providers
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#role-service-providers"
                  id="role-service-providers-link"
                >
                  Role of Service Providers
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#design-requirements"
                  id="design-requirements-link"
                >
                  Design Requirements
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#documentation"
                  id="documentation-link"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#non-compliance"
                  id="non-compliance-link"
                >
                  Non-Compliance
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#cooperation"
                  id="cooperation-link"
                >
                  Cooperation
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#disproportionate-burden"
                  id="disproportionate-burden-link"
                >
                  Disproportionate Burden
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#microenterprise-exemption"
                  id="microenterprise-exemption-link"
                >
                  Microenterprise Exemption
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert py-4">
        <div className="space-y-8">
          <section aria-labelledby="role-service-providers">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="role-service-providers"
              tabIndex={-1}
            >
              Role of Service Providers
            </h2>
            <div className="space-y-4">
              <p>
                Service providers have specific obligations under the European
                Accessibility Act to ensure their services are accessible to
                persons with disabilities. These obligations focus on ensuring
                that digital services and their related components meet
                established accessibility standards.
              </p>

              <div className="bg-blue-50 border border-blue-400 px-6 text-blue-800 dark:text-blue-400 dark:bg-blue-950 py-4 rounded-md mt-4">
                <h3 className="font-semibold mb-2 mt-0">Related Resources:</h3>
                <p>
                  For a comprehensive overview of all economic operators' roles
                  and responsibilities:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <Link
                      href={OBLIGATIONS_LINKS.OVERVIEW.fullPath}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      id="overview-link"
                    >
                      Overview of Economic Operators' Obligations
                    </Link>
                  </li>
                  <li>
                    <a
                      href={EXTERNAL_LINKS.OFFICIAL_EAA_TEXT}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      id="official-text-link"
                    >
                      <span>Official EAA Text (Article 13)</span>
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="design-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="design-requirements"
              tabIndex={-1}
            >
              Design and Provision Requirements
            </h2>
            <div className="space-y-4">
              <p>
                Service providers must ensure that they design and provide
                services in accordance with the accessibility requirements of
                the EAA by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Designing and providing services in accordance with the
                  accessibility requirements set out in the EAA
                </li>
                <li>
                  Preparing the necessary technical documentation to demonstrate
                  that services meet the applicable accessibility requirements
                </li>
                <li>
                  Providing information on how the service meets applicable
                  accessibility requirements
                </li>
              </ul>

              <p className="mt-4">
                For detailed guidance on accessibility requirements, see
                <Link
                  href={COMPLIANCE_LINKS.SERVICE_COMPLIANCE.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  id="service-compliance-link"
                >
                  the service compliance guidelines
                </Link>
                .
              </p>
            </div>
          </section>

          <section aria-labelledby="documentation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="documentation"
              tabIndex={-1}
            >
              Documentation and Information
            </h2>
            <div className="space-y-4">
              <p>
                Service providers are required to maintain proper documentation
                about accessibility features:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Explaining how the accessibility requirements have been met
                </li>
                <li>
                  Making this information available to the public in written and
                  oral format, including in a manner which is accessible to
                  persons with disabilities
                </li>
                <li>
                  Retaining this documentation for a period of five years after
                  the service was last provided
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="non-compliance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="non-compliance"
              tabIndex={-1}
            >
              Addressing Non-Compliance
            </h2>
            <div className="space-y-4">
              <p>
                When a service does not conform to applicable accessibility
                requirements, service providers must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Take immediate corrective measures to bring the service into
                  conformity, withdraw it, or cease its provision as appropriate
                </li>
                <li>
                  Immediately inform the competent national authorities where
                  the service presents a risk related to accessibility, giving
                  details about the non-compliance and corrective measures taken
                </li>
                <li>
                  Cooperate with competent authorities on any measures to ensure
                  compliance
                </li>
              </ul>

              <p className="mt-4">
                For more information about handling non-compliance issues, visit
                the
                <Link
                  href={COMPLIANCE_LINKS.NON_COMPLIANCE.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  id="non-compliance-procedures-link"
                >
                  non-compliance procedures page
                </Link>
                .
              </p>
            </div>
          </section>

          <section aria-labelledby="cooperation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="cooperation"
              tabIndex={-1}
            >
              Cooperation with Authorities
            </h2>
            <div className="space-y-4">
              <p>
                Service providers are obligated to cooperate with authorities
                by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Demonstrating compliance with the applicable accessibility
                  requirements, when requested
                </li>
                <li>
                  Providing all information and documentation necessary to
                  demonstrate conformity
                </li>
                <li>
                  Cooperating on any action taken to eliminate non-compliance
                  with the applicable accessibility requirements
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="disproportionate-burden">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="disproportionate-burden"
              tabIndex={-1}
            >
              Disproportionate Burden Exception
            </h2>
            <div className="space-y-4">
              <p>
                Service providers may be exempt from accessibility requirements
                if they can demonstrate that meeting them would:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Impose a disproportionate burden on them based on criteria
                  specified in Annex VI
                </li>
                <li>
                  Require a fundamental alteration in the nature of the service
                </li>
              </ul>
              <p className="mt-4">
                When claiming disproportionate burden, service providers must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Conduct an assessment of whether compliance would require a
                  fundamental change or impose a disproportionate burden
                </li>
                <li>
                  Document this assessment according to the requirements in
                  Annex VI
                </li>
                <li>
                  Re-evaluate the exemption at least every five years, or when
                  the service offering is modified
                </li>
              </ul>

              <p className="mt-4">
                For detailed guidance on assessing disproportionate burden, see
                <Link
                  href={ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  id="disproportionate-burden-link"
                >
                  Annex IV: Disproportionate Burden Assessment
                </Link>
                .
              </p>
            </div>
          </section>

          <section aria-labelledby="microenterprise-exemption">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="microenterprise-exemption"
              tabIndex={-1}
            >
              Microenterprise Exemption
            </h2>
            <div className="space-y-4">
              <p>
                Service providers that are microenterprises (fewer than 10
                persons and an annual turnover not exceeding €2 million or an
                annual balance sheet total not exceeding €2 million) are exempt
                from compliance with the accessibility requirements. However,
                they must still:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Notify the relevant market surveillance authority when
                  applying this exemption, if requested
                </li>
                <li>Provide relevant information on request</li>
              </ul>
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
                  href={COMPLIANCE_LINKS.CONFORMITY.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Conformity Assessment</span>
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
