import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { PAGES } from '../../constants/links'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Non-Compliance Procedures | European Accessibility Act',
  description:
    'Learn about the procedures for addressing non-compliant products and services under the European Accessibility Act (EAA).',
}

export default function NonComplianceProcedurePage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Procedures for Non-Compliant Products and Services.
          </h1>

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
                  href="#product-procedure"
                  id="product-procedure-link"
                >
                  Procedure for Non-Compliant Products.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#service-procedure"
                  id="service-procedure-link"
                >
                  Procedure for Non-Compliant Services.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#formal-non-compliance"
                  id="formal-non-compliance-link"
                >
                  Formal Non-Compliance.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#union-safeguard"
                  id="union-safeguard-link"
                >
                  EU Safeguard Procedure.
                </a>
              </li>
              <li>
                <a className="underline" href="#penalties" id="penalties-link">
                  Penalties and Remedies.
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
              Overview and Purpose.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act creates clear procedures for
                handling products and services that do not meet accessibility
                requirements. These procedures help ensure that non-compliant
                products and services are identified, fixed, or removed from the
                market when needed.
              </p>
              <p>
                The EAA takes a balanced approach that protects the rights of
                people with disabilities while giving businesses proper
                opportunities to fix non-compliance issues before stronger
                measures are taken.
              </p>
              <p>
                These procedures are essential for the effective implementation
                of the EAA and help maintain the integrity of the single market
                while ensuring consistent accessibility across the EU.
              </p>
            </div>
          </section>

          <section aria-labelledby="product-procedure">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="product-procedure"
              tabIndex={-1}
            >
              Procedure for Non-Compliant Products.
            </h2>
            <div className="space-y-4">
              <p>
                When market surveillance authorities find a non-compliant
                product, they follow these steps:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Initial evaluation.</strong> Authorities check the
                  product against applicable accessibility requirements.
                </li>
                <li>
                  <strong>Notification.</strong> If non-compliance is found, the
                  authorities inform the relevant business (manufacturer,
                  importer, or distributor).
                </li>
                <li>
                  <strong>Opportunity for response.</strong> The business is
                  given the chance to present their observations and explain any
                  claimed exceptions.
                </li>
                <li>
                  <strong>Required corrective action.</strong> Authorities
                  require the business to take appropriate corrective measures
                  to bring the product into compliance.
                </li>
                <li>
                  <strong>Escalation if necessary.</strong> If the business
                  fails to take adequate corrective action, authorities can:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Restrict or prohibit the product's availability on the
                      market.
                    </li>
                    <li>Ensure the product is withdrawn from the market.</li>
                    <li>Ensure the product is recalled.</li>
                  </ul>
                </li>
                <li>
                  <strong>Immediate action for serious risk.</strong> In cases
                  where a product presents a serious risk, authorities can take
                  immediate provisional measures without waiting for the
                  business to respond.
                </li>
              </ol>
              <p>
                All measures taken must be proportionate to the level of
                non-compliance and communicated promptly to the business.
              </p>
            </div>
          </section>

          <section aria-labelledby="service-procedure">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="service-procedure"
              tabIndex={-1}
            >
              Procedure for Non-Compliant Services.
            </h2>
            <div className="space-y-4">
              <p>
                For services found to be non-compliant with accessibility
                requirements, the following procedure applies:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Initial assessment.</strong> Authorities responsible
                  for checking compliance of services evaluate the service
                  against applicable requirements.
                </li>
                <li>
                  <strong>Notification.</strong> The service provider is
                  informed of the identified non-compliance.
                </li>
                <li>
                  <strong>Corrective measures.</strong> The service provider is
                  required to take corrective action to bring the service into
                  conformity with accessibility requirements.
                </li>
                <li>
                  <strong>Follow-up verification.</strong> Authorities check
                  that corrective action has been taken and is sufficient to
                  address the non-compliance.
                </li>
                <li>
                  <strong>Further action.</strong> If the service provider fails
                  to take adequate corrective measures, authorities can:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Require stopping the service.</li>
                    <li>Impose penalties according to national legislation.</li>
                    <li>
                      Take other appropriate measures to ensure compliance.
                    </li>
                  </ul>
                </li>
              </ol>
              <p>
                Member States establish their own specific procedures for
                addressing non-compliant services, but they must align with
                these general principles established in the EAA.
              </p>
              <p>
                For more information about service compliance, see the
                <Link
                  href={PAGES['5.2-service-conformity']?.fullPath || '#'}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Compliance of Services
                </Link>{' '}
                page.
              </p>
            </div>
          </section>

          <section aria-labelledby="formal-non-compliance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="formal-non-compliance"
              tabIndex={-1}
            >
              Formal Non-Compliance.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA identifies specific cases of formal non-compliance that
                trigger action by authorities. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The CE marking has been added in violation of Article 30 of
                  Regulation (EC) No 765/2008 or Article 18 of the EAA.
                </li>
                <li>The CE marking has not been added.</li>
                <li>
                  The EU declaration of conformity has not been created or has
                  been created incorrectly.
                </li>
                <li>
                  The technical documentation is unavailable or incomplete.
                </li>
                <li>
                  Product identification information or manufacturer/importer
                  contact details are missing, false, or incomplete.
                </li>
                <li>
                  Any other administrative requirement of the EAA has not been
                  met.
                </li>
              </ul>
              <p>
                When formal non-compliance is identified, authorities require
                the business to correct the issue. If the non-compliance
                persists, authorities take appropriate measures to restrict or
                prohibit the product's availability or ensure it is withdrawn or
                recalled from the market.
              </p>
              <p>
                For more information about CE marking, see the
                <Link
                  href={PAGES['5.4-ce-marking']?.fullPath || '#'}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  CE Marking
                </Link>{' '}
                page.
              </p>
            </div>
          </section>

          <section aria-labelledby="union-safeguard">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="union-safeguard"
              tabIndex={-1}
            >
              EU Safeguard Procedure.
            </h2>
            <div className="space-y-4">
              <p>
                For cases where there is disagreement between Member States
                about actions taken against non-compliant products, the EAA
                establishes an EU safeguard procedure:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  When one Member State takes measures against a product, it
                  must inform the Commission and other Member States.
                </li>
                <li>
                  Information provided must include the reasons for the
                  measures, the non-compliance identified, and the business's
                  arguments.
                </li>
                <li>
                  The Commission evaluates the national measures and determines
                  if they are justified.
                </li>
                <li>
                  If the measures are deemed justified, all Member States must
                  ensure the non-compliant product is withdrawn from their
                  markets.
                </li>
                <li>
                  If the measures are deemed unjustified, the Member State must
                  withdraw them.
                </li>
                <li>
                  The Commission communicates its decision to all Member States
                  and the business concerned.
                </li>
              </ol>
              <p>
                This procedure ensures coordinated action across the EU and
                prevents fragmentation of the single market while maintaining
                high standards of accessibility.
              </p>
            </div>
          </section>

          <section aria-labelledby="penalties">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="penalties"
              tabIndex={-1}
            >
              Penalties and Remedies.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA requires Member States to establish rules on penalties
                for breaking national provisions adopted under the directive:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Penalties must be effective, proportionate, and dissuasive.
                </li>
                <li>
                  They must consider the extent of the non-compliance and the
                  number of units of non-complying products or services.
                </li>
                <li>
                  Penalties should be accompanied by effective remedial
                  mechanisms in case of non-compliance.
                </li>
                <li>
                  Member States must notify the Commission of these rules and
                  measures and promptly report any subsequent changes.
                </li>
                <li>
                  Penalties should not serve as an alternative to businesses
                  fulfilling their accessibility obligations.
                </li>
              </ul>
              <p>
                This penalty framework helps ensure that businesses take their
                accessibility obligations seriously and address non-compliance
                issues promptly.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="5.6-non-conformity-procedures" />
          </footer>
        </div>
      </div>
    </section>
  )
}
