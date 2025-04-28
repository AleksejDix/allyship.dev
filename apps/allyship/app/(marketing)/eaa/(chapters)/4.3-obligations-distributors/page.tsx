import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Obligations for Distributors | European Accessibility Act',
  description:
    'Specific obligations for distributors under the European Accessibility Act (EAA).',
}

export default function DistributorObligationsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations for Distributors.
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
                  href="#check-products"
                  id="check-products-link"
                >
                  Checking Products.
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
              Definition of a Distributor under the EAA.
            </h2>
            <div className="space-y-4">
              <p>
                According to the European Accessibility Act, a distributor is
                any person or company in the supply chain who:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Makes a product available on the market.</li>
                <li>Is not the manufacturer or importer of the product.</li>
              </ul>
              <p className="mt-4">
                Distributors include retailers, wholesalers, and other
                businesses that sell products to consumers or other businesses
                after manufacturers or importers have placed them on the market.
                They are the final link in the supply chain before products
                reach the end user.
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
                Distributors play an important role in ensuring that products in
                the EU market meet accessibility requirements. Here are their
                main duties:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Checking that products have the correct marking and
                  documentation.
                </li>
                <li>
                  Verifying that manufacturers and importers have fulfilled
                  their obligations.
                </li>
                <li>
                  Not making non-compliant products available on the market.
                </li>
                <li>Ensuring proper storage and transport conditions.</li>
                <li>Taking corrective actions for non-compliant products.</li>
                <li>Cooperating with authorities when requested.</li>
                <li>Maintaining records of the supply chain.</li>
              </ul>
              <p className="mt-4">
                While distributors have fewer responsibilities than
                manufacturers and importers, they still play a crucial role in
                ensuring product accessibility.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="check-products-heading"
            id="check-products"
            className="scroll-mt-6"
          >
            <h2
              id="check-products-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Checking Products Before Making Available.
            </h2>
            <div className="space-y-4">
              <p>
                Before making a product available on the market, distributors
                must verify:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  That the product has the CE marking, showing it meets EU
                  requirements.
                </li>
                <li>
                  That the product comes with the required documents,
                  instructions, and safety information.
                </li>
                <li>
                  That these documents are in the languages easily understood by
                  consumers in the countries where the product will be sold.
                </li>
                <li>
                  That the manufacturer has included their name, registered
                  trade name or trademark, and contact address on the product.
                </li>
                <li>
                  That the importer has included their name, registered trade
                  name or trademark, and contact address on the product (for
                  imported products).
                </li>
              </ul>
              <p className="mt-4">
                If a distributor believes that a product doesn't meet
                accessibility requirements, they must not make it available on
                the market until it complies. If the product presents a risk,
                the distributor must inform the manufacturer or importer and
                market surveillance authorities.
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
                Distributors must ensure that while a product is under their
                responsibility, storage or transport conditions do not affect
                its compliance with accessibility requirements. Their
                responsibilities include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Maintaining appropriate storage conditions.</li>
                <li>Handling products carefully during transport.</li>
                <li>
                  Protecting products from damage that could affect their
                  accessibility features.
                </li>
                <li>
                  Checking products periodically to ensure they remain in
                  compliant condition.
                </li>
              </ul>
              <p className="mt-4">
                This helps ensure that products remain accessible and usable for
                people with disabilities when they reach the end user.
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
                If a distributor discovers that a product doesn't meet
                accessibility requirements, they must:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Take immediate corrective measures to make the product comply.
                </li>
                <li>Withdraw the product from the market if necessary.</li>
                <li>
                  Inform the manufacturer or importer about the non-compliance
                  issue.
                </li>
                <li>
                  Notify market surveillance authorities in EU countries where
                  the product was made available.
                </li>
                <li>
                  Provide details about the non-compliance and any corrective
                  actions taken.
                </li>
                <li>
                  Help with any actions to eliminate the risks posed by the
                  product.
                </li>
              </ul>
              <div className="bg-muted p-4 rounded-md mt-6">
                <h3 className="font-medium mb-2">Important Note.</h3>
                <p className="text-sm">
                  If a manufacturer or importer claims an exemption (like
                  disproportionate burden), distributors should request
                  documentation of this exemption to ensure they are not selling
                  products that should meet accessibility requirements but do
                  not.
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
                Distributors should maintain certain records related to the
                products they sell:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Information about which manufacturers and importers supplied
                  them with products.
                </li>
                <li>
                  Information about which economic operators they supplied
                  products to.
                </li>
                <li>
                  Records of complaints about products not meeting accessibility
                  requirements.
                </li>
                <li>Records of non-compliant products and product recalls.</li>
                <li>
                  Communications with manufacturers, importers, and authorities
                  about accessibility issues.
                </li>
              </ul>
              <p className="mt-4">
                While the EAA doesn't specify a minimum time period for keeping
                these records, it's good practice to maintain them for at least
                5 years to align with other economic operators' obligations.
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
                Distributors must cooperate with national market surveillance
                authorities when requested. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Providing all information and documentation necessary to
                  demonstrate product conformity.
                </li>
                <li>
                  Giving information about suppliers from whom they received
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
            <ChapterNavigation currentPageId="4.3-obligations-distributors" />
          </footer>
        </div>
      </div>
    </section>
  )
}
