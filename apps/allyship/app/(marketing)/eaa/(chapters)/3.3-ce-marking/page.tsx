import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CE Marking | European Accessibility Act',
  description:
    'Learn about CE marking requirements under the European Accessibility Act (EAA) and how to properly apply the CE mark to accessible products.',
}

export default function CeMarkingPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">CE Marking</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview and Purpose
          </h2>
          <div className="space-y-4">
            <p>
              The CE marking on a product is the visible consequence of a whole
              process comprising conformity assessment under the European
              Accessibility Act. It serves as a declaration by the manufacturer
              that the product meets all applicable accessibility requirements
              and other relevant EU legislation.
            </p>
            <p>
              As stated in the EAA, "by affixing the CE marking to a product,
              the manufacturer declares that the product is in conformity with
              all applicable accessibility requirements and that the
              manufacturer takes full responsibility therefor."
            </p>
            <p>
              The CE marking is essential for products covered by the EAA to
              enable their free movement within the European market, providing a
              clear indicator to market surveillance authorities and end-users
              that the product complies with EU accessibility legislation.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="general-principles">
            General Principles
          </h2>
          <div className="space-y-4">
            <p>
              Article 17 of the EAA states that the CE marking is subject to the
              general principles set out in Article 30 of Regulation (EC) No
              765/2008. These principles include:
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
                By affixing the CE marking, the manufacturer indicates they take
                full responsibility for the product's conformity with all
                applicable requirements
              </li>
              <li>
                The CE marking is the only marking which attests the conformity
                of the product with the applicable requirements
              </li>
              <li>
                Member States shall ensure the correct implementation of the
                regime governing the CE marking and take appropriate action in
                the event of improper use
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="affixing-rules">
            Rules for Affixing the CE Marking
          </h2>
          <div className="space-y-4">
            <p>
              According to Article 18 of the EAA, there are specific rules for
              affixing the CE marking:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The CE marking must be affixed visibly, legibly, and indelibly
                to the product or to its data plate
              </li>
              <li>
                If this is not possible or warranted due to the nature of the
                product, the marking must be affixed to the packaging and to the
                accompanying documents
              </li>
              <li>
                The CE marking must be affixed before the product is placed on
                the market
              </li>
              <li>
                The marking must follow the standard proportions and design as
                specified in EU legislation
              </li>
            </ul>
            <p>
              The CE marking is the final step in the conformity assessment
              process and can only be applied after the manufacturer has drawn
              up the EU Declaration of Conformity confirming that the product
              meets all applicable requirements.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="relationship-conformity"
          >
            Relationship with Conformity Assessment
          </h2>
          <div className="space-y-4">
            <p>
              The CE marking is directly connected to the conformity assessment
              procedure for products under the EAA:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The manufacturer must first conduct a conformity assessment
                using the Internal production control (Module A) set out in
                Annex IV to the EAA
              </li>
              <li>
                The manufacturer must prepare technical documentation
                demonstrating that the product meets accessibility requirements
              </li>
              <li>
                After confirming compliance, the manufacturer draws up the EU
                Declaration of Conformity
              </li>
              <li>
                Only after completing these steps can the manufacturer affix the
                CE marking
              </li>
            </ul>
            <p>
              This sequence ensures that the CE marking represents the
              culmination of a thorough assessment process, rather than simply
              being an administrative label.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="enforcement-compliance"
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
                Market surveillance authorities check that products bearing the
                CE marking genuinely comply with the applicable requirements
              </li>
              <li>
                Penalties may be imposed for improper use of the CE marking,
                including the removal of non-compliant products from the market
              </li>
            </ul>
            <p>
              This enforcement framework helps maintain the integrity and
              credibility of the CE marking system across the European Union.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="consumer-information">
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
                accessibility requirements, helping consumers with disabilities
                make informed purchasing decisions
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

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/eu-declaration"
            className="text-blue-600 hover:underline"
          >
            ← EU Declaration of Conformity
          </Link>
          <Link
            href="/eaa/market-surveillance"
            className="text-blue-600 hover:underline"
          >
            Market Surveillance →
          </Link>
        </nav>
      </div>
    </>
  )
}
