import React from 'react'
import Link from 'next/link'

export default function DistributorsObligationsPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">Obligations of Distributors</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="role-distributors">
            Role of Distributors
          </h2>
          <div className="space-y-4">
            <p>
              Article 9 of the European Accessibility Act outlines the
              obligations of distributors. Distributors are any natural or legal
              person in the supply chain, other than the manufacturer or the
              importer, who makes a product available on the market.
            </p>
            <p>
              As the economic operators who often have direct contact with
              consumers, distributors play an important role in ensuring that
              only compliant products reach end-users. Their obligations focus
              on verification and due diligence in the handling of products.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="due-diligence">
            Due Diligence Requirements
          </h2>
          <div className="space-y-4">
            <p>
              When making a product available on the market, distributors shall
              act with due care in relation to the requirements of this
              Directive. Before making a product available on the market,
              distributors shall verify that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The product bears the CE marking</li>
              <li>The product is accompanied by the required documents</li>
              <li>
                The product is accompanied by instructions and safety
                information in a language which can be easily understood by
                consumers and other end-users in the Member State in which the
                product is to be made available
              </li>
              <li>
                The manufacturer and the importer have complied with the
                requirements related to identification and contact information
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
              Where a distributor considers or has reason to believe that a
              product is not in conformity with the applicable accessibility
              requirements, the distributor shall:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Not make the product available on the market until it has been
                brought into conformity
              </li>
              <li>
                Inform the manufacturer or the importer, as well as the market
                surveillance authorities, when the product presents a risk
                related to accessibility
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="storage-transport">
            Storage and Transport Conditions
          </h2>
          <div className="space-y-4">
            <p>
              Distributors shall ensure that, while a product is under their
              responsibility, storage or transport conditions do not jeopardize
              its compliance with the applicable accessibility requirements.
            </p>
            <p>This requires distributors to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Maintain appropriate environmental conditions in storage
                facilities
              </li>
              <li>
                Handle products carefully to prevent damage to accessibility
                features
              </li>
              <li>Ensure proper packaging during transport</li>
              <li>Monitor storage conditions regularly</li>
              <li>Train staff in proper handling procedures</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="corrective-measures">
            Corrective Measures
          </h2>
          <div className="space-y-4">
            <p>
              Distributors who consider or have reason to believe that a product
              which they have made available on the market is not in conformity
              with this Directive shall:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Make sure that the corrective measures necessary to bring that
                product into conformity are taken
              </li>
              <li>Withdraw the product from the market, if appropriate</li>
              <li>Recall the product, if appropriate</li>
            </ul>
            <p>
              Furthermore, where the product presents a risk related to
              accessibility, distributors shall immediately inform the competent
              national authorities of the Member States in which they made the
              product available on the market, giving details, in particular,
              of:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The non-compliance</li>
              <li>Any corrective measures taken</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="cooperation">
            Cooperation with Authorities
          </h2>
          <div className="space-y-4">
            <p>
              Distributors shall, further to a reasoned request from a competent
              national authority, provide it with all the information and
              documentation necessary to demonstrate the conformity of a
              product.
            </p>
            <p>
              They shall cooperate with that authority, at its request, on any
              action taken to eliminate the non-compliance with the applicable
              accessibility requirements of products which they have made
              available on the market.
            </p>
            <p>This cooperation may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing access to product documentation</li>
              <li>Facilitating contact with manufacturers and importers</li>
              <li>Assisting with product recalls or withdrawals</li>
              <li>Providing information on the supply chain</li>
              <li>Supporting market surveillance activities</li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="manufacturer-obligations"
          >
            Distributors as Manufacturers
          </h2>
          <div className="space-y-4">
            <p>
              In certain circumstances, distributors may be considered
              manufacturers for the purposes of this Directive and shall be
              subject to the obligations of the manufacturer. This occurs when a
              distributor:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Places a product on the market under their own name or trademark
              </li>
              <li>
                Modifies a product already placed on the market in such a way
                that compliance with the requirements of this Directive may be
                affected
              </li>
            </ul>
            <p>
              In such cases, the distributor assumes all the more extensive
              obligations of manufacturers regarding design, conformity
              assessment, technical documentation, and CE marking.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="accessible-information"
          >
            Providing Accessible Information
          </h2>
          <div className="space-y-4">
            <p>
              As the point of contact with end-users, distributors have a
              particular responsibility to ensure that consumers can access
              information about the accessibility features of products. This
              includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Making sure product instructions are available in accessible
                formats
              </li>
              <li>
                Providing information about how to use accessibility features
              </li>
              <li>
                Ensuring staff are knowledgeable about accessibility features
              </li>
              <li>Responding to customer queries about accessibility</li>
            </ul>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/obligations-importers"
            className="text-blue-600 hover:underline"
          >
            ← Importers' Obligations
          </Link>
          <Link
            href="/eaa/obligations-service-providers"
            className="text-blue-600 hover:underline"
          >
            Service Providers' Obligations →
          </Link>
        </nav>
      </div>
    </>
  )
}
