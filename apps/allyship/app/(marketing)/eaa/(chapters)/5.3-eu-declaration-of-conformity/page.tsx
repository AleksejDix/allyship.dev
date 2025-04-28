import React from 'react'
import { Metadata } from 'next'

import { ChapterNavigation } from '../../components/ChapterNavigation'

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
            <ChapterNavigation currentPageId="5.3-eu-declaration-of-conformity" />
          </footer>
        </div>
      </div>
    </section>
  )
}
