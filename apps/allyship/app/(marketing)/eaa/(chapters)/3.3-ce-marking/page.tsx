import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  COMPLIANCE_LINKS,
  EXTERNAL_LINKS,
} from '../../constants/links'
import { CEMark } from '../../components/ce-mark'

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
          <h1 className="text-4xl font-bold mb-[23px]">CE Marking</h1>

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
                  href="#general-principles"
                  id="general-principles-link"
                >
                  General Principles
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#affixing-rules"
                  id="affixing-rules-link"
                >
                  Rules for Affixing
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#relationship-conformity"
                  id="relationship-conformity-link"
                >
                  Relationship with Conformity
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#enforcement-compliance"
                  id="enforcement-compliance-link"
                >
                  Enforcement and Compliance
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#consumer-information"
                  id="consumer-information-link"
                >
                  Consumer Information
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
                The CE marking on a product is the visible consequence of a
                whole process comprising conformity assessment under the
                European Accessibility Act. It serves as a declaration by the
                manufacturer that the product meets all applicable accessibility
                requirements and other relevant EU legislation.
              </p>
              <p>
                As stated in the EAA, "by affixing the CE marking to a product,
                the manufacturer declares that the product is in conformity with
                all applicable accessibility requirements and that the
                manufacturer takes full responsibility therefor."
              </p>
              <p>
                The CE marking is essential for products covered by the EAA to
                enable their free movement within the European market, providing
                a clear indicator to market surveillance authorities and
                end-users that the product complies with EU accessibility
                legislation.
              </p>
            </div>
          </section>

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
                Article 17 of the EAA states that the CE marking is subject to
                the general principles set out in Article 30 of Regulation (EC)
                No 765/2008. These principles include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The CE marking shall be affixed only by the manufacturer or
                  their authorized representative
                </li>
                <li>
                  The CE marking shall only be affixed to products for which its
                  affixing is provided for by specific EU legislation
                </li>
                <li>
                  By affixing the CE marking, the manufacturer indicates they
                  take full responsibility for the product's conformity with all
                  applicable requirements
                </li>
                <li>
                  The CE marking is the only marking which attests the
                  conformity of the product with the applicable requirements
                </li>
                <li>
                  Member States shall ensure the correct implementation of the
                  regime governing the CE marking and take appropriate action in
                  the event of improper use
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
              Rules for Affixing the CE Marking
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-grow">
                  <p>
                    According to Article 18 of the EAA, there are specific rules
                    for affixing the CE marking:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      The CE marking must be affixed visibly, legibly, and
                      indelibly to the product or to its data plate
                    </li>
                    <li>
                      If this is not possible or warranted due to the nature of
                      the product, the marking must be affixed to the packaging
                      and to the accompanying documents
                    </li>
                    <li>
                      The CE marking must be affixed before the product is
                      placed on the market
                    </li>
                    <li>
                      The marking must follow the standard proportions and
                      design as specified in EU legislation
                    </li>
                  </ul>
                  <p>
                    The CE marking is the final step in the conformity
                    assessment process and can only be applied after the
                    manufacturer has drawn up the EU Declaration of Conformity
                    confirming that the product meets all applicable
                    requirements.
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
              Relationship with Conformity Assessment
            </h2>
            <div className="space-y-4">
              <p>
                The CE marking is directly connected to the conformity
                assessment procedure for products under the EAA:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The manufacturer must first conduct a conformity assessment
                  using the Internal production control (Module A) set out in
                  Annex IV to the EAA
                </li>
                <li>
                  The manufacturer must prepare technical documentation
                  demonstrating that the product meets accessibility
                  requirements
                </li>
                <li>
                  After confirming compliance, the manufacturer draws up the EU
                  Declaration of Conformity
                </li>
                <li>
                  Only after completing these steps can the manufacturer affix
                  the CE marking
                </li>
              </ul>
              <p>
                This sequence ensures that the CE marking represents the
                culmination of a thorough assessment process, rather than simply
                being an administrative label.
              </p>
              <p>
                For more information about the conformity assessment process,
                see the
                <Link
                  href={COMPLIANCE_LINKS.CONFORMITY.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Conformity Assessment
                </Link>{' '}
                page.
              </p>
            </div>
          </section>

          <section aria-labelledby="enforcement-compliance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="enforcement-compliance"
              tabIndex={-1}
            >
              Enforcement and Compliance
            </h2>
            <div className="space-y-4">
              <p>
                Member States play a critical role in ensuring the proper use of
                the CE marking:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Member States must build upon existing mechanisms to ensure
                  correct application of the regime governing the CE marking
                </li>
                <li>
                  They must take appropriate action in the event of improper use
                  of the marking
                </li>
                <li>
                  Market surveillance authorities check that products bearing
                  the CE marking genuinely comply with the applicable
                  requirements
                </li>
                <li>
                  Penalties may be imposed for improper use of the CE marking,
                  including the removal of non-compliant products from the
                  market
                </li>
              </ul>
              <p>
                This enforcement framework helps maintain the integrity and
                credibility of the CE marking system across the European Union.
              </p>
              <p>
                For more details about enforcement, see the
                <Link
                  href={COMPLIANCE_LINKS.MARKET_SURVEILLANCE.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Market Surveillance
                </Link>{' '}
                page.
              </p>
            </div>
          </section>

          <section aria-labelledby="consumer-information">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="consumer-information"
              tabIndex={-1}
            >
              Consumer Information
            </h2>
            <div className="space-y-4">
              <p>
                Beyond regulatory compliance, the CE marking serves an important
                consumer information function:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  It provides a clear indication that a product meets
                  accessibility requirements, helping consumers with
                  disabilities make informed purchasing decisions
                </li>
                <li>
                  The EAA notes that manufacturers should inform consumers about
                  the accessibility of their products in a cost-effective manner
                </li>
                <li>
                  The presence of the CE marking, combined with accessibility
                  information, helps create transparency in the market
                </li>
                <li>
                  This transparency supports the EAA's goal of improving the
                  functioning of the internal market for accessible products and
                  services
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
                Article 7, Paragraph 2 (Manufacturer obligation to affix CE
                mark)
              </li>
              <li>
                Article 16, Paragraph 4 (Manufacturer responsibility assumption
                via DoC/CE mark)
              </li>
              <li>
                Article 17 (General principles of CE marking, referencing
                Regulation (EC) No 765/2008)
              </li>
              <li>
                Article 18 (Rules and conditions for affixing the CE marking)
              </li>
              <li>Article 22 (Formal non-compliance related to CE marking)</li>
              <li>
                Annex IV (Conformity assessment procedure leading to CE mark)
              </li>
              <li>Recital 82 (Context on CE marking as visible consequence)</li>
              <li>
                Recital 83 (Context on manufacturer declaration via CE mark)
              </li>
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
                  href={COMPLIANCE_LINKS.MARKET_SURVEILLANCE.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Market Surveillance</span>
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
