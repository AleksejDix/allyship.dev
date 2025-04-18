import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import {
  INTRODUCTION_LINKS,
  REQUIREMENTS_LINKS,
  EXTERNAL_LINKS,
} from '../../constants/links'
import { ArrowLeft, ArrowRight, ExternalLink, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

export const metadata: Metadata = {
  title: 'Scope and Application - European Accessibility Act',
  description:
    'Understanding the scope of the European Accessibility Act including covered products, services, and exemptions for microenterprises.',
}

export default function ScopePage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-20 text-left lg:text-right">
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

          <h1 className="text-4xl font-bold mb-[23px]">
            Scope and Application
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#products-covered"
                  id="products-link"
                >
                  Products Covered
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#services-covered"
                  id="services-link"
                >
                  Services Covered
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#microenterprises"
                  id="microenterprises-link"
                >
                  Microenterprises Exemption
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#built-environment"
                  id="built-environment-link"
                >
                  Built Environment
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#emergency-services"
                  id="emergency-services-link"
                >
                  Emergency Services
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#specifications"
                  id="specifications-link"
                >
                  Further Specifications
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="lg:col-span-5 prose prose-lg dark:prose-invert">
        <div className="space-y-8">
          <section aria-labelledby="products-covered">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="products-covered"
              tabIndex={-1}
            >
              Products Covered
            </h2>
            <div className="space-y-4">
              <p>
                This Directive applies to a wide range of products placed on the
                market after 28 June 2025, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Consumer general purpose computer hardware systems and
                  operating systems
                </li>
                <li>
                  Payment terminals, including both their hardware and software
                </li>
                <li>
                  Self-service terminals related to covered services:
                  <ul className="list-disc pl-6 mt-2">
                    <li>ATMs</li>
                    <li>
                      Ticketing machines issuing physical tickets granting
                      access to services
                    </li>
                    <li>Bank office queuing ticket machines</li>
                    <li>Check-in machines</li>
                    <li>Interactive information terminals</li>
                  </ul>
                </li>
                <li>
                  Consumer terminal equipment with interactive computing
                  capability used for electronic communications
                </li>
                <li>E-readers</li>
              </ul>
              <p>
                However, certain interactive self-service terminals providing
                information installed as integrated parts of vehicles,
                aircrafts, ships or rolling stock are excluded from the scope of
                this Directive, since these form part of those vehicles which
                are not covered by this Directive.
              </p>
            </div>
          </section>

          <section aria-labelledby="services-covered">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="services-covered"
              tabIndex={-1}
            >
              Services Covered
            </h2>
            <div className="space-y-4">
              <p>
                This Directive also applies to several key service categories
                provided after 28 June 2025:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Electronic communications services</li>
                <li>Services providing access to audiovisual media services</li>
                <li>
                  Certain elements of air, bus, rail, and waterborne passenger
                  transport services, including:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Websites</li>
                    <li>Mobile device-based services</li>
                    <li>Electronic ticketing</li>
                    <li>Delivery of transport service information</li>
                  </ul>
                </li>
                <li>Banking services for consumers</li>
                <li>E-books and related software</li>
                <li>E-commerce services</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="microenterprises">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="microenterprises"
              tabIndex={-1}
            >
              Microenterprises Exemption
            </h2>
            <div className="space-y-4">
              <p>
                Microenterprises providing services shall be exempt from
                complying with the accessibility requirements referred to in
                this Directive and any obligations relating to the compliance
                with those requirements.
              </p>
              <p>
                Member States shall provide guidelines and tools to
                microenterprises to facilitate the application of the national
                measures transposing this Directive. Member States shall develop
                those tools in consultation with relevant stakeholders.
              </p>
            </div>
          </section>

          <section aria-labelledby="built-environment">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="built-environment"
              tabIndex={-1}
            >
              Built Environment
            </h2>
            <div className="space-y-4">
              <p>
                Member States may decide, in the light of national conditions,
                that the built environment used by clients of services covered
                by this Directive shall comply with the accessibility
                requirements set out in Annex III, in order to maximize their
                use by persons with disabilities.
              </p>
            </div>
          </section>

          <section aria-labelledby="emergency-services">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="emergency-services"
              tabIndex={-1}
            >
              Emergency Services
            </h2>
            <div className="space-y-4">
              <p>
                Member States shall ensure that the answering of emergency
                communications to the single European emergency number '112' by
                the most appropriate PSAP, shall comply with the specific
                accessibility requirements set out in Section V of Annex I in
                the manner best suited to the national organisation of emergency
                systems.
              </p>
            </div>
          </section>

          <section aria-labelledby="specifications">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="specifications"
              tabIndex={-1}
            >
              Further Specifications
            </h2>
            <div className="space-y-4">
              <p>
                The Commission is empowered to adopt delegated acts to
                supplement Annex I by further specifying the accessibility
                requirements that, by their very nature, cannot produce their
                intended effect unless they are further specified in binding
                legal acts of the Union, such as requirements related to
                interoperability.
              </p>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-between items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation
              </h2>
              <Button asChild id="prev-chapter-button">
                <Link
                  href={INTRODUCTION_LINKS.PURPOSE_AND_DEFINITIONS.fullPath}
                  className="no-underline"
                  aria-labelledby="prev-chapter-label"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span id="prev-chapter-label">
                    EAA Purpose and Definitions
                  </span>
                </Link>
              </Button>
              <Button asChild id="next-chapter-button">
                <Link
                  href={INTRODUCTION_LINKS.EXISTING_LAW.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">EAA Existing Union Law</span>
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
