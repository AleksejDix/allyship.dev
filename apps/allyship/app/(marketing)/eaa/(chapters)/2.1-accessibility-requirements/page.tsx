import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  OBLIGATIONS_LINKS,
  ANNEXES_LINKS,
  EXTERNAL_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Accessibility Requirements | European Accessibility Act',
  description:
    'Key accessibility requirements for products and services under the European Accessibility Act, including general principles and sector-specific provisions.',
}

export default function AccessibilityRequirementsPage() {
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
              >
                <List size={16} aria-hidden="true" />
                <span id="toc-button-label">EAA Table of Contents</span>
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-bold mb-[23px]">
            Accessibility Requirements
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#general-principles"
                  id="general-principles-link"
                >
                  General Principles
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#products-requirements"
                  id="products-requirements-link"
                >
                  Product Requirements
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#services-requirements"
                  id="services-requirements-link"
                >
                  Service Requirements
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#specific-sectors"
                  id="specific-sectors-link"
                >
                  Sector Requirements
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#annex-reference"
                  id="annex-reference-link"
                >
                  Annexes
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert py-4">
        <div className="space-y-8">
          <section aria-labelledby="general-principles">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="general-principles"
              tabIndex={-1}
            >
              General Principles
            </h2>
            <div className="space-y-4">
              <p>
                Products and services that fall within the scope of this
                Directive must be designed and produced in such a way as to
                maximize their foreseeable use by persons with disabilities and
                shall be accompanied by accessible information on their
                functioning and on their accessibility features.
              </p>
              <p>
                The accessibility requirements are formulated in terms of
                functional performance criteria, following four key principles
                derived from the{' '}
                <a
                  href={EXTERNAL_LINKS.W3C_WCAG}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  Web Content Accessibility Guidelines (WCAG)
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
                :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Perceivability:</strong> Information and user
                  interface components must be presentable to users in ways they
                  can perceive
                </li>
                <li>
                  <strong>Operability:</strong> User interface components and
                  navigation must be operable by all users
                </li>
                <li>
                  <strong>Understandability:</strong> Information and operation
                  of the user interface must be comprehensible
                </li>
                <li>
                  <strong>Robustness:</strong> Content must be robust enough to
                  be interpreted by various user agents, including assistive
                  technologies
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="products-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="products-requirements"
              tabIndex={-1}
            >
              Product Requirements
            </h2>
            <div className="space-y-4">
              <p>
                For products covered by this Directive (see{' '}
                <Link
                  href={INTRODUCTION_LINKS.SCOPE.fullPath}
                  className="underline"
                >
                  Scope and Application
                </Link>
                ), the accessibility requirements include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Providing information about the use of the product on the
                  product itself (labelling, instructions, warning) that shall
                  be:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Made available by more than one sensory channel</li>
                    <li>Presented in an understandable way</li>
                    <li>Presented to users in ways they can perceive</li>
                    <li>
                      Presented in fonts of adequate size and suitable shape
                    </li>
                  </ul>
                </li>
                <li>
                  Making the user interface of the product accessible to enable
                  persons with disabilities to perceive, operate, and understand
                  it
                </li>
                <li>
                  Ensuring compatibility with assistive technologies, including
                  hearing aids, telecoils, cochlear implants, and assistive
                  listening devices
                </li>
                <li>
                  Providing support services (help desks, call centers,
                  technical support, relay services) that provide information on
                  the accessibility of the product
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="services-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="services-requirements"
              tabIndex={-1}
            >
              Service Requirements
            </h2>
            <div className="space-y-4">
              <p>The provision of services must be ensured in a way that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Makes information available about the functioning of the
                  service and about its accessibility characteristics and
                  facilities
                </li>
                <li>
                  Makes websites accessible in a consistent and adequate way for
                  users' perception, operation, and understanding, including the
                  adaptability of content presentation and interaction
                </li>
                <li>
                  Includes functions, practices, policies, and procedures
                  targeted to address the needs of persons with disabilities
                </li>
                <li>
                  Ensures that mobile applications are accessible in a
                  consistent and adequate way for users' perception, operation
                  and understanding
                </li>
                <li>
                  Makes electronic identification, security and payment methods
                  necessary for the provision of the service understandable,
                  perceivable, operable, and robust
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="specific-sectors">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="specific-sectors"
              tabIndex={-1}
            >
              Specific Sector Requirements
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-2">
                Electronic Communications
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide real time text in addition to voice communication
                </li>
                <li>
                  Provide total conversation where video is provided in addition
                  to voice communication
                </li>
                <li>
                  Ensure that emergency communications using voice, text and
                  video are synchronized
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">
                Audiovisual Media Services
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide electronic program guides (EPGs) that are perceivable,
                  operable, understandable, and robust
                </li>
                <li>
                  Ensure that accessibility components of audiovisual media
                  services are transmitted in full
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">E-books</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Ensure that digital files use features, practices, policies,
                  and procedures that address the needs of persons with
                  disabilities
                </li>
                <li>
                  Respect the integrity of the author's work while providing
                  accessibility
                </li>
                <li>
                  Enable alternative renditions of the content and its
                  interoperability with assistive technologies
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">E-commerce</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide identification methods, electronic signatures, and
                  payment services that are perceivable, operable,
                  understandable, and robust
                </li>
                <li>
                  Make information about the functioning of the service
                  accessible
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="annex-reference">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-reference"
              tabIndex={-1}
            >
              Detailed Requirements in Annexes
            </h2>
            <div className="space-y-4">
              <p>
                The specific technical requirements are detailed in{' '}
                <Link
                  href={ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                  className="underline"
                >
                  Annex I of the Directive
                </Link>
                , which is organized into several sections:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Section I: General accessibility requirements for all products
                </li>
                <li>
                  Section II: User interface and functionality design
                  requirements for products
                </li>
                <li>
                  Section III: General accessibility requirements for all
                  services
                </li>
                <li>
                  Section IV: Additional accessibility requirements for specific
                  services
                </li>
                <li>
                  Section V: Specific accessibility requirements for emergency
                  communications
                </li>
                <li>
                  Section VI: Accessibility requirements for features, elements,
                  or functions of products and services
                </li>
                <li>Section VII: Functional performance criteria</li>
              </ul>
              <p>
                Additionally,{' '}
                <Link
                  href={ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.fullPath}
                  className="underline"
                >
                  Annex II
                </Link>{' '}
                provides non-binding examples of possible solutions that
                contribute to meeting the accessibility requirements, which
                Member States may inform economic operators about.
              </p>
              <p className="mt-6">
                For a comprehensive overview of all annexes, visit the{' '}
                <Link
                  href={ANNEXES_LINKS.OVERVIEW.fullPath}
                  className="underline"
                >
                  Annexes Overview page
                </Link>
                .
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
              <Button asChild>
                <Link
                  href={OBLIGATIONS_LINKS.OVERVIEW.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Obligations Overview</span>
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
