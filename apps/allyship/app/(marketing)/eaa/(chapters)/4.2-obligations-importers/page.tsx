import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Obligations for Importers | European Accessibility Act',
  description:
    'Specific obligations for importers under the European Accessibility Act (EAA).',
}

export default function ImporterObligationsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations for Importers.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#definition"
                  id="definition-link"
                >
                  Definition.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#key-responsibilities"
                  id="key-responsibilities-link"
                >
                  Key Responsibilities.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#before-placing-products"
                  id="before-placing-products-link"
                >
                  Before Placing Products.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#product-information"
                  id="product-information-link"
                >
                  Product Information.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#storage-and-transport"
                  id="storage-and-transport-link"
                >
                  Storage and Transport.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#non-conformity"
                  id="non-conformity-link"
                >
                  Non-conformity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#record-keeping"
                  id="record-keeping-link"
                >
                  Record Keeping.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#cooperation"
                  id="cooperation-link"
                >
                  Cooperation.
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
          <section
            aria-labelledby="definition-heading"
            id="definition"
            className="scroll-mt-6"
          >
            <h2
              id="definition-heading"
              className="text-2xl font-semibold mb-4 mt-0"
              tabIndex={-1}
            >
              Definition of an Importer under the EAA.
            </h2>
            <div className="space-y-4">
              <p>
                According to the European Accessibility Act, an importer is any
                person or company established in the European Union who:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Places products from a country outside the EU onto the EU
                  market.
                </li>
              </ul>
              <p className="mt-4">
                Importers are a crucial link in the supply chain. They bring
                products from outside the EU into the EU market, and they have
                important responsibilities for ensuring these products meet
                accessibility requirements.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="key-responsibilities-heading"
            id="key-responsibilities"
            className="scroll-mt-6"
          >
            <h2
              id="key-responsibilities-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Key Responsibilities.
            </h2>
            <div className="space-y-4">
              <p>
                Importers have several important responsibilities when bringing
                products into the EU market. Here are their main duties:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Making sure manufacturers have carried out the proper
                  conformity assessment.
                </li>
                <li>
                  Verifying that products meet accessibility requirements.
                </li>
                <li>
                  Checking that products have proper marking and documentation.
                </li>
                <li>Adding their contact information to the product.</li>
                <li>
                  Taking action if products don't meet accessibility
                  requirements.
                </li>
                <li>
                  Keeping records about product conformity and complaints.
                </li>
                <li>Working with authorities to ensure product compliance.</li>
              </ul>
            </div>
          </section>

          <section
            aria-labelledby="before-placing-products-heading"
            id="before-placing-products"
            className="scroll-mt-6"
          >
            <h2
              id="before-placing-products-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Before Placing Products on the Market.
            </h2>
            <div className="space-y-4">
              <p>
                Before bringing a product into the EU market, importers must
                complete these checks:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Verify that the manufacturer has carried out the proper
                  conformity assessment procedure.
                </li>
                <li>Check that the product has the required CE marking.</li>
                <li>
                  Confirm that the manufacturer has prepared the technical
                  documentation.
                </li>
                <li>
                  Make sure the EU Declaration of Conformity has been properly
                  created.
                </li>
                <li>
                  Verify that the product has the required identification
                  information.
                </li>
                <li>
                  Check that the product comes with instructions in the
                  appropriate languages.
                </li>
              </ul>
              <p className="mt-4">
                If an importer believes a product does not meet accessibility
                requirements, they must not place it on the market until it
                complies. If the product presents a risk, the importer must
                inform the manufacturer and market surveillance authorities.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="product-information-heading"
            id="product-information"
            className="scroll-mt-6"
          >
            <h2
              id="product-information-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Product Information Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                Importers must add certain information to products they import:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Their name, registered trade name or trademark.</li>
                <li>Their postal address for contact.</li>
              </ul>
              <p className="mt-4">This information must be:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Visible and easy to understand.</li>
                <li>Placed on the product itself when possible.</li>
                <li>
                  If that's not possible, placed on the packaging or in
                  documents that come with the product.
                </li>
                <li>
                  Written in a language that consumers and authorities can
                  easily understand.
                </li>
              </ul>
              <p className="mt-4">
                Importers must also make sure that products come with
                instructions and safety information in languages that are easily
                understood by consumers in the countries where the product will
                be sold.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="storage-and-transport-heading"
            id="storage-and-transport"
            className="scroll-mt-6"
          >
            <h2
              id="storage-and-transport-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Storage and Transport Conditions.
            </h2>
            <div className="space-y-4">
              <p>
                Importers must make sure that storage and transport conditions
                don't harm a product's compliance with accessibility
                requirements. Their responsibilities include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Storing products in appropriate conditions.</li>
                <li>
                  Ensuring that transportation methods don't damage products or
                  affect their accessibility features.
                </li>
                <li>
                  Conducting periodic checks on stored products when necessary.
                </li>
                <li>
                  Taking corrective measures if storage or transport issues
                  affect product compliance.
                </li>
              </ul>
              <p className="mt-4">
                These measures help ensure that products remain compliant with
                accessibility requirements until they reach the end user.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="non-conformity-heading"
            id="non-conformity"
            className="scroll-mt-6"
          >
            <h2
              id="non-conformity-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Handling Non-conformity.
            </h2>
            <div className="space-y-4">
              <p>
                If an importer discovers that a product doesn't meet
                accessibility requirements, they must:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Take immediate corrective measures to make the product comply.
                </li>
                <li>Withdraw the product from the market if necessary.</li>
                <li>Inform the manufacturer about the non-compliance issue.</li>
                <li>
                  Notify market surveillance authorities in EU countries where
                  the product was made available.
                </li>
                <li>
                  Provide details about the non-compliance and any corrective
                  actions taken.
                </li>
              </ul>
              <div className="bg-muted p-4 rounded-md mt-6">
                <h3 className="font-medium mb-2">Important Note.</h3>
                <p className="text-sm">
                  Importers are responsible for products they've already placed
                  on the market. Even if they discover issues later, they must
                  take action to address the problems.
                </p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="record-keeping-heading"
            id="record-keeping"
            className="scroll-mt-6"
          >
            <h2
              id="record-keeping-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Record Keeping.
            </h2>
            <div className="space-y-4">
              <p>
                Importers must maintain certain records related to the products
                they import:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Keep a copy of the EU Declaration of Conformity for 5 years
                  after the product is placed on the market.
                </li>
                <li>
                  Ensure the technical documentation can be made available to
                  authorities upon request.
                </li>
                <li>
                  Maintain records of complaints about products not meeting
                  accessibility requirements.
                </li>
                <li>
                  Keep track of non-compliant products and product recalls.
                </li>
                <li>
                  Maintain information about the supply chain (which retailers
                  they've supplied products to).
                </li>
              </ul>
              <p className="mt-4">
                These records help importers demonstrate compliance with their
                obligations under the European Accessibility Act.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="cooperation-heading"
            id="cooperation"
            className="scroll-mt-6"
          >
            <h2
              id="cooperation-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Cooperation with Authorities.
            </h2>
            <div className="space-y-4">
              <p>
                Importers must cooperate with national market surveillance
                authorities when requested. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Providing all information and documentation necessary to
                  demonstrate product conformity.
                </li>
                <li>
                  Giving information about suppliers from whom they purchased
                  products.
                </li>
                <li>
                  Providing information about other economic operators to whom
                  they supplied products.
                </li>
                <li>
                  Taking corrective actions requested by authorities to bring
                  products into compliance.
                </li>
                <li>
                  Cooperating with any investigations into product
                  non-compliance.
                </li>
              </ul>
              <p className="mt-4">
                This information must be provided in a language that the
                authorities can easily understand.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="4.2-obligations-importers" />
          </footer>
        </div>
      </div>
    </section>
  )
}
