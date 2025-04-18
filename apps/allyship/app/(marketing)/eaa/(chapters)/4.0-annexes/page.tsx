import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  ANNEXES_LINKS,
  EXCEPTIONS_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Annexes Overview | European Accessibility Act',
  description:
    'Detailed overview of the six annexes of the European Accessibility Act (EAA) including accessibility requirements, examples, and assessment methods.',
}

export default function AnnexesPage() {
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
            Annexes of the European Accessibility Act
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview of the Annexes
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-i" id="annex-i-link">
                  Annex I: Accessibility Requirements
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-ii" id="annex-ii-link">
                  Annex II: Examples of Implementation
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-iii" id="annex-iii-link">
                  Annex III: Requirements for Built Environment
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-iv" id="annex-iv-link">
                  Annex IV: Disproportionate Burden
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-v" id="annex-v-link">
                  Annex V: Conformity Assessment
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-vi" id="annex-vi-link">
                  Annex VI: Criteria for Exceptions
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#importance"
                  id="importance-link"
                >
                  Importance of the Annexes
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert py-4">
        <div className="space-y-8">
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview of the Annexes
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act includes six annexes that provide
                detailed requirements, examples, assessment methods, and
                criteria essential for implementing the directive. These annexes
                form an integral part of the EAA and provide specific guidance
                for economic operators, conformity assessment bodies, and
                authorities.
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

          <section aria-labelledby="annex-i">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-i"
              tabIndex={-1}
            >
              Annex I: Accessibility Requirements
            </h2>
            <div className="space-y-4">
              <p>
                Provides detailed accessibility requirements for products and
                services covered by the EAA, divided into sections for different
                types of products and services.
              </p>
              <ul className="list-disc pl-6 space-y-1">
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
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex I: Accessibility Requirements
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-ii">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-ii"
              tabIndex={-1}
            >
              Annex II: Examples of Implementation
            </h2>
            <div className="space-y-4">
              <p>
                Provides non-binding examples of possible solutions to meet the
                accessibility requirements of Annex I, helping economic
                operators understand practical implementation.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Examples for product accessibility</li>
                <li>Examples for service accessibility</li>
                <li>Practical approaches to information provision</li>
                <li>Examples of accessible user interfaces</li>
                <li>Examples for specific sectors</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex II: Implementation Examples
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-iii">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-iii"
              tabIndex={-1}
            >
              Annex III: Requirements for Built Environment
            </h2>
            <div className="space-y-4">
              <p>
                Details the accessibility requirements for the built environment
                where services are provided, which Member States may choose to
                implement to improve the functioning of the internal market.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use of related spaces and facilities</li>
                <li>Approaches to buildings and entrances</li>
                <li>Paths and navigation within service areas</li>
                <li>Signage and orientation information</li>
                <li>Use of service-related facilities</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.BUILT_ENVIRONMENT.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex III: Built Environment
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-iv">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-iv"
              tabIndex={-1}
            >
              Annex IV: Disproportionate Burden
            </h2>
            <div className="space-y-4">
              <p>
                Outlines the criteria for assessing whether compliance with
                accessibility requirements would impose a disproportionate
                burden on economic operators.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  The ratio of costs of compliance to overall costs and revenues
                </li>
                <li>
                  Estimated costs and benefits compared to the benefit for
                  persons with disabilities
                </li>
                <li>The organization's size, resources, and nature</li>
                <li>
                  Impact on economic operators versus benefits for persons with
                  disabilities
                </li>
                <li>Frequency and duration of use of the product or service</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex IV: Disproportionate Burden Assessment
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-v">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-v"
              tabIndex={-1}
            >
              Annex V: Conformity Assessment
            </h2>
            <div className="space-y-4">
              <p>
                Describes the procedure for product conformity assessment,
                including internal production control procedures that
                manufacturers must follow.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Technical documentation requirements</li>
                <li>Manufacturing process and quality controls</li>
                <li>Verification of accessibility requirements</li>
                <li>Product monitoring and assessment</li>
                <li>Declaration of conformity process</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.CONFORMITY_ASSESSMENT.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex V: Conformity Assessment
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-vi">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-vi"
              tabIndex={-1}
            >
              Annex VI: Criteria for Exceptions
            </h2>
            <div className="space-y-4">
              <p>
                Provides additional criteria for assessing fundamental
                alteration and disproportionate burden, with specific
                considerations for evaluating exceptions claimed by economic
                operators.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Criteria for determining fundamental alteration</li>
                <li>
                  Additional financial considerations for disproportionate
                  burden
                </li>
                <li>Assessment of organizational impact</li>
                <li>Evaluation of claimed exceptions</li>
                <li>Documentation requirements for exception claims</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.ASSESSMENT_CRITERIA.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex VI: Criteria for Exceptions
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="importance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="importance"
              tabIndex={-1}
            >
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
                  accessibility requirements they must implement in their
                  products and services
                </li>
                <li>
                  <strong>Conformity assessment bodies</strong> – To evaluate
                  products against established accessibility criteria
                </li>
                <li>
                  <strong>Market surveillance authorities</strong> – To check
                  for compliance with the accessibility requirements
                </li>
                <li>
                  <strong>Service providers</strong> – To ensure their services
                  meet accessibility standards
                </li>
                <li>
                  <strong>Persons with disabilities</strong> – To understand
                  their rights regarding the accessibility of products and
                  services
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
                  href={ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex I: Accessibility Requirements
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
