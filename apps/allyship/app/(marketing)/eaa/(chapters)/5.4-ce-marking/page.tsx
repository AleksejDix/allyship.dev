import React from 'react'
import { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'
import { CEMark } from '../../components/ce-mark'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'CE Marking | European Accessibility Act',
  description:
    'Learn about CE marking requirements under the European Accessibility Act (EAA) and how to properly apply the CE mark to accessible products.',
}

export default function CeMarkingPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">CE Marking.</h1>

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
                  href="#general-principles"
                  id="general-principles-link"
                >
                  General Principles.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#affixing-rules"
                  id="affixing-rules-link"
                >
                  Rules for Adding the Mark.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#relationship-conformity"
                  id="relationship-conformity-link"
                >
                  Connection to Conformity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#enforcement-compliance"
                  id="enforcement-compliance-link"
                >
                  Enforcement and Compliance.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#consumer-information"
                  id="consumer-information-link"
                >
                  Consumer Information.
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
                The CE marking on a product shows that it has passed conformity
                checks under the European Accessibility Act. It is the
                manufacturer's statement that the product meets all
                accessibility requirements and other EU laws.
              </p>
              <p>
                According to the EAA, "by adding the CE marking to a product,
                the manufacturer states that the product follows all applicable
                accessibility requirements and that they take full
                responsibility for this."
              </p>
              <p>
                Products covered by the EAA need the CE marking to move freely
                within the European market. The mark helps authorities and
                customers see that the product follows EU accessibility laws.
              </p>
            </div>
          </section>

          <section aria-labelledby="general-principles">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="general-principles"
              tabIndex={-1}
            >
              General Principles.
            </h2>
            <div className="space-y-4">
              <p>
                Article 17 of the EAA states that the CE marking follows the
                general principles in Article 30 of Regulation (EC) No 765/2008.
                These principles include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Only the manufacturer or their authorized representative can
                  add the CE marking.
                </li>
                <li>
                  The CE marking can only be added to products when specific EU
                  laws require it.
                </li>
                <li>
                  By adding the CE marking, the manufacturer shows they take
                  full responsibility for the product meeting all requirements.
                </li>
                <li>
                  The CE marking is the only mark that shows the product meets
                  the applicable requirements.
                </li>
                <li>
                  EU countries must ensure the CE marking is used correctly and
                  take action when it is misused.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="affixing-rules">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="affixing-rules"
              tabIndex={-1}
            >
              Rules for Adding the CE Marking.
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-grow">
                  <p>
                    According to Article 18 of the EAA, there are specific rules
                    for adding the CE marking:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      The CE marking must be visible, readable, and permanent on
                      the product or its data plate.
                    </li>
                    <li>
                      If this is not possible due to the nature of the product,
                      the marking must be on the packaging and accompanying
                      documents.
                    </li>
                    <li>
                      The CE marking must be added before the product is placed
                      on the market.
                    </li>
                    <li>
                      The marking must follow the standard size and design
                      specified in EU law.
                    </li>
                  </ul>
                  <p>
                    The CE marking is the final step in the conformity check
                    process. It can only be applied after the manufacturer has
                    created the EU Declaration of Conformity confirming the
                    product meets all requirements.
                  </p>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <CEMark
                    width={150}
                    height={120}
                    className="text-gray-800 dark:text-gray-200 mt-2"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-400 p-4 rounded-md text-blue-800 dark:text-blue-400 dark:bg-blue-950 mt-4">
                <p>
                  For detailed official guidance on CE marking, see the{' '}
                  <a
                    href="https://ec.europa.eu/growth/single-market/ce-marking_en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    European Commission's CE marking website
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="relationship-conformity">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="relationship-conformity"
              tabIndex={-1}
            >
              Connection to Conformity Assessment.
            </h2>
            <div className="space-y-4">
              <p>
                The CE marking is directly connected to the conformity
                assessment procedure for products under the EAA:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The manufacturer must first conduct a conformity assessment
                  using the Internal production control (Module A) in Annex IV
                  of the EAA.
                </li>
                <li>
                  The manufacturer must prepare technical documentation showing
                  that the product meets accessibility requirements.
                </li>
                <li>
                  After confirming compliance, the manufacturer creates the EU
                  Declaration of Conformity.
                </li>
                <li>
                  Only after completing these steps can the manufacturer add the
                  CE marking.
                </li>
              </ul>
              <p>
                This sequence ensures that the CE marking represents a thorough
                assessment process, not just an administrative label.
              </p>
            </div>
          </section>

          <section aria-labelledby="enforcement-compliance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="enforcement-compliance"
              tabIndex={-1}
            >
              Enforcement and Compliance.
            </h2>
            <div className="space-y-4">
              <p>
                EU Member States play an important role in ensuring the proper
                use of the CE marking:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Member States must use existing systems to ensure correct
                  application of the CE marking rules.
                </li>
                <li>
                  They must take appropriate action when the marking is misused.
                </li>
                <li>
                  Market surveillance authorities check that products with the
                  CE marking truly comply with the requirements.
                </li>
                <li>
                  Penalties may be imposed for improper use of the CE marking,
                  including removing non-compliant products from the market.
                </li>
              </ul>
              <p>
                This enforcement system helps maintain the integrity and
                credibility of the CE marking across the European Union.
              </p>
            </div>
          </section>

          <section aria-labelledby="consumer-information">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="consumer-information"
              tabIndex={-1}
            >
              Consumer Information.
            </h2>
            <div className="space-y-4">
              <p>
                Beyond regulatory compliance, the CE marking provides important
                information for consumers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  It clearly shows that a product meets accessibility
                  requirements, helping people with disabilities make informed
                  purchasing decisions.
                </li>
                <li>
                  The EAA notes that manufacturers should inform consumers about
                  the accessibility of their products in a cost-effective way.
                </li>
                <li>
                  The CE marking, combined with accessibility information, helps
                  create transparency in the market.
                </li>
                <li>
                  This transparency supports the EAA's goal of improving the
                  functioning of the internal market for accessible products and
                  services.
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
                Article 7, Paragraph 2. Manufacturer obligation to add CE mark.
              </li>
              <li>
                Article 16, Paragraph 4. Manufacturer responsibility when using
                the CE mark.
              </li>
              <li>
                Article 17. General principles of CE marking, referencing
                Regulation (EC) No 765/2008.
              </li>
              <li>
                Article 18. Rules and conditions for adding the CE marking.
              </li>
              <li>Article 22. Formal non-compliance related to CE marking.</li>
              <li>
                Annex IV. Conformity assessment procedure leading to CE mark.
              </li>
              <li>Recital 82. Context on CE marking as visible consequence.</li>
              <li>
                Recital 83. Context on manufacturer declaration via CE mark.
              </li>
            </ul>
          </section>

          <footer>
            <ChapterNavigation currentPageId="5.4-ce-marking" />
          </footer>
        </div>
      </div>
    </section>
  )
}
