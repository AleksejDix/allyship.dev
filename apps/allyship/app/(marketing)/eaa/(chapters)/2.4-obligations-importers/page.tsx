import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { INTRODUCTION_LINKS, OBLIGATIONS_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title: 'Importer Obligations | European Accessibility Act',
  description:
    'Legal responsibilities of importers under the European Accessibility Act, including product verification, documentation requirements, and compliance procedures.',
}

export default function ImportersObligationsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations of Importers
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#role-importers"
                  id="role-importers-link"
                >
                  Role of Importers
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#compliance-verification"
                  id="compliance-verification-link"
                >
                  Verification
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#non-compliance-action"
                  id="non-compliance-link"
                >
                  Non-Compliance
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#identification-requirements"
                  id="identification-link"
                >
                  Identification
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#instructions-documentation"
                  id="documentation-link"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#storage-transport"
                  id="storage-link"
                >
                  Storage & Transport
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#monitoring-investigations"
                  id="monitoring-link"
                >
                  Market Monitoring
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#corrective-measures"
                  id="corrective-link"
                >
                  Corrective Measures
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#record-keeping"
                  id="record-keeping-link"
                >
                  Record Keeping
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#cooperation"
                  id="cooperation-link"
                >
                  Cooperation
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2">
        <div className="space-y-8">
          <section aria-labelledby="role-importers">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6 mt-0"
              id="role-importers"
              tabIndex={-1}
            >
              Role of Importers
            </h2>
            <div className="space-y-4">
              <p>
                Article 9 of the European Accessibility Act defines the
                obligations of importers. Importers play a crucial role in the
                supply chain as they are the economic operators who place
                products from third countries onto the EU market.
              </p>
              <p>
                As gatekeepers between manufacturers outside the EU and the
                European market, importers have the responsibility to verify
                that products they import comply with the accessibility
                requirements before making them available on the market.
              </p>
            </div>
          </section>

          <section aria-labelledby="compliance-verification">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="compliance-verification"
              tabIndex={-1}
            >
              Verification Before Placement
            </h2>
            <div className="space-y-4">
              <p>
                Importers shall place only compliant products on the market.
                Before placing a product on the market, importers shall ensure
                that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The manufacturer has carried out the appropriate conformity
                  assessment procedure
                </li>
                <li>
                  The manufacturer has drawn up the required technical
                  documentation
                </li>
                <li>The product bears the CE marking</li>
                <li>The product is accompanied by the required documents</li>
                <li>
                  The manufacturer has complied with the requirements related to
                  identification (name, trademark, contact details, etc.)
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="non-compliance-action">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="non-compliance-action"
              tabIndex={-1}
            >
              Action on Non-Compliance
            </h2>
            <div className="space-y-4">
              <p>
                Where an importer considers or has reason to believe that a
                product is not in conformity with the applicable accessibility
                requirements, the importer shall not place the product on the
                market until it has been brought into conformity.
              </p>
              <p>
                Furthermore, where the product presents a risk related to
                accessibility, the importer shall inform the manufacturer and
                the market surveillance authorities to that effect.
              </p>
            </div>
          </section>

          <section aria-labelledby="identification-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="identification-requirements"
              tabIndex={-1}
            >
              Identification and Contact Information
            </h2>
            <div className="space-y-4">
              <p>
                Importers shall indicate their name, registered trade name or
                registered trademark and the address at which they can be
                contacted on the product. Where that is not possible due to the
                size or nature of the product, importers shall provide this
                information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>On the packaging</li>
                <li>In a document accompanying the product</li>
              </ul>
              <p>
                The contact details must be in a language which can be easily
                understood by end-users and market surveillance authorities, as
                determined by the Member State concerned.
              </p>
            </div>
          </section>

          <section aria-labelledby="instructions-documentation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="instructions-documentation"
              tabIndex={-1}
            >
              Instructions and Documentation
            </h2>
            <div className="space-y-4">
              <p>
                Importers shall ensure that the product is accompanied by
                instructions and safety information in a language which can be
                easily understood by consumers and other end-users, as
                determined by the Member State concerned.
              </p>
              <p>
                They must verify that these materials are accessible, clear,
                understandable, and that they provide all necessary information
                about the product's accessibility features and how to use them.
              </p>
            </div>
          </section>

          <section aria-labelledby="storage-transport">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="storage-transport"
              tabIndex={-1}
            >
              Storage and Transport Conditions
            </h2>
            <div className="space-y-4">
              <p>
                As long as a product is under their responsibility, importers
                shall ensure that storage or transport conditions do not
                jeopardize its compliance with the applicable accessibility
                requirements.
              </p>
              <p>This includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Maintaining appropriate environmental conditions (temperature,
                  humidity, etc.)
                </li>
                <li>Proper handling and packaging to prevent damage</li>
                <li>Secure storage to maintain product integrity</li>
                <li>
                  Ensuring accessibility features remain functional during
                  transport and storage
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="monitoring-investigations">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="monitoring-investigations"
              tabIndex={-1}
            >
              Market Monitoring and Investigations
            </h2>
            <div className="space-y-4">
              <p>
                When deemed appropriate with regard to the risks presented by a
                product, importers shall:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Carry out sample testing of marketed products</li>
                <li>
                  Investigate complaints related to non-conforming products
                </li>
                <li>Keep a register of such complaints</li>
                <li>Maintain records of non-conforming products</li>
                <li>Document product recalls</li>
                <li>Keep distributors informed of any such monitoring</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="corrective-measures">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="corrective-measures"
              tabIndex={-1}
            >
              Corrective Measures
            </h2>
            <div className="space-y-4">
              <p>
                Importers who consider or have reason to believe that a product
                which they have placed on the market is not in conformity with
                this Directive shall:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Immediately take the corrective measures necessary to bring
                  that product into conformity
                </li>
                <li>Withdraw the product from the market, if appropriate</li>
                <li>Recall the product, if appropriate</li>
              </ul>
              <p>
                Furthermore, where the product presents a risk related to
                accessibility, importers shall immediately inform the competent
                national authorities of the Member States in which they made the
                product available, giving details about:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The nature of the non-compliance</li>
                <li>The specific accessibility requirements not met</li>
                <li>Any corrective measures taken</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="record-keeping">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="record-keeping"
              tabIndex={-1}
            >
              Record Keeping
            </h2>
            <div className="space-y-4">
              <p>
                Importers shall keep a copy of the EU declaration of conformity
                at the disposal of the market surveillance authorities for 5
                years after the product has been placed on the market.
              </p>
              <p>
                They shall also ensure that the technical documentation can be
                made available to those authorities upon request during that
                period.
              </p>
            </div>
          </section>

          <section aria-labelledby="cooperation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="cooperation"
              tabIndex={-1}
            >
              Cooperation with Authorities
            </h2>
            <div className="space-y-4">
              <p>
                Importers shall, further to a reasoned request from a competent
                national authority, provide it with all the information and
                documentation necessary to demonstrate the conformity of a
                product in a language which can be easily understood by that
                authority.
              </p>
              <p>
                They shall cooperate with that authority, at its request, on any
                action taken to eliminate the non-compliance with the applicable
                accessibility requirements of products which they have placed on
                the market.
              </p>
            </div>
          </section>

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
              <li>Article 3, Point 19 (Definition: Importer)</li>
              <li>Article 9 (Obligations of importers)</li>
              <li>Recitals 59, 60, 61 (Context on importer's role)</li>
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
              <Button asChild>
                <Link
                  href={OBLIGATIONS_LINKS.DISTRIBUTORS.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Distributors' Obligations</span>
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
