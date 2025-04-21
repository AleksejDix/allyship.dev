import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
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
            EU Declaration of Conformity.
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
                  href="#structure-content"
                  id="structure-content-link"
                >
                  Structure and Content.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#exceptions"
                  id="exceptions-link"
                >
                  Exceptions and Special Rules.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#single-declaration"
                  id="single-declaration-link"
                >
                  Single EU Declaration.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#retention-availability"
                  id="retention-availability-link"
                >
                  Keeping and Sharing Documents.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#relationship-ce-marking"
                  id="relationship-ce-marking-link"
                >
                  Connection to CE Marking.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#related-resources"
                  id="related-resources-link"
                >
                  Related Resources.
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
              Overview and Purpose.
            </h2>
            <div className="space-y-4">
              <p>
                The EU Declaration of Conformity is an official document that
                manufacturers must create. This document states that their
                products meet all accessibility requirements in the European
                Accessibility Act. When making this declaration, the
                manufacturer takes full responsibility for the product's
                compliance.
              </p>
              <p>
                This document is an important part of the conformity assessment
                process. It serves as the manufacturer's official statement that
                their product follows the legal requirements. The document helps
                authorities, distributors, and end-users check that the product
                has gone through the needed assessment steps.
              </p>
            </div>
          </section>

          <section aria-labelledby="structure-content">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="structure-content"
              tabIndex={-1}
            >
              Structure and Content.
            </h2>
            <div className="space-y-4">
              <p>
                According to Article 16 of the EAA, the EU Declaration of
                Conformity must include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The structure format set out in Annex III to Decision No
                  768/2008/EC.
                </li>
                <li>All the elements listed in Annex IV of the EAA.</li>
                <li>Updates when any changes are made to the product.</li>
                <li>
                  Translations into the languages required by the country where
                  the product is sold.
                </li>
              </ul>
              <p>
                The declaration must clearly identify the product it covers.
                This typically includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product name, type, batch or serial number.</li>
                <li>
                  Name and address of the manufacturer and their representative,
                  if they have one.
                </li>
                <li>
                  References to the relevant standards or technical
                  specifications used.
                </li>
                <li>Date when the declaration was issued.</li>
                <li>Signature of the responsible person.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="exceptions">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="exceptions"
              tabIndex={-1}
            >
              Exceptions and Special Rules.
            </h2>
            <div className="space-y-4">
              <p>
                When manufacturers use the exception for fundamental alteration
                or disproportionate burden under Article 14, they must clearly
                state which accessibility requirements have exceptions.
              </p>
              <p>
                The EAA states that technical documentation requirements should
                not create too much work for very small businesses and SMEs.
                However, the documentation must still show compliance clearly.
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
              Single EU Declaration.
            </h2>
            <div className="space-y-4">
              <p>
                When a product must follow more than one EU law requiring a
                Declaration of Conformity, manufacturers can create just one
                declaration that covers all applicable laws. This approach:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reduces paperwork for businesses.</li>
                <li>
                  Makes information easier to find for market surveillance
                  purposes.
                </li>
                <li>
                  Must list all the relevant laws, including their publication
                  references.
                </li>
              </ul>
              <p>
                This option lets manufacturers include all relevant individual
                declarations in one document. This is especially helpful for
                products that must comply with multiple directives or
                regulations.
              </p>
            </div>
          </section>

          <section aria-labelledby="retention-availability">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="retention-availability"
              tabIndex={-1}
            >
              Keeping and Sharing Documents.
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers and importers have specific responsibilities
                regarding the EU Declaration of Conformity:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Manufacturers must keep the declaration for five years after
                  the product is placed on the market.
                </li>
                <li>
                  Importers must keep a copy of the declaration for five years
                  for market surveillance authorities.
                </li>
                <li>
                  A copy of the declaration must be provided to relevant
                  authorities when they ask for it.
                </li>
                <li>
                  Distributors must check that the product comes with all
                  required documentation, including the declaration when needed.
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
              Connection to CE Marking.
            </h2>
            <div className="space-y-4">
              <p>
                The EU Declaration of Conformity is closely linked to the CE
                marking:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The CE marking is the visible sign that a product complies
                  with EU laws.
                </li>
                <li>
                  The EU Declaration of Conformity is the document that proves
                  this compliance.
                </li>
                <li>
                  A manufacturer must create the EU Declaration of Conformity
                  before adding the CE marking to a product.
                </li>
                <li>
                  Together, they complete the conformity assessment process that
                  allows products to move freely in the European market.
                </li>
              </ul>
              <p>
                By adding the CE marking, the manufacturer states that the
                product meets all applicable accessibility requirements. They
                take full responsibility for this conformity.
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
              Related Resources.
            </h2>
            <div className="bg-blue-50 border border-blue-400 px-6 text-blue-800 dark:text-blue-400 dark:bg-blue-950 py-4 rounded-md">
              <h3 className="font-semibold mb-2 mt-0">
                Additional EAA Resources:
              </h3>
              <p>
                For complete information about conformity and related topics:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <Link
                    href={COMPLIANCE_LINKS.CONFORMITY.fullPath}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Conformity of Products
                  </Link>{' '}
                  - Overview of conformity assessment process.
                </li>
                <li>
                  <Link
                    href={COMPLIANCE_LINKS.HARMONIZED_STANDARDS.fullPath}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Harmonized Standards
                  </Link>{' '}
                  - Standards referenced in declarations of conformity.
                </li>
                <li>
                  <Link
                    href={ANNEXES_LINKS.CONFORMITY_ASSESSMENT.fullPath}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Annex V: Conformity Assessment
                  </Link>{' '}
                  - Detailed procedures for conformity assessment.
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
                  - Legal text about the EU Declaration of Conformity.
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
                  - Official EU guidance for businesses.
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
                  - Official template document from the European Commission.
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
                  - European Commission's guidance on the CE marking process.
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
                  - European Commission's main resource page on CE marking.
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
              Source References.
            </h2>
            <p className="text-sm text-muted-foreground">
              This page references these sections of Directive (EU) 2019/882:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                Article 7, Paragraph 2. Manufacturer obligation to create DoC.
              </li>
              <li>Article 7, Paragraph 3. Manufacturer retention period.</li>
              <li>Article 9, Paragraph 7. Importer retention period.</li>
              <li>
                Article 16. EU declaration of conformity - content, structure,
                exceptions, single DoC.
              </li>
              <li>Article 18, Paragraph 1. Relation to CE marking.</li>
              <li>
                Annex IV. Elements of technical documentation related to DoC.
              </li>
              <li>Recital 78. Context for single DoC.</li>
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
                  href={COMPLIANCE_LINKS.CE_MARKING.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">CE Marking.</span>
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
