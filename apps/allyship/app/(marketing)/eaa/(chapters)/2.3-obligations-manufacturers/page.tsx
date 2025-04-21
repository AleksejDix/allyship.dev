import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import Image from 'next/image'
import { INTRODUCTION_LINKS, OBLIGATIONS_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title: 'Obligations for Manufacturers | European Accessibility Act',
  description:
    'Specific obligations for manufacturers under the European Accessibility Act (EAA).',
}

export default function ManufacturerObligationsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations for Manufacturers.
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
                  href="#accessibility-requirements"
                  id="accessibility-requirements-link"
                >
                  Accessibility Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#conformity-procedures"
                  id="conformity-procedures-link"
                >
                  Conformity Procedures.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#technical-documentation"
                  id="technical-documentation-link"
                >
                  Technical Documentation.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#declaration-of-conformity"
                  id="declaration-of-conformity-link"
                >
                  Declaration of Conformity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#product-marking"
                  id="product-marking-link"
                >
                  Product Marking.
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
                  href="#records-keeping"
                  id="records-keeping-link"
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
              <li>
                <a
                  className="underline"
                  href="#exemptions"
                  id="exemptions-link"
                >
                  Exemptions.
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
              Definition of a Manufacturer under the EAA.
            </h2>
            <div className="space-y-4">
              <p>
                According to the European Accessibility Act, a manufacturer is
                any person or company who:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Makes a product, or has someone design or make a product for
                  them.
                </li>
                <li>Sells that product under their own name or brand.</li>
              </ul>
              <p className="mt-4">This includes companies that:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Make physical products covered by the EAA.</li>
                <li>Design products but have others make them.</li>
                <li>Sell products made by others under their own brand.</li>
                <li>Make major changes to products already on the market.</li>
              </ul>
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
                Manufacturers have the most responsibility for making sure
                products follow the EAA rules. Here are their main duties:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Making sure products are designed and made according to
                  accessibility requirements.
                </li>
                <li>Creating and keeping technical documents.</li>
                <li>Testing products to make sure they follow the rules.</li>
                <li>Creating an EU Declaration of Conformity.</li>
                <li>
                  Adding the CE marking to products that meet the requirements.
                </li>
                <li>
                  Keeping records of products that don't meet requirements and
                  any product recalls.
                </li>
                <li>Making sure all products in a series stay compliant.</li>
                <li>
                  Providing information about product accessibility in formats
                  everyone can use.
                </li>
              </ul>
            </div>
          </section>

          <section
            aria-labelledby="accessibility-requirements-heading"
            id="accessibility-requirements"
            className="scroll-mt-6"
          >
            <h2
              id="accessibility-requirements-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Meeting Accessibility Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must design and make products that follow the
                accessibility requirements in Section I of Annex I of the EAA.
                These requirements include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Providing information about how to use the product in formats
                  everyone can access.
                </li>
                <li>
                  Making user interfaces and functions accessible to people with
                  disabilities.
                </li>
                <li>Making sure products work with assistive technologies.</li>
                <li>
                  Designing packaging and instructions that everyone can use.
                </li>
              </ul>
              <p className="mt-4">
                Manufacturers should include accessibility features from the
                very beginning of product design, following "universal design"
                principles.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="conformity-procedures-heading"
            id="conformity-procedures"
            className="scroll-mt-6"
          >
            <h2
              id="conformity-procedures-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Conformity Procedures.
            </h2>
            <div className="space-y-4">
              <p>
                Before placing a product on the market, manufacturers must
                follow these steps to check that it meets accessibility
                requirements:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li>
                  Make sure the product design meets the accessibility
                  requirements.
                </li>
                <li>
                  Check the product against the requirements using the
                  procedures in Annex IV.
                </li>
                <li>Fix any issues found during testing.</li>
                <li>
                  Create technical documentation showing how the product meets
                  the requirements.
                </li>
                <li>Create and sign the EU Declaration of Conformity.</li>
                <li>Add the CE marking to the product.</li>
              </ol>

              <div className="bg-muted p-4 rounded-md mt-6">
                <h3 className="font-medium mb-2">Important Note.</h3>
                <p className="text-sm">
                  Manufacturers must carry out the conformity assessment
                  themselves. They cannot delegate this responsibility to third
                  parties, although they may use external expertise to help with
                  testing.
                </p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="technical-documentation-heading"
            id="technical-documentation"
            className="scroll-mt-6"
          >
            <h2
              id="technical-documentation-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Technical Documentation.
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must create and maintain technical documentation
                for each product. This documentation must include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>A general description of the product.</li>
                <li>
                  A list of the standards and technical specifications used in
                  the design.
                </li>
                <li>
                  Information about how the product meets the accessibility
                  requirements.
                </li>
                <li>
                  Results of any tests or assessments done to check compliance.
                </li>
                <li>
                  If claiming an exemption (like disproportionate burden),
                  evidence supporting that claim.
                </li>
              </ul>
              <p className="mt-4">
                Manufacturers must keep this documentation for at least 5 years
                after the product is placed on the market. National authorities
                can request to see this documentation at any time.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="declaration-of-conformity-heading"
            id="declaration-of-conformity"
            className="scroll-mt-6"
          >
            <h2
              id="declaration-of-conformity-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Declaration of Conformity.
            </h2>
            <div className="space-y-4">
              <p>
                The EU Declaration of Conformity is a legal document stating
                that a product meets the accessibility requirements of the EAA.
                This document must:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Include the manufacturer's name and address.</li>
                <li>Identify the product by type, batch, or serial number.</li>
                <li>
                  State that the product meets the accessibility requirements in
                  Directive (EU) 2019/882.
                </li>
                <li>
                  List any standards or technical specifications that were
                  followed.
                </li>
                <li>Be signed by an authorized person at the company.</li>
                <li>
                  Be updated if the product design changes in ways that affect
                  accessibility.
                </li>
              </ul>
              <p className="mt-4">
                A copy of this declaration must be kept for at least 5 years
                after the product is placed on the market.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="product-marking-heading"
            id="product-marking"
            className="scroll-mt-6"
          >
            <h2
              id="product-marking-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Product Marking.
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must add the following information to their
                products:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  The CE marking, which shows the product meets EU requirements.
                </li>
                <li>
                  The manufacturer's name, registered trade name, or trademark.
                </li>
                <li>The manufacturer's postal address for contact.</li>
                <li>
                  A type, batch, or serial number to identify the product.
                </li>
              </ul>
              <p className="mt-4">This information must be:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Visible and easy to read.</li>
                <li>Placed directly on the product if possible.</li>
                <li>
                  If that's not possible, placed on the packaging or in
                  documents that come with the product.
                </li>
              </ul>
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
                If a manufacturer discovers that a product doesn't meet the
                accessibility requirements, they must:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Take immediate action to make the product comply, or withdraw
                  it from the market if necessary.
                </li>
                <li>
                  Inform national authorities in EU countries where the product
                  is available.
                </li>
                <li>
                  Give details about the non-compliance and any actions taken to
                  fix it.
                </li>
                <li>
                  Work with authorities to make sure the product is brought into
                  compliance or withdrawn.
                </li>
              </ul>
              <p className="mt-4">
                Even after a product has been placed on the market,
                manufacturers remain responsible for monitoring its compliance
                with accessibility requirements.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="records-keeping-heading"
            id="records-keeping"
            className="scroll-mt-6"
          >
            <h2
              id="records-keeping-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Record Keeping.
            </h2>
            <div className="space-y-4">
              <p>Manufacturers must keep records of:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Complaints about products not meeting accessibility
                  requirements.
                </li>
                <li>Products that don't comply with the requirements.</li>
                <li>Product recalls.</li>
                <li>
                  Actions taken to address accessibility problems in their
                  products.
                </li>
              </ul>
              <p className="mt-4">
                These records help manufacturers improve their products and can
                be requested by authorities if there are concerns about
                compliance.
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
                Manufacturers must cooperate with national authorities when
                requested. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Providing all information and documentation necessary to prove
                  that a product meets accessibility requirements.
                </li>
                <li>
                  Giving authorities access to their premises if needed for
                  inspections.
                </li>
                <li>
                  Explaining steps taken to ensure products meet the
                  requirements.
                </li>
                <li>
                  Taking corrective actions when requested by authorities.
                </li>
              </ul>
              <p className="mt-4">
                This information must be provided in a language that is easy for
                the authorities to understand.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="exemptions-heading"
            id="exemptions"
            className="scroll-mt-6"
          >
            <h2
              id="exemptions-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Exemptions.
            </h2>
            <div className="space-y-4">
              <p>
                In some cases, manufacturers may be exempt from certain
                accessibility requirements if they can show that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Meeting the requirements would require a "fundamental change"
                  to the product that would completely alter its basic nature.
                </li>
                <li>
                  Meeting the requirements would create a "disproportionate
                  burden" on the manufacturer.
                </li>
              </ul>
              <p className="mt-4">To claim an exemption, manufacturers must:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Perform an assessment following the criteria in Annex VI.
                </li>
                <li>
                  Document their assessment showing why an exemption is
                  justified.
                </li>
                <li>
                  Keep this documentation for at least 5 years after the product
                  is placed on the market.
                </li>
                <li>Provide this documentation to authorities upon request.</li>
              </ul>
              <div className="bg-muted p-4 rounded-md mt-6">
                <h3 className="font-medium mb-2">Important Note.</h3>
                <p className="text-sm">
                  Exemptions must be evaluated for each accessibility
                  requirement individually. Even if one requirement is exempt,
                  all other requirements must still be met.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Detailed Manufacturer Obligations.
            </h2>
            <p>
              These obligations are based on Articles 7, 14, 15, and 16 of the
              European Accessibility Act (Directive (EU) 2019/882).
            </p>
            <div className="mt-6">
              <Link
                href={OBLIGATIONS_LINKS.OVERVIEW.fullPath}
                className="text-blue-600 hover:underline inline-flex items-center mr-6"
              >
                <ArrowRight
                  className="mr-2 rotate-180"
                  size={16}
                  aria-hidden="true"
                />
                Back to Obligations Overview
              </Link>
              <Link
                href={OBLIGATIONS_LINKS.IMPORTERS.fullPath}
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                Next: Importer Obligations
                <ArrowRight className="ml-2" size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
