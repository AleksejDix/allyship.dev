import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { PAGES } from '../../constants/links'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'National Authorities | European Accessibility Act',
  description:
    'Information about the role and responsibilities of national authorities under the European Accessibility Act (EAA), including market surveillance authorities and notified bodies.',
}

export default function NationalAuthoritiesPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            National Authorities.
          </h1>

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
                  href="#market-surveillance"
                  id="market-surveillance-link"
                >
                  Market Surveillance Authorities.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#powers-responsibilities"
                  id="powers-responsibilities-link"
                >
                  Powers and Responsibilities.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#notified-bodies"
                  id="notified-bodies-link"
                >
                  Notified Bodies.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#coordination"
                  id="coordination-link"
                >
                  Coordination Mechanisms.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#practical-implications"
                  id="practical-implications-link"
                >
                  Practical Implications.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert py-4 pt-2"
        id="eaa-content"
        aria-labelledby="page-title"
      >
        <div className="space-y-8">
          <section aria-labelledby="overview-heading">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act (EAA) relies on national
                authorities for implementation, enforcement, and oversight. Each
                EU Member State must designate appropriate authorities and
                provide them with the necessary resources and powers to fulfill
                their responsibilities under the EAA.
              </p>
              <p>The national authorities play a crucial role in ensuring:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Products and services meet accessibility requirements</li>
                <li>Economic operators fulfill their obligations</li>
                <li>Complaints from consumers are addressed</li>
                <li>
                  Non-compliant products and services are identified and
                  corrected
                </li>
                <li>Information about compliance is shared across the EU</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="market-surveillance-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="market-surveillance"
              tabIndex={-1}
            >
              Market Surveillance Authorities.
            </h2>
            <div className="space-y-4">
              <p>
                Market surveillance authorities (MSAs) are responsible for
                ensuring that products placed on the market comply with EAA
                requirements. Each Member State must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Designate MSAs</strong> - Establish or identify
                  existing agencies responsible for market surveillance of
                  accessibility-related aspects of products
                </li>
                <li>
                  <strong>Ensure adequate resources</strong> - Provide MSAs with
                  the necessary resources, expertise, and powers to effectively
                  carry out their duties
                </li>
                <li>
                  <strong>Define procedures</strong> - Establish procedures for
                  verifying compliance and handling non-compliant products
                </li>
                <li>
                  <strong>Enable information sharing</strong> - Ensure MSAs can
                  share information with authorities in other Member States
                </li>
              </ul>
              <p>
                MSAs typically include consumer protection agencies, product
                safety authorities, or specialized accessibility regulation
                bodies, depending on the Member State's administrative
                structure.
              </p>
            </div>
          </section>

          <section aria-labelledby="powers-responsibilities-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="powers-responsibilities"
              tabIndex={-1}
            >
              Powers and Responsibilities.
            </h2>
            <div className="space-y-4">
              <p>
                National authorities under the EAA are granted specific powers
                and responsibilities, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Product verification</strong> - Authority to inspect
                  and test products to verify compliance with accessibility
                  requirements
                </li>
                <li>
                  <strong>Documentation review</strong> - Power to request and
                  review technical documentation, EU declarations of conformity,
                  and other compliance documentation
                </li>
                <li>
                  <strong>Service assessment</strong> - Authority to assess
                  whether services comply with the applicable accessibility
                  requirements
                </li>
                <li>
                  <strong>Enforcement measures</strong> - Power to:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Require economic operators to take corrective action
                    </li>
                    <li>Withdraw non-compliant products from the market</li>
                    <li>
                      Prohibit or restrict the provision of non-compliant
                      services
                    </li>
                    <li>Impose penalties for non-compliance</li>
                  </ul>
                </li>
                <li>
                  <strong>Complaint handling</strong> - Responsibility to
                  receive and investigate complaints from consumers regarding
                  non-compliant products and services
                </li>
                <li>
                  <strong>Reporting</strong> - Obligation to report to the
                  European Commission on enforcement activities and market
                  surveillance
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="notified-bodies-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="notified-bodies"
              tabIndex={-1}
            >
              Notified Bodies.
            </h2>
            <div className="space-y-4">
              <p>
                In addition to market surveillance authorities, Member States
                may designate notified bodies to carry out specific conformity
                assessment tasks:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Competence assessment</strong> - Member States must
                  assess and verify that notified bodies have the necessary
                  expertise, independence, and resources
                </li>
                <li>
                  <strong>Third-party verification</strong> - Notified bodies
                  provide independent verification of product conformity with
                  accessibility requirements
                </li>
                <li>
                  <strong>Technical assessment</strong> - They evaluate
                  technical documentation and conduct product tests when
                  required
                </li>
                <li>
                  <strong>Certificate issuance</strong> - Issue certificates of
                  conformity for products that meet the requirements
                </li>
              </ul>
              <p>
                While the EAA primarily relies on manufacturers'
                self-declaration of conformity for most products, notified
                bodies may play a role in specific cases or when additional
                verification is needed.
              </p>
            </div>
          </section>

          <section aria-labelledby="coordination-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="coordination"
              tabIndex={-1}
            >
              Coordination Mechanisms.
            </h2>
            <div className="space-y-4">
              <p>
                To ensure consistent application of the EAA across Member
                States, several coordination mechanisms exist:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>ADCO Groups</strong> - Administrative Cooperation
                  Groups bring together representatives from national market
                  surveillance authorities to coordinate enforcement activities
                </li>
                <li>
                  <strong>Information exchange systems</strong> - Platforms for
                  sharing information about non-compliant products, enforcement
                  decisions, and best practices
                </li>
                <li>
                  <strong>European Commission oversight</strong> - The
                  Commission monitors implementation and provides guidance to
                  national authorities
                </li>
                <li>
                  <strong>Stakeholder involvement</strong> - Consultation with
                  organizations representing persons with disabilities and
                  economic operators
                </li>
              </ul>
              <p>
                These coordination mechanisms help prevent fragmentation and
                ensure that economic operators face consistent requirements and
                enforcement across the EU.
              </p>
            </div>
          </section>

          <section aria-labelledby="practical-implications-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="practical-implications"
              tabIndex={-1}
            >
              Practical Implications.
            </h2>
            <div className="space-y-4">
              <p>
                For economic operators, understanding the role of national
                authorities has several practical implications:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Documentation readiness</strong> - Operators should
                  maintain complete and up-to-date documentation to respond to
                  authority requests promptly
                </li>
                <li>
                  <strong>Cooperation procedures</strong> - Establish internal
                  procedures for cooperating with national authorities during
                  inspections or compliance checks
                </li>
                <li>
                  <strong>Multiple market awareness</strong> - Be aware that
                  products or services marketed in multiple EU countries may be
                  subject to checks by authorities in any Member State
                </li>
                <li>
                  <strong>Communication channels</strong> - Maintain open
                  channels with relevant authorities for guidance on compliance
                  questions
                </li>
                <li>
                  <strong>Complaint management</strong> - Implement robust
                  complaint handling systems, as consumer complaints may be
                  forwarded to or investigated by national authorities
                </li>
              </ul>
              <p>
                Proactive engagement with national authorities can help economic
                operators stay ahead of compliance issues and demonstrate
                commitment to accessibility.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="6.1-authorities" />
          </footer>
        </div>
      </div>
    </section>
  )
}
