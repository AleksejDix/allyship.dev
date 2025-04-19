import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  COMPLIANCE_LINKS,
  ANNEXES_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Market Surveillance | European Accessibility Act',
  description:
    'Learn about market surveillance procedures for products under the European Accessibility Act (EAA) and how authorities monitor compliance.',
}

export default function MarketSurveillancePage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Market Surveillance of Products
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
                  href="#authorities"
                  id="authorities-link"
                >
                  Market Surveillance Authorities
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#disproportionate-burden"
                  id="disproportionate-burden-link"
                >
                  Checking Disproportionate Burden Claims
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#procedures"
                  id="procedures-link"
                >
                  Surveillance Procedures
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#safeguard-procedure"
                  id="safeguard-procedure-link"
                >
                  Union Safeguard Procedure
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#cooperation"
                  id="cooperation-link"
                >
                  Cooperation and Information Sharing
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
                Market surveillance is a critical component of the European
                Accessibility Act's enforcement framework. It involves
                monitoring products placed on the market to ensure they comply
                with the accessibility requirements set forth in the directive.
              </p>
              <p>
                Article 19 of the EAA establishes that market surveillance of
                products shall follow the provisions set out in Regulation (EC)
                No 765/2008, which lays down the requirements for accreditation
                and market surveillance relating to the marketing of products.
              </p>
              <p>
                The primary goal is to prevent non-compliant products from
                reaching the market, protect consumers with disabilities, and
                ensure fair competition among economic operators by ensuring all
                follow the same accessibility standards.
              </p>
            </div>
          </section>

          <section aria-labelledby="authorities">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="authorities"
              tabIndex={-1}
            >
              Market Surveillance Authorities
            </h2>
            <div className="space-y-4">
              <p>
                Each Member State is responsible for establishing and
                maintaining effective market surveillance authorities. These
                authorities:
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
                  Can require economic operators to take corrective measures
                  where non-compliance is found
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

          <section aria-labelledby="disproportionate-burden">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="disproportionate-burden"
              tabIndex={-1}
            >
              Checking Disproportionate Burden Claims
            </h2>
            <div className="space-y-4">
              <p>
                The EAA includes a specific provision for market surveillance of
                products where economic operators have claimed exceptions based
                on disproportionate burden or fundamental alteration (under
                Article 14). When checking these claims, authorities shall:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Verify that the assessment has been conducted by the economic
                  operator
                </li>
                <li>
                  Review the assessment and its results, checking the correct
                  use of the criteria set out in Annex VI
                </li>
                <li>
                  Check compliance with the applicable accessibility
                  requirements
                </li>
                <li>
                  Take appropriate measures in case of non-compliance or
                  improper use of the exception
                </li>
              </ul>
              <p>
                This ensures that exceptions to accessibility requirements are
                only granted in legitimate cases where implementing them would
                genuinely result in disproportionate burden.
              </p>
              <p>
                For more information about disproportionate burden assessments,
                see the
                <Link
                  href={ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Annex IV: Disproportionate Burden Assessment
                </Link>{' '}
                page.
              </p>
            </div>
          </section>

          <section aria-labelledby="procedures">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="procedures"
              tabIndex={-1}
            >
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
                  documentation checks, physical inspections, or laboratory
                  tests
                </li>
                <li>
                  <strong>Communication with economic operators</strong> -
                  Authorities inform the relevant economic operator about
                  identified non-compliance
                </li>
                <li>
                  <strong>Opportunity for correction</strong> - Economic
                  operators are given the opportunity to address issues and
                  implement corrective measures
                </li>
                <li>
                  <strong>Enforcement actions</strong> - Where necessary,
                  authorities can require products to be withdrawn from the
                  market or impose other restrictions
                </li>
                <li>
                  <strong>Coordination</strong> - Authorities coordinate
                  activities across Member States to ensure consistent
                  application of requirements
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="safeguard-procedure">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="safeguard-procedure"
              tabIndex={-1}
            >
              Union Safeguard Procedure
            </h2>
            <div className="space-y-4">
              <p>
                The EAA establishes a safeguard procedure that applies in cases
                of disagreement between Member States over measures taken
                regarding non-compliant products:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  If authorities in one Member State take measures against a
                  product, they must inform the European Commission and other
                  Member States
                </li>
                <li>
                  The communication must include details about the
                  non-compliance, the measures taken, and the economic
                  operator's arguments
                </li>
                <li>
                  Other Member States have the opportunity to raise objections
                  to the measures
                </li>
                <li>
                  The Commission evaluates the justification for the measures
                  and determines whether they are appropriate
                </li>
                <li>
                  If the measures are deemed justified, all Member States must
                  ensure the non-compliant product is withdrawn from their
                  markets
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

          <section aria-labelledby="cooperation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="cooperation"
              tabIndex={-1}
            >
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
                This collaborative approach ensures more efficient
                identification of non-compliant products and more consistent
                application of accessibility requirements across the EU.
              </p>
            </div>
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
                  href={COMPLIANCE_LINKS.SERVICE_COMPLIANCE.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Compliance of Services</span>
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
