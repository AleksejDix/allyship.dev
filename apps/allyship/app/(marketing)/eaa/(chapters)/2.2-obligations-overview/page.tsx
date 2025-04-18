import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@workspace/ui/components/button'
import { ArrowLeft, ArrowRight, ExternalLink, List } from 'lucide-react'
import {
  INTRODUCTION_LINKS,
  REQUIREMENTS_LINKS,
  EXTERNAL_LINKS,
  OBLIGATIONS_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Obligations of Economic Operators | European Accessibility Act',
  description:
    'An overview of the legal obligations for manufacturers, importers, distributors and service providers under the European Accessibility Act.',
}

export default function ObligationsPage() {
  return (
    <main
      className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12"
      id="main-content"
    >
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-20 text-left lg:text-right">
          <Button asChild variant="secondary">
            <Link
              className="no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
              href={INTRODUCTION_LINKS.OVERVIEW.fullPath}
              aria-labelledby="toc-button-label"
              id="toc-button"
            >
              <List size={16} aria-hidden="true" />
              <span id="toc-button-label">EAA Table of Contents</span>
            </Link>
          </Button>

          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations of Economic Operators
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
                  href="#overview"
                  id="overview-link"
                >
                  Overview of Obligations
                </a>
              </li>
              <li>
                <a
                  className="underline hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
                  href="#manufacturers-summary"
                  id="manufacturers-link"
                >
                  Manufacturers: Key Obligations
                </a>
              </li>
              <li>
                <a
                  className="underline hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
                  href="#importers-summary"
                  id="importers-link"
                >
                  Importers: Key Obligations
                </a>
              </li>
              <li>
                <a
                  className="underline hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
                  href="#distributors-summary"
                  id="distributors-link"
                >
                  Distributors: Key Obligations
                </a>
              </li>
              <li>
                <a
                  className="underline hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
                  href="#service-providers-summary"
                  id="service-providers-link"
                >
                  Service Providers: Key Obligations
                </a>
              </li>
              <li>
                <a
                  className="underline hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
                  href="#multiple-roles"
                  id="multiple-roles-link"
                >
                  Economic Operators with Multiple Roles
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="lg:col-span-5 prose prose-lg dark:prose-invert">
        <div className="space-y-8">
          <section
            aria-labelledby="overview"
            id="overview-section"
            className="scroll-mt-16"
          >
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="overview"
              tabIndex={-1}
            >
              Overview of Obligations
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act establishes specific
                responsibilities for different actors in the supply chain to
                ensure that products and services meet the accessibility
                requirements. These obligations are tailored to the role of each
                economic operator in the market.
              </p>
              <p>
                The Directive defines four types of economic operators with
                distinct responsibilities:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Manufacturers:</strong> Any natural or legal person
                  who manufactures a product or has a product designed or
                  manufactured, and markets that product under their name or
                  trademark
                </li>
                <li>
                  <strong>Importers:</strong> Any natural or legal person
                  established within the Union who places a product from a third
                  country on the Union market
                </li>
                <li>
                  <strong>Distributors:</strong> Any natural or legal person in
                  the supply chain, other than the manufacturer or the importer,
                  who makes a product available on the market
                </li>
                <li>
                  <strong>Service Providers:</strong> Any natural or legal
                  person who provides a service on the Union market or makes
                  offers to provide such a service to consumers in the Union
                </li>
              </ul>
            </div>
          </section>

          <section
            aria-labelledby="manufacturers-summary"
            id="manufacturers-summary-section"
            className="scroll-mt-16"
          >
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="manufacturers-summary"
              tabIndex={-1}
            >
              Manufacturers: Key Obligations
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers bear the primary responsibility for ensuring that
                products comply with the accessibility requirements. Their key
                obligations include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Ensuring that products are designed and manufactured in
                  accordance with accessibility requirements
                </li>
                <li>Carrying out the conformity assessment procedure</li>
                <li>Drawing up technical documentation</li>
                <li>Drawing up the EU declaration of conformity</li>
                <li>Affixing the CE marking</li>
                <li>
                  Ensuring that procedures are in place for series production to
                  remain in conformity
                </li>
                <li>
                  Maintaining records of complaints and non-conforming products
                </li>
                <li>
                  Providing information and documentation to demonstrate product
                  conformity
                </li>
              </ul>
              <p className="mt-4">
                <Link
                  href={OBLIGATIONS_LINKS.MANUFACTURERS.fullPath}
                  className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md inline-flex items-center gap-1"
                  aria-labelledby="manufacturer-details-link"
                >
                  <span id="manufacturer-details-link">
                    Learn more about manufacturers' obligations
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </p>
            </div>
          </section>

          <section
            aria-labelledby="importers-summary"
            id="importers-summary-section"
            className="scroll-mt-16"
          >
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="importers-summary"
              tabIndex={-1}
            >
              Importers: Key Obligations
            </h2>
            <div className="space-y-4">
              <p>
                Importers act as gatekeepers, ensuring that products from third
                countries comply with the European accessibility requirements
                before placing them on the EU market. Their main obligations
                include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Verifying that the manufacturer has carried out the
                  appropriate conformity assessment
                </li>
                <li>Ensuring that the product bears the CE marking</li>
                <li>
                  Checking that required documentation is complete and accurate
                </li>
                <li>
                  Verifying that the manufacturer is identified on the product
                </li>
                <li>
                  Refraining from placing non-compliant products on the market
                </li>
                <li>Including their contact information on the product</li>
                <li>Ensuring proper storage and transport conditions</li>
                <li>Cooperating with market surveillance authorities</li>
              </ul>
              <p className="mt-4">
                <Link
                  href={OBLIGATIONS_LINKS.IMPORTERS.fullPath}
                  className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md inline-flex items-center gap-1"
                  aria-labelledby="importer-details-link"
                >
                  <span id="importer-details-link">
                    Learn more about importers' obligations
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </p>
            </div>
          </section>

          <section
            aria-labelledby="distributors-summary"
            id="distributors-summary-section"
            className="scroll-mt-16"
          >
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="distributors-summary"
              tabIndex={-1}
            >
              Distributors: Key Obligations
            </h2>
            <div className="space-y-4">
              <p>
                Distributors are the economic operators who make products
                available on the market after they have been placed by the
                manufacturer or importer. Their key obligations include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Acting with due care in relation to accessibility requirements
                </li>
                <li>
                  Verifying that the product bears the CE marking and is
                  accompanied by the required documentation
                </li>
                <li>
                  Checking that the manufacturer and importer have complied with
                  their obligations
                </li>
                <li>
                  Ensuring that storage or transport conditions do not
                  jeopardize compliance
                </li>
                <li>Taking corrective measures when necessary</li>
                <li>
                  Informing authorities about products presenting a risk related
                  to accessibility
                </li>
                <li>Cooperating with competent authorities</li>
              </ul>
              <p className="mt-4">
                <Link
                  href={OBLIGATIONS_LINKS.DISTRIBUTORS.fullPath}
                  className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md inline-flex items-center gap-1"
                  aria-labelledby="distributor-details-link"
                >
                  <span id="distributor-details-link">
                    Learn more about distributors' obligations
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </p>
            </div>
          </section>

          <section
            aria-labelledby="service-providers-summary"
            id="service-providers-summary-section"
            className="scroll-mt-16"
          >
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="service-providers-summary"
              tabIndex={-1}
            >
              Service Providers: Key Obligations
            </h2>
            <div className="space-y-4">
              <p>
                Service providers have distinct obligations under the European
                Accessibility Act that focus on ensuring the accessibility of
                services. Their key obligations include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Designing and providing services in accordance with the
                  accessibility requirements
                </li>
                <li>
                  Preparing the necessary information explaining how the
                  services meet the accessibility requirements
                </li>
                <li>
                  Establishing procedures to ensure that service provision
                  remains in conformity with applicable requirements
                </li>
                <li>
                  Taking necessary corrective measures to bring a non-conforming
                  service into conformity
                </li>
                <li>
                  Informing competent authorities about non-compliance and
                  corrective actions
                </li>
                <li>
                  Providing information to demonstrate service conformity upon
                  reasoned request
                </li>
                <li>Cooperating with competent authorities</li>
              </ul>
              <p className="mt-4">
                <Link
                  href={OBLIGATIONS_LINKS.SERVICE_PROVIDERS.fullPath}
                  className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md inline-flex items-center gap-1"
                  aria-labelledby="service-provider-details-link"
                >
                  <span id="service-provider-details-link">
                    Learn more about service providers' obligations
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </p>
            </div>
          </section>

          <section
            aria-labelledby="multiple-roles"
            id="multiple-roles-section"
            className="scroll-mt-16"
          >
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="multiple-roles"
              tabIndex={-1}
            >
              Economic Operators with Multiple Roles
            </h2>
            <div className="space-y-4">
              <p>
                It's important to note that a single company may fulfill
                multiple roles under the European Accessibility Act and would
                need to comply with the obligations for each role. For example:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  A company might be both a manufacturer of certain products and
                  an importer of others
                </li>
                <li>
                  A retailer might be considered both a distributor of
                  third-party products and a service provider for its online
                  shopping platform
                </li>
                <li>
                  A software developer might be both a manufacturer (for
                  software products) and a service provider (for cloud services)
                </li>
              </ul>
              <p>
                In such cases, the company must ensure compliance with all
                applicable obligations corresponding to each role they perform
                in the market.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="legal-references"
            id="legal-references-section"
            className="scroll-mt-16"
          >
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="legal-references"
              tabIndex={-1}
            >
              Legal References
            </h2>
            <div className="space-y-4">
              <p>
                The specific obligations for economic operators are defined in
                the following articles of the European Accessibility Act:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Article 7:</strong> Obligations of manufacturers
                </li>
                <li>
                  <strong>Article 8:</strong> Authorised representatives
                </li>
                <li>
                  <strong>Article 9:</strong> Obligations of importers
                </li>
                <li>
                  <strong>Article 10:</strong> Obligations of distributors
                </li>
                <li>
                  <strong>Article 11:</strong> Cases in which obligations of
                  manufacturers apply to importers and distributors
                </li>
                <li>
                  <strong>Article 13:</strong> Obligations of service providers
                </li>
              </ul>
              <p className="mt-4">
                <a
                  href={EXTERNAL_LINKS.OFFICIAL_EAA_TEXT}
                  className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-labelledby="legal-reference-link"
                >
                  <span id="legal-reference-link">
                    View the full text of the European Accessibility Act
                  </span>
                  <ExternalLink size={16} aria-hidden="true" />
                  <span className="sr-only">(opens in new window)</span>
                </a>
              </p>
            </div>
          </section>

          <nav className="py-8 border-t mt-4" aria-label="Chapter navigation">
            <div className="flex justify-between">
              <Link
                href={INTRODUCTION_LINKS.SCOPE.fullPath}
                className="inline-flex items-center gap-2 text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                <span>Previous: Scope & Application</span>
              </Link>
              <Link
                href={REQUIREMENTS_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                className="inline-flex items-center gap-2 text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
              >
                <span>Next: Accessibility Requirements</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </main>
  )
}
