import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { PAGES } from '../../constants/links'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Monitoring and Market Surveillance | European Accessibility Act',
  description:
    'Comprehensive guide to monitoring, market surveillance, and enforcement measures under the European Accessibility Act (EAA).',
}

export default function MonitoringOverviewPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Monitoring and Market Surveillance.
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
                  Market Surveillance.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#enforcement"
                  id="enforcement-link"
                >
                  Enforcement Measures.
                </a>
              </li>
              <li>
                <a className="underline" href="#penalties" id="penalties-link">
                  Penalties.
                </a>
              </li>
              <li>
                <a className="underline" href="#reporting" id="reporting-link">
                  Reporting Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#national-authorities"
                  id="national-authorities-link"
                >
                  National Authorities.
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
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                To ensure effective implementation and compliance with the
                European Accessibility Act (EAA), a robust system of monitoring
                and market surveillance has been established. This system
                verifies that products and services within the scope of the EAA
                meet the required accessibility standards and that economic
                operators fulfill their obligations.
              </p>
              <p>
                The monitoring and market surveillance framework of the EAA
                includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Market surveillance for products</li>
                <li>Compliance verification for services</li>
                <li>Enforcement measures</li>
                <li>Penalties for non-compliance</li>
                <li>Regular reporting and evaluation</li>
              </ul>
              <p>
                These mechanisms ensure that the EAA's requirements are
                effectively implemented and that persons with disabilities can
                benefit from improved accessibility of products and services.
              </p>
            </div>
          </section>

          <section aria-labelledby="market-surveillance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="market-surveillance"
              tabIndex={-1}
            >
              Market Surveillance.
            </h2>
            <div className="space-y-4">
              <p>
                Market surveillance is the system through which Member States
                verify that products meet the EAA's accessibility requirements.
                It is carried out according to Regulation (EU) 2019/1020 on
                market surveillance and compliance of products.
              </p>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Market Surveillance Authorities.
              </h3>
              <p>
                Each Member State must designate market surveillance authorities
                with the responsibility and powers to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Verify that products comply with the accessibility
                  requirements
                </li>
                <li>
                  Check that economic operators have fulfilled their obligations
                </li>
                <li>
                  Investigate complaints from consumers and other stakeholders
                  about non-compliant products
                </li>
                <li>
                  Take appropriate actions when non-compliant products are
                  identified
                </li>
              </ul>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Surveillance Activities.
              </h3>
              <p>
                Market surveillance authorities carry out various activities to
                monitor compliance, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Document reviews: Checking technical documentation, EU
                  declarations of conformity, and other compliance documentation
                </li>
                <li>
                  Product sampling: Taking product samples for testing and
                  analysis
                </li>
                <li>
                  On-site inspections: Visiting manufacturers, importers, and
                  distributors to verify compliance
                </li>
                <li>
                  Online surveillance: Monitoring products sold through online
                  marketplaces
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="enforcement">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="enforcement"
              tabIndex={-1}
            >
              Enforcement Measures.
            </h2>
            <div className="space-y-4">
              <p>
                When non-compliance is detected, market surveillance authorities
                have a range of enforcement measures at their disposal:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Requiring corrective actions:</strong> Instructing
                  economic operators to bring their products into compliance
                  within a specified timeframe
                </li>
                <li>
                  <strong>Restricting market availability:</strong> Prohibiting
                  or restricting the availability of non-compliant products on
                  the market
                </li>
                <li>
                  <strong>Product recalls:</strong> Ordering the withdrawal or
                  recall of non-compliant products already placed on the market
                </li>
                <li>
                  <strong>Public warnings:</strong> Issuing public warnings
                  about non-compliant products
                </li>
              </ul>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Service Compliance Enforcement.
              </h3>
              <p>
                For services, Member States must establish appropriate
                mechanisms to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Verify that services comply with the EAA's accessibility
                  requirements
                </li>
                <li>
                  Follow up on complaints or reports about non-compliant
                  services
                </li>
                <li>
                  Verify that service providers have conducted the required
                  conformity assessment
                </li>
                <li>
                  Take measures to ensure that service providers remedy
                  instances of non-compliance
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="penalties">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="penalties"
              tabIndex={-1}
            >
              Penalties.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA requires Member States to establish rules on penalties
                for infringements of the national provisions adopted pursuant to
                the Directive. These penalties must be:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Effective:</strong> Having a genuine impact on
                  non-compliant operators
                </li>
                <li>
                  <strong>Proportionate:</strong> Appropriate to the severity of
                  the infringement
                </li>
                <li>
                  <strong>Dissuasive:</strong> Discouraging future
                  non-compliance
                </li>
              </ul>
              <p>
                Penalties must also take into account the extent of the
                non-compliance, including the number of units of non-complying
                products or services concerned, as well as the number of people
                affected.
              </p>
              <p>
                Member States are required to notify the European Commission of
                their penalty provisions and any subsequent amendments. While
                the specific penalties vary between Member States, they may
                include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Administrative fines</li>
                <li>Orders to cease non-compliant practices</li>
                <li>Suspension of business activities</li>
                <li>In severe cases, criminal sanctions</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="reporting">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="reporting"
              tabIndex={-1}
            >
              Reporting Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA includes several reporting obligations to ensure
                transparency and continuous improvement:
              </p>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Member State Reporting.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Member States must report to the Commission on the
                  implementation of the EAA by June 28, 2030, and every five
                  years thereafter
                </li>
                <li>
                  Reports must cover enforcement actions, penalties applied,
                  data on accessibility compliance, and the effectiveness of the
                  implemented measures
                </li>
                <li>
                  Member States must publish their reports in accessible formats
                </li>
              </ul>
              <h3 className="text-xl font-medium mb-2 mt-6">
                European Commission Reporting.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Commission must submit a report to the European
                  Parliament, the Council, the European Economic and Social
                  Committee, and the Committee of the Regions on the application
                  of the EAA by July 28, 2031
                </li>
                <li>
                  The report will assess whether the EAA has achieved its
                  objectives and whether it needs to be amended to improve
                  accessibility
                </li>
                <li>
                  The Commission's report must take into account the views of
                  stakeholders, including organizations representing persons
                  with disabilities
                </li>
              </ul>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Market Surveillance Reporting.
              </h3>
              <p>
                Market surveillance authorities must regularly report on their
                surveillance activities, providing information on:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Number of inspections conducted</li>
                <li>Types and numbers of non-compliance detected</li>
                <li>Enforcement measures taken</li>
                <li>Penalties applied</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="national-authorities">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="national-authorities"
              tabIndex={-1}
            >
              National Authorities.
            </h2>
            <div className="space-y-4">
              <p>
                To effectively implement the EAA, each Member State must
                establish or designate various authorities:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Market Surveillance Authorities:</strong> Responsible
                  for monitoring products and ensuring they comply with
                  accessibility requirements
                </li>
                <li>
                  <strong>Service Monitoring Authorities:</strong> Tasked with
                  verifying that services meet the EAA's accessibility
                  requirements
                </li>
                <li>
                  <strong>Notifying Authorities:</strong> Responsible for
                  setting up and carrying out the procedures for the assessment
                  and notification of conformity assessment bodies
                </li>
                <li>
                  <strong>Enforcement Authorities:</strong> Empowered to apply
                  penalties and take enforcement actions against non-compliant
                  economic operators
                </li>
              </ul>
              <p>
                These authorities must have sufficient resources, expertise, and
                operational independence to perform their tasks effectively.
                They also must cooperate with each other, with authorities in
                other Member States, and with the European Commission to ensure
                consistent implementation and enforcement of the EAA across the
                EU.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="6.0-monitoring" />
          </footer>
        </div>
      </div>
    </section>
  )
}
