import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  COMPLIANCE_LINKS,
  ANNEXES_LINKS,
  EXTERNAL_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'EU Declaration of Conformity | European Accessibility Act',
  description:
    'Learn about the EU Declaration of Conformity requirements under the European Accessibility Act (EAA).',
}

export default function EuDeclarationPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            EU Declaration of Conformity
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
                  href="#structure-content"
                  id="structure-content-link"
                >
                  Structure and Content
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#exceptions"
                  id="exceptions-link"
                >
                  Exceptions and Special Provisions
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#single-declaration"
                  id="single-declaration-link"
                >
                  Single EU Declaration
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#retention-availability"
                  id="retention-availability-link"
                >
                  Retention and Availability
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#relationship-ce-marking"
                  id="relationship-ce-marking-link"
                >
                  Relationship with CE Marking
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#related-resources"
                  id="related-resources-link"
                >
                  Related Resources
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
                The EU Declaration of Conformity (DoC) is a formal document that
                manufacturers must create to declare that their products meet
                all the applicable accessibility requirements of the European
                Accessibility Act. By drawing up this declaration, the
                manufacturer assumes full responsibility for the compliance of
                the product.
              </p>
              <p>
                This document is a critical part of the conformity assessment
                process, serving as the manufacturer's official statement that
                their product complies with the legal requirements. It enables
                authorities, distributors, and end-users to verify that the
                product has undergone the necessary assessment procedures.
              </p>
            </div>
          </section>

          <section aria-labelledby="structure-content">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="structure-content"
              tabIndex={-1}
            >
              Structure and Content
            </h2>
            <div className="space-y-4">
              <p>
                According to Article 16 of the EAA, the EU Declaration of
                Conformity:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Must follow the model structure set out in Annex III to
                  Decision No 768/2008/EC
                </li>
                <li>
                  Must contain all the elements specified in Annex IV of the EAA
                </li>
                <li>
                  Must be continuously updated if any changes are made to the
                  product
                </li>
                <li>
                  Must be translated into the language(s) required by the Member
                  State where the product is placed or made available
                </li>
              </ul>
              <p>
                The declaration must identify the product for which it has been
                drawn up, typically including information such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product name, type, batch or serial number</li>
                <li>
                  Name and address of the manufacturer and, where applicable,
                  their authorized representative
                </li>
                <li>
                  References to the relevant harmonized standards or technical
                  specifications applied
                </li>
                <li>Date of issue of the declaration</li>
                <li>Signature of the person responsible</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="exceptions">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="exceptions"
              tabIndex={-1}
            >
              Exceptions and Special Provisions
            </h2>
            <div className="space-y-4">
              <p>
                When manufacturers use the exception for fundamental alteration
                or disproportionate burden under Article 14 of the EAA, the
                declaration must explicitly state which accessibility
                requirements are subject to that exception.
              </p>
              <p>
                The EAA specifies that the requirements for technical
                documentation should avoid imposing any undue burden for
                microenterprises and SMEs, while still ensuring sufficient
                detail to demonstrate compliance.
              </p>
              <p>
                For detailed information on disproportionate burden assessments,
                see
                <Link
                  href={ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Annex IV: Disproportionate Burden
                </Link>
                .
              </p>
            </div>
          </section>

          <section aria-labelledby="single-declaration">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="single-declaration"
              tabIndex={-1}
            >
              Single EU Declaration of Conformity
            </h2>
            <div className="space-y-4">
              <p>
                Where a product is subject to more than one Union act requiring
                an EU Declaration of Conformity, manufacturers may create a
                single declaration that covers all applicable Union acts. This
                approach:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reduces administrative burden on economic operators</li>
                <li>
                  Ensures effective access to information for market
                  surveillance purposes
                </li>
                <li>
                  Must contain the identification of all the relevant acts,
                  including their publication references
                </li>
              </ul>
              <p>
                This provision allows manufacturers to include all relevant
                individual declarations of conformity in a single document,
                which is particularly useful for products that must comply with
                multiple directives or regulations.
              </p>
            </div>
          </section>

          <section aria-labelledby="retention-availability">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="retention-availability"
              tabIndex={-1}
            >
              Retention and Availability
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers and importers have specific obligations regarding
                the EU Declaration of Conformity:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Manufacturers must keep the declaration for five years after
                  the product has been placed on the market
                </li>
                <li>
                  Importers must keep a copy of the declaration for five years
                  at the disposal of market surveillance authorities
                </li>
                <li>
                  A copy of the declaration must be made available to relevant
                  authorities upon request
                </li>
                <li>
                  Distributors must verify that the product is accompanied by
                  the required documentation, including the declaration when
                  applicable
                </li>
              </ul>
              <p>
                For more information on market surveillance procedures, see
                <Link
                  href={COMPLIANCE_LINKS.MARKET_SURVEILLANCE.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Market Surveillance
                </Link>
                .
              </p>
            </div>
          </section>

          <section aria-labelledby="relationship-ce-marking">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="relationship-ce-marking"
              tabIndex={-1}
            >
              Relationship with CE Marking
            </h2>
            <div className="space-y-4">
              <p>
                The EU Declaration of Conformity is closely linked to the CE
                marking:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The CE marking is the visible indication that a product
                  complies with EU legislation
                </li>
                <li>
                  The EU Declaration of Conformity is the document that
                  substantiates this compliance
                </li>
                <li>
                  A manufacturer must draw up the EU Declaration of Conformity
                  before affixing the CE marking to a product
                </li>
                <li>
                  Together, they form a complete conformity assessment process
                  that enables free movement of products in the European market
                </li>
              </ul>
              <p>
                By affixing the CE marking, the manufacturer declares that the
                product is in conformity with all applicable accessibility
                requirements and that they take full responsibility for this
                conformity.
              </p>
              <p>
                For detailed information on CE marking requirements, see the
                <Link
                  href={COMPLIANCE_LINKS.CE_MARKING.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  CE Marking
                </Link>{' '}
                page.
              </p>
            </div>
          </section>

          <section aria-labelledby="related-resources">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="related-resources"
              tabIndex={-1}
            >
              Related Resources
            </h2>
            <div className="bg-blue-50 border border-blue-400 px-6 text-blue-800 dark:text-blue-400 dark:bg-blue-950 py-4 rounded-md">
              <h3 className="font-semibold mb-2 mt-0">
                Additional EAA Resources:
              </h3>
              <p>
                For comprehensive information about conformity and related
                topics:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <Link
                    href={COMPLIANCE_LINKS.CONFORMITY.fullPath}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Conformity of Products
                  </Link>{' '}
                  - Overview of conformity assessment process
                </li>
                <li>
                  <Link
                    href={COMPLIANCE_LINKS.HARMONIZED_STANDARDS.fullPath}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Harmonized Standards
                  </Link>{' '}
                  - Standards referenced in declarations of conformity
                </li>
                <li>
                  <Link
                    href={ANNEXES_LINKS.CONFORMITY_ASSESSMENT.fullPath}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Annex V: Conformity Assessment
                  </Link>{' '}
                  - Detailed procedures for conformity assessment
                </li>
                <li>
                  <a
                    href={EXTERNAL_LINKS.OFFICIAL_EAA_TEXT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Official EAA Text (Article 16)</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>{' '}
                  - Legal text about the EU Declaration of Conformity
                </li>
              </ul>

              <h3 className="font-semibold mb-2 mt-6">
                Official EU Guidance on Declarations of Conformity:
              </h3>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <a
                    href="https://europa.eu/youreurope/business/product-requirements/compliance/technical-documentation-conformity/index_en.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>
                      EU Guide on Technical Documentation and EU Declaration of
                      Conformity
                    </span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>{' '}
                  - Official EU guidance for businesses
                </li>
                <li>
                  <a
                    href="https://ec.europa.eu/docsroom/documents/43725"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>EU Declaration of Conformity Template</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>{' '}
                  - Official template document from the European Commission
                </li>
                <li>
                  <a
                    href="https://ec.europa.eu/docsroom/documents/12308"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>CE Marking Step by Step</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>{' '}
                  - European Commission's guidance on the CE marking process
                </li>
                <li>
                  <a
                    href="https://ec.europa.eu/growth/single-market/ce-marking_en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>CE Marking</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>{' '}
                  - European Commission's main resource page on CE marking
                </li>
              </ul>
            </div>
          </section>

          {/* Add References Section Here */}
          <section aria-labelledby="references" className="mt-12 pt-6 border-t">
            <h2
              id="references"
              className="text-xl font-semibold mb-4 scroll-mt-6"
              tabIndex={-1}
            >
              Source References
            </h2>
            <p className="text-sm text-muted-foreground">
              This page primarily references the following sections of Directive
              (EU) 2019/882:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                Article 7, Paragraph 2 (Manufacturer obligation to draw up DoC)
              </li>
              <li>Article 7, Paragraph 3 (Manufacturer retention period)</li>
              <li>Article 9, Paragraph 7 (Importer retention period)</li>
              <li>
                Article 16 (EU declaration of conformity - content, structure,
                exceptions, single DoC)
              </li>
              <li>Article 18, Paragraph 1 (Relation to CE marking)</li>
              <li>
                Annex IV (Elements of technical documentation related to DoC)
              </li>
              <li>Recital 78 (Context for single DoC)</li>
            </ul>
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
                  href={COMPLIANCE_LINKS.CE_MARKING.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">CE Marking</span>
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
