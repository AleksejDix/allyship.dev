import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Non-Compliance Procedures | European Accessibility Act',
  description:
    'Learn about the procedures for addressing non-compliant products and services under the European Accessibility Act (EAA).',
}

export default function NonComplianceProcedurePage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">
        Procedures for Non-Compliant Products and Services
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview and Purpose
          </h2>
          <div className="space-y-4">
            <p>
              The European Accessibility Act establishes comprehensive
              procedures for addressing products and services that do not comply
              with accessibility requirements. These procedures aim to ensure
              that non-compliant products and services are identified, brought
              into compliance, or removed from the market when necessary.
            </p>
            <p>
              The EAA provides a balanced approach that protects the rights of
              persons with disabilities while ensuring economic operators have
              appropriate opportunities to address non-compliance issues before
              more severe measures are taken.
            </p>
            <p>
              These procedures are essential for the effective implementation of
              the EAA and help maintain the integrity of the single market while
              ensuring a consistent level of accessibility across the EU.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="product-procedure">
            Procedure for Non-Compliant Products
          </h2>
          <div className="space-y-4">
            <p>
              When market surveillance authorities identify a non-compliant
              product, they follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Initial evaluation</strong> - Authorities assess the
                product against applicable accessibility requirements
              </li>
              <li>
                <strong>Notification</strong> - If non-compliance is found, the
                authorities inform the relevant economic operator (manufacturer,
                importer, or distributor)
              </li>
              <li>
                <strong>Opportunity for response</strong> - The economic
                operator is given the opportunity to present their observations
                and explain any claimed exceptions
              </li>
              <li>
                <strong>Required corrective action</strong> - Authorities
                require the economic operator to take appropriate corrective
                measures to bring the product into compliance
              </li>
              <li>
                <strong>Escalation if necessary</strong> - If the economic
                operator fails to take adequate corrective action, authorities
                can:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    Restrict or prohibit the product's availability on the
                    market
                  </li>
                  <li>Ensure the product is withdrawn from the market</li>
                  <li>Ensure the product is recalled</li>
                </ul>
              </li>
              <li>
                <strong>Immediate action for serious risk</strong> - In cases
                where a product presents a serious risk, authorities can take
                immediate provisional measures without waiting for the economic
                operator to respond
              </li>
            </ol>
            <p>
              All measures taken must be proportionate to the level of
              non-compliance and communicated promptly to the economic operator.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="service-procedure">
            Procedure for Non-Compliant Services
          </h2>
          <div className="space-y-4">
            <p>
              For services found to be non-compliant with accessibility
              requirements, the following procedure applies:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Initial assessment</strong> - Authorities responsible
                for checking compliance of services evaluate the service against
                applicable requirements
              </li>
              <li>
                <strong>Notification</strong> - The service provider is informed
                of the identified non-compliance
              </li>
              <li>
                <strong>Corrective measures</strong> - The service provider is
                required to take corrective action to bring the service into
                conformity with accessibility requirements
              </li>
              <li>
                <strong>Follow-up verification</strong> - Authorities check that
                corrective action has been taken and is sufficient to address
                the non-compliance
              </li>
              <li>
                <strong>Further action</strong> - If the service provider fails
                to take adequate corrective measures, authorities can:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Require cessation of the service</li>
                  <li>
                    Impose penalties in accordance with national legislation
                  </li>
                  <li>Take other appropriate measures to ensure compliance</li>
                </ul>
              </li>
            </ol>
            <p>
              Member States establish their own specific procedures for
              addressing non-compliant services, but they must align with these
              general principles established in the EAA.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="formal-non-compliance"
          >
            Formal Non-Compliance
          </h2>
          <div className="space-y-4">
            <p>
              The EAA identifies specific cases of formal non-compliance that
              trigger action by authorities. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The CE marking has been affixed in violation of Article 30 of
                Regulation (EC) No 765/2008 or Article 18 of the EAA
              </li>
              <li>The CE marking has not been affixed</li>
              <li>
                The EU declaration of conformity has not been drawn up or has
                been drawn up incorrectly
              </li>
              <li>The technical documentation is unavailable or incomplete</li>
              <li>
                Product identification information or manufacturer/importer
                contact details are missing, false, or incomplete
              </li>
              <li>
                Any other administrative requirement of the EAA has not been met
              </li>
            </ul>
            <p>
              When formal non-compliance is identified, authorities require the
              economic operator to correct the issue. If the non-compliance
              persists, authorities take appropriate measures to restrict or
              prohibit the product's availability or ensure it is withdrawn or
              recalled from the market.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="union-safeguard">
            Union Safeguard Procedure
          </h2>
          <div className="space-y-4">
            <p>
              For cases where there is disagreement between Member States about
              actions taken against non-compliant products, the EAA establishes
              a Union safeguard procedure:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                When one Member State takes measures against a product, it must
                inform the Commission and other Member States
              </li>
              <li>
                Information provided must include the reasons for the measures,
                the non-compliance identified, and the economic operator's
                arguments
              </li>
              <li>
                The Commission evaluates the national measures and determines if
                they are justified
              </li>
              <li>
                If the measures are deemed justified, all Member States must
                ensure the non-compliant product is withdrawn from their markets
              </li>
              <li>
                If the measures are deemed unjustified, the Member State must
                withdraw them
              </li>
              <li>
                The Commission communicates its decision to all Member States
                and the economic operator concerned
              </li>
            </ol>
            <p>
              This procedure ensures coordinated action across the EU and
              prevents fragmentation of the single market while maintaining high
              standards of accessibility.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="penalties">
            Penalties and Remedies
          </h2>
          <div className="space-y-4">
            <p>
              The EAA requires Member States to establish rules on penalties for
              infringements of national provisions adopted under the directive:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Penalties must be effective, proportionate, and dissuasive
              </li>
              <li>
                They must take into account the extent of the non-compliance and
                the number of units of non-complying products or services
              </li>
              <li>
                Penalties should be accompanied by effective remedial mechanisms
                in case of non-compliance
              </li>
              <li>
                Member States must notify the Commission of these rules and
                measures and promptly report any subsequent amendments
              </li>
              <li>
                Penalties should not serve as an alternative to economic
                operators fulfilling their accessibility obligations
              </li>
            </ul>
            <p>
              This penalty framework helps ensure that economic operators take
              their accessibility obligations seriously and address
              non-compliance issues promptly.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/service-compliance"
            className="text-blue-600 hover:underline"
          >
            ← Compliance of Services
          </Link>
          <Link href="/eaa/annexes" className="text-blue-600 hover:underline">
            Annexes →
          </Link>
        </nav>
      </div>
    </>
  )
}
