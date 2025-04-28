import React from 'react'
import { Metadata } from 'next'

import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Market Surveillance | European Accessibility Act',
  description:
    'Understanding market surveillance procedures under the European Accessibility Act (EAA) and how authorities monitor and enforce compliance.',
}

export default function MarketSurveillancePage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">Market Surveillance.</h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#authorities"
                  id="authorities-link"
                >
                  Market Surveillance Authorities.
                </a>
              </li>
              <li>
                <a className="underline" href="#powers" id="powers-link">
                  Powers and Procedures.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#non-compliance"
                  id="non-compliance-link"
                >
                  Handling Non-Compliance.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#legal-framework"
                  id="legal-framework-link"
                >
                  Legal Framework.
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
              Overview of Market Surveillance.
            </h2>
            <div className="space-y-4">
              <p>
                Market surveillance is the system of monitoring and enforcing
                compliance with the European Accessibility Act. It ensures that
                products and services available in the EU market meet the
                required accessibility standards.
              </p>
              <p>
                Under the EAA, each EU Member State must establish market
                surveillance authorities that monitor compliance, handle
                complaints, and take action against non-compliant products and
                services.
              </p>
              <p>
                This oversight helps protect the rights of persons with
                disabilities and ensures a level playing field for businesses
                across the EU.
              </p>
            </div>
          </section>

          <section aria-labelledby="authorities">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="authorities"
              tabIndex={-1}
            >
              Market Surveillance Authorities.
            </h2>
            <div className="space-y-4">
              <p>
                Each Member State must designate authorities responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Monitoring products and services available in their territory
                </li>
                <li>Checking documentation and evidence of conformity</li>
                <li>Receiving and investigating complaints from consumers</li>
                <li>
                  Taking action against economic operators who don't comply with
                  the EAA
                </li>
                <li>Cooperating with other EU Member States' authorities</li>
              </ul>
              <p>
                The names and specific responsibilities of these authorities
                vary by country, but they are typically part of consumer
                protection or accessibility agencies.
              </p>
            </div>
          </section>

          <section aria-labelledby="powers">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="powers"
              tabIndex={-1}
            >
              Powers and Procedures.
            </h2>
            <div className="space-y-4">
              <p>
                Market surveillance authorities have significant powers to
                ensure compliance:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Documentation review:</strong> Requesting and
                  examining technical documentation, EU Declarations of
                  Conformity, and other evidence
                </li>
                <li>
                  <strong>Product examination:</strong> Testing products to
                  verify they meet accessibility requirements
                </li>
                <li>
                  <strong>Service assessment:</strong> Evaluating how services
                  meet accessibility requirements
                </li>
                <li>
                  <strong>Inspections:</strong> Conducting on-site visits to
                  businesses
                </li>
                <li>
                  <strong>Information requests:</strong> Requiring economic
                  operators to provide information about supply chains and
                  distribution
                </li>
                <li>
                  <strong>Enforcement actions:</strong> Ordering corrective
                  measures, withdrawals, or recalls
                </li>
              </ul>
              <p>
                These authorities follow risk-based approaches to prioritize
                their work, focusing on products and services with the highest
                potential impact on people with disabilities.
              </p>
            </div>
          </section>

          <section aria-labelledby="non-compliance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="non-compliance"
              tabIndex={-1}
            >
              Handling Non-Compliance.
            </h2>
            <div className="space-y-4">
              <p>
                When non-compliant products or services are identified,
                authorities follow these steps:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Initial assessment:</strong> Determining the nature
                  and extent of non-compliance
                </li>
                <li>
                  <strong>Notification:</strong> Informing the economic operator
                  about the identified non-compliance issues
                </li>
                <li>
                  <strong>Corrective action:</strong> Requiring the operator to
                  fix the accessibility issues within a set timeframe
                </li>
                <li>
                  <strong>Follow-up:</strong> Verifying that the required
                  changes have been implemented properly
                </li>
                <li>
                  <strong>Escalation:</strong> If compliance is not achieved,
                  authorities can:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Restrict or prohibit making the product available on the
                      market
                    </li>
                    <li>Order the withdrawal or recall of the product</li>
                    <li>
                      Require service providers to stop offering non-compliant
                      services
                    </li>
                    <li>Impose penalties according to national legislation</li>
                  </ul>
                </li>
              </ol>
              <p>
                The approach prioritizes bringing products and services into
                compliance rather than immediately imposing penalties, but
                serious or repeated violations may lead to significant
                sanctions.
              </p>
            </div>
          </section>

          <section aria-labelledby="legal-framework">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="legal-framework"
              tabIndex={-1}
            >
              Legal Framework.
            </h2>
            <div className="space-y-4">
              <p>
                Market surveillance for the EAA operates within a broader EU
                framework:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>
                    Regulation (EU) 2019/1020 on market surveillance and
                    compliance:
                  </strong>{' '}
                  Provides the overall framework for market surveillance across
                  different EU product legislation
                </li>
                <li>
                  <strong>Articles 19 to 22 of the EAA:</strong> Specific
                  provisions for market surveillance under the European
                  Accessibility Act
                </li>
                <li>
                  <strong>
                    ICSMS (Information and Communication System for Market
                    Surveillance):
                  </strong>{' '}
                  EU-wide system for sharing information about non-compliant
                  products
                </li>
                <li>
                  <strong>RAPEX (Rapid Alert System):</strong> System for rapid
                  exchange of information about dangerous products
                </li>
              </ul>
              <p>
                These legal instruments and information systems help ensure
                consistent and effective enforcement across the EU single
                market.
              </p>
            </div>
          </section>

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
              <li>Article 19. Market surveillance of products.</li>
              <li>
                Article 20. Procedure for dealing with products presenting a
                risk related to accessibility at national level.
              </li>
              <li>Article 21. Union safeguard procedure.</li>
              <li>Article 22. Formal non-compliance.</li>
              <li>Article 29. Penalties.</li>
            </ul>
          </section>

          <footer>
            <ChapterNavigation currentPageId="5.8-market-surveillance" />
          </footer>
        </div>
      </div>
    </section>
  )
}
