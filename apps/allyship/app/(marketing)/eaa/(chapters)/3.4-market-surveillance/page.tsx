import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Market Surveillance | European Accessibility Act',
  description:
    'Learn about market surveillance procedures for products under the European Accessibility Act (EAA) and how authorities monitor compliance.',
}

export default function MarketSurveillancePage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">
        Market Surveillance of Products
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview and Purpose
          </h2>
          <div className="space-y-4">
            <p>
              Market surveillance is a critical component of the European
              Accessibility Act's enforcement framework. It involves monitoring
              products placed on the market to ensure they comply with the
              accessibility requirements set forth in the directive.
            </p>
            <p>
              Article 19 of the EAA establishes that market surveillance of
              products shall follow the provisions set out in Regulation (EC) No
              765/2008, which lays down the requirements for accreditation and
              market surveillance relating to the marketing of products.
            </p>
            <p>
              The primary goal is to prevent non-compliant products from
              reaching the market, protect consumers with disabilities, and
              ensure fair competition among economic operators by ensuring all
              follow the same accessibility standards.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="authorities">
            Market Surveillance Authorities
          </h2>
          <div className="space-y-4">
            <p>
              Each Member State is responsible for establishing and maintaining
              effective market surveillance authorities. These authorities:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Have the power to take appropriate measures to ensure products
                comply with accessibility requirements
              </li>
              <li>
                Can request all necessary information from economic operators
              </li>
              <li>
                Are authorized to carry out checks and inspections of products
              </li>
              <li>May take samples of products for testing and analysis</li>
              <li>
                Can require economic operators to take corrective measures where
                non-compliance is found
              </li>
              <li>
                Have the authority to withdraw or recall products where
                necessary
              </li>
            </ul>
            <p>
              The EAA emphasizes that Member States should allocate sufficient
              powers and resources to their market surveillance authorities to
              ensure effective monitoring.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="disproportionate-burden"
          >
            Checking Disproportionate Burden Claims
          </h2>
          <div className="space-y-4">
            <p>
              The EAA includes a specific provision for market surveillance of
              products where economic operators have claimed exceptions based on
              disproportionate burden or fundamental alteration (under Article
              14). When checking these claims, authorities shall:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Verify that the assessment has been conducted by the economic
                operator
              </li>
              <li>
                Review the assessment and its results, checking the correct use
                of the criteria set out in Annex VI
              </li>
              <li>
                Check compliance with the applicable accessibility requirements
              </li>
              <li>
                Take appropriate measures in case of non-compliance or improper
                use of the exception
              </li>
            </ul>
            <p>
              This ensures that exceptions to accessibility requirements are
              only granted in legitimate cases where implementing them would
              genuinely result in disproportionate burden.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="procedures">
            Surveillance Procedures
          </h2>
          <div className="space-y-4">
            <p>
              Market surveillance follows established procedures to ensure
              consistent enforcement:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Initial assessment</strong> - Authorities evaluate
                products against accessibility requirements through
                documentation checks, physical inspections, or laboratory tests
              </li>
              <li>
                <strong>Communication with economic operators</strong> -
                Authorities inform the relevant economic operator about
                identified non-compliance
              </li>
              <li>
                <strong>Opportunity for correction</strong> - Economic operators
                are given the opportunity to address issues and implement
                corrective measures
              </li>
              <li>
                <strong>Enforcement actions</strong> - Where necessary,
                authorities can require products to be withdrawn from the market
                or impose other restrictions
              </li>
              <li>
                <strong>Coordination</strong> - Authorities coordinate
                activities across Member States to ensure consistent application
                of requirements
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="safeguard-procedure">
            Union Safeguard Procedure
          </h2>
          <div className="space-y-4">
            <p>
              The EAA establishes a safeguard procedure that applies in cases of
              disagreement between Member States over measures taken regarding
              non-compliant products:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                If authorities in one Member State take measures against a
                product, they must inform the European Commission and other
                Member States
              </li>
              <li>
                The communication must include details about the non-compliance,
                the measures taken, and the economic operator's arguments
              </li>
              <li>
                Other Member States have the opportunity to raise objections to
                the measures
              </li>
              <li>
                The Commission evaluates the justification for the measures and
                determines whether they are appropriate
              </li>
              <li>
                If the measures are deemed justified, all Member States must
                ensure the non-compliant product is withdrawn from their markets
              </li>
              <li>
                If the measures are deemed unjustified, the Member State must
                withdraw them
              </li>
            </ul>
            <p>
              This procedure allows for the resolution of disputes while
              ensuring consistent enforcement across the EU single market.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="cooperation">
            Cooperation and Information Sharing
          </h2>
          <div className="space-y-4">
            <p>
              Effective market surveillance relies on cooperation between
              various stakeholders:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Market surveillance authorities from different Member States
                share information and coordinate activities
              </li>
              <li>
                The Commission facilitates exchange of information and best
                practices among authorities
              </li>
              <li>
                Authorities cooperate with organizations representing persons
                with disabilities when carrying out their duties
              </li>
              <li>
                Economic operators are required to cooperate with authorities
                and provide necessary information
              </li>
              <li>
                The Commission may establish a working group to facilitate
                exchange of information and ensure coherent application of the
                directive
              </li>
            </ul>
            <p>
              This collaborative approach ensures more efficient identification
              of non-compliant products and more consistent application of
              accessibility requirements across the EU.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/ce-marking"
            className="text-blue-600 hover:underline"
          >
            ← CE Marking
          </Link>
          <Link
            href="/eaa/service-compliance"
            className="text-blue-600 hover:underline"
          >
            Compliance of Services →
          </Link>
        </nav>
      </div>
    </>
  )
}
