import React from 'react'
import Link from 'next/link'

export default function ManufacturersObligationsPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">Obligations of Manufacturers</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="key-responsibilities">
            Key Responsibilities
          </h2>
          <div className="space-y-4">
            <p>
              Article 7 of the European Accessibility Act establishes the
              specific obligations that manufacturers must fulfill. As the
              entities primarily responsible for product compliance,
              manufacturers have the most comprehensive set of obligations under
              the Directive.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="design-manufacture">
            Design and Manufacture
          </h2>
          <div className="space-y-4">
            <p>
              When placing their products on the market, manufacturers shall
              ensure that the products have been designed and manufactured in
              accordance with the applicable accessibility requirements of this
              Directive.
            </p>
            <p>This obligation requires manufacturers to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Incorporate accessibility considerations from the earliest
                stages of product design
              </li>
              <li>
                Implement a design process that addresses all applicable
                accessibility requirements
              </li>
              <li>
                Ensure that manufacturing processes and quality controls
                maintain accessibility features
              </li>
              <li>
                Verify that the final product meets accessibility requirements
                before market placement
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="technical-documentation"
          >
            Technical Documentation
          </h2>
          <div className="space-y-4">
            <p>
              Manufacturers shall draw up the technical documentation in
              accordance with Annex IV and carry out the conformity assessment
              procedure set out in that Annex or have it carried out.
            </p>
            <p>The technical documentation must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Describe the product and its intended use</li>
              <li>List the applicable accessibility requirements</li>
              <li>Explain how the product meets each requirement</li>
              <li>Contain detailed technical specifications</li>
              <li>Include test reports or other evidence of compliance</li>
              <li>
                Document any standards or technical specifications applied
              </li>
              <li>
                Be maintained for at least 5 years after the product is placed
                on the market
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="conformity-assessment"
          >
            Conformity Assessment
          </h2>
          <div className="space-y-4">
            <p>
              Where compliance of a product with the applicable accessibility
              requirements has been demonstrated by the conformity assessment
              procedure, manufacturers shall draw up an EU declaration of
              conformity and affix the CE marking.
            </p>
            <p>The conformity assessment process involves:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Internal production control (as described in Annex IV)</li>
              <li>
                Verifying that products meet all applicable accessibility
                requirements
              </li>
              <li>Documenting the assessment results</li>
              <li>Preparing the EU declaration of conformity</li>
              <li>
                Affixing the CE marking visibly, legibly, and indelibly to the
                product
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="conformity-procedures"
          >
            Procedures for Continued Conformity
          </h2>
          <div className="space-y-4">
            <p>
              Manufacturers shall ensure that procedures are in place for series
              production to remain in conformity with this Directive. Changes in
              product design or characteristics and changes in the harmonised
              standards or in technical specifications must be adequately taken
              into account.
            </p>
            <p>This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Implementing quality control procedures for production</li>
              <li>Regularly testing product samples</li>
              <li>
                Monitoring changes in applicable standards and requirements
              </li>
              <li>
                Updating product designs and manufacturing processes when needed
              </li>
              <li>
                Maintaining documentation of all changes that affect conformity
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="identification">
            Product Identification and Contact Information
          </h2>
          <div className="space-y-4">
            <p>
              Manufacturers shall ensure that their products bear a type, batch
              or serial number or other element allowing their identification,
              and indicate their name, registered trade name or registered
              trademark and the address at which they can be contacted.
            </p>
            <p>
              When the size or nature of the product does not allow this, the
              information must be provided on the packaging or in a document
              accompanying the product.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="instructions">
            Instructions and Safety Information
          </h2>
          <div className="space-y-4">
            <p>
              Manufacturers shall ensure that their products are accompanied by
              instructions and safety information in a language which can be
              easily understood by consumers and end-users, as determined by the
              Member State concerned.
            </p>
            <p>
              These instructions and information, as well as any labelling,
              shall be clear, understandable and intelligible. They must also be
              provided in accessible formats to maximize their foreseeable use
              by persons with disabilities.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="corrective-measures">
            Corrective Measures
          </h2>
          <div className="space-y-4">
            <p>
              Manufacturers who consider or have reason to believe that a
              product which they have placed on the market is not in conformity
              with this Directive shall immediately take the corrective measures
              necessary to bring that product into conformity, or to withdraw it
              or recall it, if appropriate.
            </p>
            <p>
              Furthermore, where the product presents a risk related to
              accessibility, manufacturers shall immediately inform the
              competent national authorities of the Member States in which they
              made the product available on the market, giving details, in
              particular, of the non-compliance and of any corrective measures
              taken.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="cooperation">
            Cooperation with Authorities
          </h2>
          <div className="space-y-4">
            <p>
              Manufacturers shall, further to a reasoned request from a
              competent national authority, provide it with all the information
              and documentation necessary to demonstrate the conformity of the
              product, in a language which can be easily understood by that
              authority.
            </p>
            <p>
              They shall cooperate with that authority, at its request, on any
              action taken to eliminate the non-compliance with the applicable
              accessibility requirements of their products which they have
              placed on the market.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/obligations"
            className="text-blue-600 hover:underline"
          >
            ← Obligations Overview
          </Link>
          <Link
            href="/eaa/obligations-importers"
            className="text-blue-600 hover:underline"
          >
            Importers' Obligations →
          </Link>
        </nav>
      </div>
    </>
  )
}
