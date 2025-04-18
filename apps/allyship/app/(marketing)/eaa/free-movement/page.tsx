import React from 'react'
import Link from 'next/link'

export default function FreeMovementPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">Free Movement</h1>

      <div className="space-y-8">
        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="free-movement-principle"
          >
            The Principle of Free Movement
          </h2>
          <div className="space-y-4">
            <p>
              Article 6 of the European Accessibility Act establishes a key
              principle regarding the free movement of accessible products and
              services within the European Union:
            </p>
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
              "Member States shall not impede, for reasons related to
              accessibility requirements, the making available on the market in
              their territory of products or the provision of services in their
              territory that comply with this Directive."
            </blockquote>
            <p>
              This provision ensures that once products and services meet the
              accessibility requirements set out in the Directive, they can
              freely circulate throughout the EU market without facing
              additional barriers related to accessibility.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="harmonization">
            Harmonization and Single Market
          </h2>
          <div className="space-y-4">
            <p>
              The free movement principle is a cornerstone of the EU's single
              market. By harmonizing accessibility requirements across all
              Member States, the European Accessibility Act facilitates:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cross-border trade in accessible products and services</li>
              <li>Greater legal certainty for economic operators</li>
              <li>
                Economies of scale in the production of accessible products
              </li>
              <li>Increased competitiveness of EU businesses</li>
              <li>
                Wider choice and better prices for consumers with disabilities
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="market-barriers">
            Eliminating Market Barriers
          </h2>
          <div className="space-y-4">
            <p>
              Prior to the European Accessibility Act, divergent national
              accessibility requirements created significant barriers for
              economic operators. Manufacturers and service providers had to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Understand and comply with different sets of requirements in
                each Member State
              </li>
              <li>Adapt products and services for each national market</li>
              <li>
                Bear additional costs for compliance with multiple regulatory
                regimes
              </li>
              <li>
                Navigate complex legal frameworks when operating across borders
              </li>
            </ul>
            <p>
              By establishing a common set of accessibility requirements, the
              European Accessibility Act removes these barriers, allowing
              economic operators to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Design and manufacture products for the entire EU market</li>
              <li>
                Provide services across Member States with legal certainty
              </li>
              <li>Reduce compliance costs and administrative burdens</li>
              <li>
                Focus resources on innovation rather than regulatory compliance
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="ce-marking">
            CE Marking and Free Movement
          </h2>
          <div className="space-y-4">
            <p>
              For products covered by the European Accessibility Act, the CE
              marking plays a crucial role in facilitating free movement. When a
              manufacturer affixes the CE marking to a product, they declare
              that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The product complies with all applicable accessibility
                requirements
              </li>
              <li>An appropriate conformity assessment has been carried out</li>
              <li>
                The product can be legally placed on the market throughout the
                EU
              </li>
            </ul>
            <p>
              This system of CE marking provides a visible indication of
              compliance, simplifying market surveillance and enabling free
              movement of accessible products across the EU.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/existing-law"
            className="text-blue-600 hover:underline"
          >
            ← Existing Union Law
          </Link>
          <Link
            href="/eaa/obligations"
            className="text-blue-600 hover:underline"
          >
            Obligations of Economic Operators →
          </Link>
        </nav>
      </div>
    </>
  )
}
