import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { PAGES } from '../../constants/links'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Conformity and Compliance | European Accessibility Act',
  description:
    'How to ensure conformity with accessibility requirements and demonstrate compliance under the European Accessibility Act (EAA).',
}

export default function ConformityAndCompliancePage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Conformity and Compliance.
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
                  href="#product-conformity"
                  id="product-conformity-link"
                >
                  Product Conformity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#service-conformity"
                  id="service-conformity-link"
                >
                  Service Conformity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#documenting-conformity"
                  id="documenting-conformity-link"
                >
                  Documenting Conformity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#standards-guidelines"
                  id="standards-guidelines-link"
                >
                  Standards and Guidelines.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#enforcement"
                  id="enforcement-link"
                >
                  Enforcement and Monitoring.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2"
        id="eaa-content"
      >
        <div className="space-y-8">
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview of Conformity and Compliance.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act requires businesses to ensure
                their products and services are accessible to people with
                disabilities. To demonstrate this, the EAA establishes specific
                conformity procedures and compliance documentation.
              </p>
              <p>
                Conformity is the process of ensuring products and services meet
                the accessibility requirements set out in the EAA. Compliance
                refers to following all the procedural and documentation
                obligations required by the law.
              </p>
              <p>
                This chapter explains the specific procedures, documentation,
                and standards that different business operators must follow to
                demonstrate conformity with the EAA's accessibility
                requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="product-conformity">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="product-conformity"
              tabIndex={-1}
            >
              Product Conformity.
            </h2>
            <div className="space-y-4">
              <p>
                For physical products, the EAA establishes a conformity
                assessment procedure similar to other EU product legislation.
                Key elements include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Technical documentation</strong> showing how the
                  product meets accessibility requirements
                </li>
                <li>
                  <strong>Internal production control</strong> (Module A) as
                  described in Annex IV
                </li>
                <li>
                  <strong>EU Declaration of Conformity</strong> formally
                  declaring compliance
                </li>
                <li>
                  <strong>CE marking</strong> applied to products that meet
                  requirements
                </li>
              </ul>
              <p className="mt-4">
                <Link
                  href={PAGES['5.1-product-conformity']?.fullPath || '#'}
                  className="text-blue-600 hover:underline"
                >
                  Learn more about product conformity →
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="service-conformity">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="service-conformity"
              tabIndex={-1}
            >
              Service Conformity.
            </h2>
            <div className="space-y-4">
              <p>
                Service providers follow a different process than product
                manufacturers. Their key obligations include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service assessment</strong> against the EAA's
                  accessibility requirements
                </li>
                <li>
                  <strong>Documentation</strong> explaining how the service
                  meets requirements
                </li>
                <li>
                  <strong>Public information</strong> about the service's
                  accessibility features
                </li>
                <li>
                  <strong>Ongoing monitoring</strong> to ensure continued
                  accessibility
                </li>
              </ul>
              <p className="mt-4">
                <Link
                  href={PAGES['5.2-service-conformity']?.fullPath || '#'}
                  className="text-blue-600 hover:underline"
                >
                  Learn more about service conformity →
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="documenting-conformity">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="documenting-conformity"
              tabIndex={-1}
            >
              Documenting Conformity.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA requires specific documentation to demonstrate
                conformity:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>EU Declaration of Conformity</strong> - A legal
                  document stating that a product meets all accessibility
                  requirements
                </li>
                <li>
                  <strong>Technical documentation</strong> - Detailed records of
                  how products meet the requirements
                </li>
                <li>
                  <strong>CE marking</strong> - A visual indicator that a
                  product complies with EU legislation
                </li>
                <li>
                  <strong>Service accessibility statements</strong> -
                  Information about how services meet requirements
                </li>
              </ul>
              <p className="mt-4">
                These documents must be kept for at least 5 years after a
                product is placed on the market or a service is provided.
              </p>
            </div>
          </section>

          <section aria-labelledby="standards-guidelines">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="standards-guidelines"
              tabIndex={-1}
            >
              Standards and Guidelines.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA works with harmonized standards to simplify conformity:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Harmonized standards</strong> provide a presumption of
                  conformity
                </li>
                <li>
                  <strong>Technical specifications</strong> can be used when no
                  harmonized standards exist
                </li>
                <li>
                  <strong>International standards</strong> may be referenced
                  where relevant
                </li>
              </ul>
              <p className="mt-4">
                Products and services that follow these standards are presumed
                to meet the EAA requirements covered by those standards.
              </p>
              <p>
                <Link
                  href={PAGES['5.5-harmonized-standards']?.fullPath || '#'}
                  className="text-blue-600 hover:underline"
                >
                  Learn more about harmonized standards →
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="enforcement">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="enforcement"
              tabIndex={-1}
            >
              Enforcement and Monitoring.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA includes mechanisms to ensure companies follow the
                rules:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Market surveillance</strong> by national authorities
                </li>
                <li>
                  <strong>Non-conformity procedures</strong> to address
                  non-compliant products and services
                </li>
                <li>
                  <strong>Penalties</strong> for serious or continuous
                  non-compliance
                </li>
                <li>
                  <strong>Conformity assessment procedures</strong> to verify
                  accessibility
                </li>
              </ul>
              <p className="mt-4">
                <Link
                  href={PAGES['5.6-non-conformity-procedures']?.fullPath || '#'}
                  className="text-blue-600 hover:underline"
                >
                  Learn more about non-compliance procedures →
                </Link>
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="5.0-conformity-and-compliance" />
          </footer>
        </div>
      </div>
    </section>
  )
}
