import React from 'react'
import Link from 'next/link'

export default function ImportersObligationsPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">Obligations of Importers</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="role-importers">
            Role of Importers
          </h2>
          <div className="space-y-4">
            <p>
              Article 8 of the European Accessibility Act defines the
              obligations of importers. Importers play a crucial role in the
              supply chain as they are the economic operators who place products
              from third countries onto the EU market.
            </p>
            <p>
              As gatekeepers between manufacturers outside the EU and the
              European market, importers have the responsibility to verify that
              products they import comply with the accessibility requirements
              before making them available on the market.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="compliance-verification"
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

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="non-compliance-action"
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
              accessibility, the importer shall inform the manufacturer and the
              market surveillance authorities to that effect.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="identification-requirements"
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

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="instructions-documentation"
          >
            Instructions and Documentation
          </h2>
          <div className="space-y-4">
            <p>
              Importers shall ensure that the product is accompanied by
              instructions and safety information in a language which can be
              easily understood by consumers and other end-users, as determined
              by the Member State concerned.
            </p>
            <p>
              They must verify that these materials are accessible, clear,
              understandable, and that they provide all necessary information
              about the product's accessibility features and how to use them.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="storage-transport">
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

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="monitoring-investigations"
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
              <li>Investigate complaints related to non-conforming products</li>
              <li>Keep a register of such complaints</li>
              <li>Maintain records of non-conforming products</li>
              <li>Document product recalls</li>
              <li>Keep distributors informed of any such monitoring</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="corrective-measures">
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
                Immediately take the corrective measures necessary to bring that
                product into conformity
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

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="record-keeping">
            Record Keeping
          </h2>
          <div className="space-y-4">
            <p>
              Importers shall keep a copy of the EU declaration of conformity at
              the disposal of the market surveillance authorities for 5 years
              after the product has been placed on the market.
            </p>
            <p>
              They shall also ensure that the technical documentation can be
              made available to those authorities upon request during that
              period.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="cooperation">
            Cooperation with Authorities
          </h2>
          <div className="space-y-4">
            <p>
              Importers shall, further to a reasoned request from a competent
              national authority, provide it with all the information and
              documentation necessary to demonstrate the conformity of a
              product, in a language which can be easily understood by that
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

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/obligations-manufacturers"
            className="text-blue-600 hover:underline"
          >
            ← Manufacturers' Obligations
          </Link>
          <Link
            href="/eaa/obligations-distributors"
            className="text-blue-600 hover:underline"
          >
            Distributors' Obligations →
          </Link>
        </nav>
      </div>
    </>
  )
}
