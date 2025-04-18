import React from 'react'
import Link from 'next/link'

export default function ObligationsPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">
        Obligations of Economic Operators
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview of Obligations
          </h2>
          <div className="space-y-4">
            <p>
              The European Accessibility Act establishes specific
              responsibilities for different actors in the supply chain to
              ensure that products and services meet the accessibility
              requirements. These obligations are tailored to the role of each
              economic operator in the market.
            </p>
            <p>
              The Directive defines four types of economic operators with
              distinct responsibilities:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Manufacturers:</strong> Any natural or legal person who
                manufactures a product or has a product designed or
                manufactured, and markets that product under their name or
                trademark
              </li>
              <li>
                <strong>Importers:</strong> Any natural or legal person
                established within the Union who places a product from a third
                country on the Union market
              </li>
              <li>
                <strong>Distributors:</strong> Any natural or legal person in
                the supply chain, other than the manufacturer or the importer,
                who makes a product available on the market
              </li>
              <li>
                <strong>Service Providers:</strong> Any natural or legal person
                who provides a service on the Union market or makes offers to
                provide such a service to consumers in the Union
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="manufacturers-summary"
          >
            Manufacturers: Key Obligations
          </h2>
          <div className="space-y-4">
            <p>
              Manufacturers bear the primary responsibility for ensuring that
              products comply with the accessibility requirements. Their key
              obligations include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Ensuring that products are designed and manufactured in
                accordance with accessibility requirements
              </li>
              <li>Carrying out the conformity assessment procedure</li>
              <li>Drawing up technical documentation</li>
              <li>Drawing up the EU declaration of conformity</li>
              <li>Affixing the CE marking</li>
              <li>
                Ensuring that procedures are in place for series production to
                remain in conformity
              </li>
              <li>
                Maintaining records of complaints and non-conforming products
              </li>
              <li>
                Providing information and documentation to demonstrate product
                conformity
              </li>
            </ul>
            <p className="mt-4">
              <Link
                href="/eaa/obligations-manufacturers"
                className="text-blue-600 hover:underline"
              >
                Learn more about manufacturers' obligations →
              </Link>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="importers-summary">
            Importers: Key Obligations
          </h2>
          <div className="space-y-4">
            <p>
              Importers act as gatekeepers, ensuring that products from third
              countries comply with the European accessibility requirements
              before placing them on the EU market. Their main obligations
              include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Verifying that the manufacturer has carried out the appropriate
                conformity assessment
              </li>
              <li>Ensuring that the product bears the CE marking</li>
              <li>
                Checking that required documentation is complete and accurate
              </li>
              <li>
                Verifying that the manufacturer is identified on the product
              </li>
              <li>
                Refraining from placing non-compliant products on the market
              </li>
              <li>Including their contact information on the product</li>
              <li>Ensuring proper storage and transport conditions</li>
              <li>Cooperating with market surveillance authorities</li>
            </ul>
            <p className="mt-4">
              <Link
                href="/eaa/obligations-importers"
                className="text-blue-600 hover:underline"
              >
                Learn more about importers' obligations →
              </Link>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="distributors-summary">
            Distributors: Key Obligations
          </h2>
          <div className="space-y-4">
            <p>
              Distributors make products available on the market after they have
              been placed on the market by the manufacturer or importer. Their
              key obligations include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verifying that products bear the CE marking</li>
              <li>
                Ensuring that products are accompanied by required documentation
                in appropriate languages
              </li>
              <li>
                Checking that manufacturers and importers have complied with
                their requirements
              </li>
              <li>
                Ensuring that storage and transport conditions do not jeopardize
                compliance
              </li>
              <li>
                Taking corrective measures when aware of non-compliant products
              </li>
              <li>
                Providing all necessary information and documentation to
                authorities
              </li>
            </ul>
            <p className="mt-4">
              <Link
                href="/eaa/obligations-distributors"
                className="text-blue-600 hover:underline"
              >
                Learn more about distributors' obligations →
              </Link>
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="service-providers-summary"
          >
            Service Providers: Key Obligations
          </h2>
          <div className="space-y-4">
            <p>
              Service providers must ensure that their services comply with the
              accessibility requirements of the Directive. Their main
              obligations include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Designing and providing services in accordance with
                accessibility requirements
              </li>
              <li>
                Preparing the necessary information explaining how services meet
                accessibility requirements
              </li>
              <li>
                Making information available to the public on how the service
                meets requirements
              </li>
              <li>
                Ensuring ongoing compliance with accessibility requirements
              </li>
              <li>Implementing appropriate procedures for service provision</li>
              <li>
                Providing information to market surveillance authorities upon
                request
              </li>
              <li>Taking corrective measures when services fail to comply</li>
            </ul>
            <p className="mt-4">
              <Link
                href="/eaa/obligations-service-providers"
                className="text-blue-600 hover:underline"
              >
                Learn more about service providers' obligations →
              </Link>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="multiple-roles">
            Economic Operators with Multiple Roles
          </h2>
          <div className="space-y-4">
            <p>
              In cases where an economic operator performs multiple roles (e.g.,
              a manufacturer also acting as a distributor), they must fulfill
              the obligations associated with each role they undertake in the
              supply chain.
            </p>
            <p>
              Additionally, importers or distributors are considered
              manufacturers for the purposes of the Directive when they:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Place a product on the market under their own name or trademark
              </li>
              <li>
                Modify a product already placed on the market in a way that
                affects compliance
              </li>
            </ul>
            <p>
              In such cases, they assume all the obligations of manufacturers.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/free-movement"
            className="text-blue-600 hover:underline"
          >
            ← Free Movement
          </Link>
          <Link
            href="/eaa/obligations-manufacturers"
            className="text-blue-600 hover:underline"
          >
            Manufacturers' Obligations →
          </Link>
        </nav>
      </div>
    </>
  )
}
