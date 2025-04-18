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
          <div className="py-2">
            <Button asChild variant="secondary">
              <Link
                className="no-underline"
                href={INTRODUCTION_LINKS.OVERVIEW.fullPath}
                aria-labelledby="toc-button-label"
              >
                <List size={16} aria-hidden="true" />
                <span id="toc-button-label">EAA Table of Contents</span>
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations for Manufacturers
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#definition"
                  id="definition-link"
                >
                  Definition
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#key-responsibilities"
                  id="key-responsibilities-link"
                >
                  Key Responsibilities
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#accessibility-requirements"
                  id="accessibility-requirements-link"
                >
                  Accessibility Requirements
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#conformity-procedures"
                  id="conformity-procedures-link"
                >
                  Conformity Procedures
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#technical-documentation"
                  id="technical-documentation-link"
                >
                  Technical Documentation
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#declaration-of-conformity"
                  id="declaration-of-conformity-link"
                >
                  Declaration of Conformity
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#product-marking"
                  id="product-marking-link"
                >
                  Product Marking
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#non-conformity"
                  id="non-conformity-link"
                >
                  Non-conformity
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#records-keeping"
                  id="records-keeping-link"
                >
                  Record Keeping
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#cooperation"
                  id="cooperation-link"
                >
                  Cooperation
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#exemptions"
                  id="exemptions-link"
                >
                  Exemptions
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert py-4">
        <div className="space-y-8">
          <section
            aria-labelledby="definition-heading"
            id="definition"
            className="scroll-mt-6"
          >
            <h2
              id="definition-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Definition of a Manufacturer under the EAA
            </h2>
            <div className="space-y-4">
              <p>
                According to the European Accessibility Act, a{' '}
                <strong>manufacturer</strong> is any natural or legal person
                who:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Manufactures a product, or has a product designed or
                  manufactured
                </li>
                <li>Markets that product under their name or trademark</li>
              </ul>
              <p className="mt-4">
                This definition encompasses companies that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Produce physical products covered by the EAA</li>
                <li>Design products but outsource manufacturing</li>
                <li>
                  Rebrand products manufactured by others under their own brand
                </li>
                <li>Substantially modify products already on the market</li>
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
              Key Responsibilities
            </h2>
            <div className="space-y-4">
              <p>
                As primary economic operators in the supply chain, manufacturers
                hold the greatest responsibility for ensuring product compliance
                with the EAA. Their key responsibilities include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Ensuring products are designed and manufactured in accordance
                  with the accessibility requirements
                </li>
                <li>Preparing and maintaining technical documentation</li>
                <li>
                  Carrying out the applicable conformity assessment procedure
                </li>
                <li>Drawing up an EU Declaration of Conformity</li>
                <li>Affixing the CE marking to compliant products</li>
                <li>
                  Keeping records of non-conforming products and product recalls
                </li>
                <li>Ensuring serial production maintains compliance</li>
                <li>
                  Providing information on product accessibility in accessible
                  formats
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
              Meeting Accessibility Requirements
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must design and produce products that comply with
                the accessibility requirements set out in Section I of Annex I
                of the EAA. These requirements include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Providing information on the use of the product in accessible
                  formats
                </li>
                <li>
                  Making user interfaces and functionality accessible to persons
                  with disabilities
                </li>
                <li>Ensuring compatibility with assistive technologies</li>
                <li>
                  Designing packaging and instructions in an accessible manner
                </li>
              </ul>
              <p className="mt-4">
                Manufacturers should implement accessibility features from the
                earliest stages of product design and development, following the
                principles of "universal design" or "design for all."
              </p>
              <div className="bg-blue-50 border border-blue-400 px-6 text-blue-800 dark:text-blue-400 dark:bg-blue-950 py-4 rounded-md mt-4">
                <h3 className="font-semibold mb-2 mt-0 ">
                  Practical Approach:
                </h3>
                <p>To meet accessibility requirements, manufacturers should:</p>
                <ol className="list-decimal pl-6 space-y-2 mt-2 ">
                  <li>
                    Conduct accessibility assessments during product development
                  </li>
                  <li>Involve persons with disabilities in testing</li>
                  <li>Follow relevant harmonized standards</li>
                  <li>
                    Document all accessibility features and implementation
                    decisions
                  </li>
                </ol>
              </div>
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
              Conformity Assessment Procedures
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must carry out appropriate conformity assessment
                procedures to verify that their products comply with the
                accessibility requirements of the EAA. The EAA allows
                manufacturers to use either:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li>
                  <strong>Internal production control (Module A)</strong> - The
                  manufacturer ensures and declares on their sole responsibility
                  that the products concerned satisfy the applicable
                  requirements.
                </li>
                <li>
                  <strong>EU-type examination (Module B)</strong> followed by
                  conformity to type based on internal production control
                  (Module C) - This involves a notified body examining the
                  technical design and the manufacturer ensuring the production
                  process ensures compliance.
                </li>
              </ol>
              <p className="mt-4">
                For most products, manufacturers can apply Module A (internal
                production control), which involves:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Preparing technical documentation</li>
                <li>
                  Taking all necessary measures to ensure manufacturing process
                  and monitoring ensure compliance
                </li>
                <li>Drawing up a written EU Declaration of Conformity</li>
                <li>Affixing the CE marking to each compliant product</li>
              </ul>
              <p className="mt-4">
                For services, no CE marking is required, but service providers
                must ensure and declare that their services comply with the
                accessibility requirements.
              </p>
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
              Technical Documentation
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must prepare and maintain technical documentation
                that demonstrates how their products meet the accessibility
                requirements. This documentation must include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>A general description of the product</li>
                <li>
                  A list of the harmonized standards and/or technical
                  specifications applied
                </li>
                <li>
                  Description of solutions adopted to meet the accessibility
                  requirements
                </li>
                <li>
                  Where the manufacturer has used the exception of
                  disproportionate burden, the relevant calculation and
                  assessment
                </li>
              </ul>
              <p className="mt-4">
                The technical documentation must be kept for at least 5 years
                after the product has been placed on the market and must be made
                available to market surveillance authorities upon request.
              </p>
              <div className="bg-muted p-4 rounded-md mt-4">
                <p>
                  <strong>Note:</strong> Technical documentation should be
                  clear, organized, and regularly updated if changes are made to
                  the product. Documentation should be stored in a format that
                  ensures its availability and accessibility throughout the
                  required period.
                </p>
              </div>
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
              EU Declaration of Conformity
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must draw up an EU Declaration of Conformity when
                a product has been proven to comply with the applicable
                accessibility requirements. By drawing up this declaration, the
                manufacturer assumes responsibility for the compliance of the
                product.
              </p>
              <p className="mt-4">The EU Declaration of Conformity must:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  State that the fulfillment of accessibility requirements has
                  been demonstrated
                </li>
                <li>
                  Follow the model structure set out in Annex III of Decision No
                  768/2008/EC
                </li>
                <li>Be regularly updated if changes are made to the product</li>
                <li>
                  Be translated into the language(s) required by the Member
                  State where the product is placed on the market
                </li>
              </ul>
              <p className="mt-4">
                The declaration must be made available to market surveillance
                authorities for 5 years after the product has been placed on the
                market.
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
              CE Marking and Product Identification
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-grow">
                <p>
                  Manufacturers must affix the CE marking to products that
                  comply with the accessibility requirements of the EAA. The CE
                  marking must be:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    Visibly, legibly, and indelibly affixed to the product
                  </li>
                  <li>Affixed before the product is placed on the market</li>
                  <li>
                    Followed by the identification number of the notified body
                    (if involved in the conformity assessment)
                  </li>
                </ul>
                <p className="mt-4">
                  In addition to the CE marking, manufacturers must ensure that
                  their products bear:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    A type, batch, or serial number allowing product
                    identification
                  </li>
                  <li>
                    The manufacturer's name, registered trade name, or
                    registered trademark
                  </li>
                  <li>The manufacturer's postal address</li>
                </ul>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <Image
                  src="/images/eaa/ce-mark.svg"
                  alt="CE Marking logo"
                  width={100}
                  height={80}
                  className="mt-2"
                />
              </div>
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
              Handling Non-Conformity
            </h2>
            <div className="space-y-4">
              <p>
                When manufacturers have reason to believe that a product they
                have placed on the market does not comply with the accessibility
                requirements, they must:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li>
                  Immediately take corrective measures to bring the product into
                  conformity, withdraw it, or recall it as appropriate
                </li>
                <li>
                  If the product presents a risk, immediately inform the
                  competent national authorities of the Member States where the
                  product was made available, providing details about the
                  non-conformity and any corrective measures taken
                </li>
              </ol>
              <p className="mt-4">
                Manufacturers must also have procedures in place to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Monitor the compliance of serial production</li>
                <li>Investigate complaints related to accessibility</li>
                <li>
                  Maintain a register of non-compliant products and product
                  recalls
                </li>
                <li>Keep distributors informed of any such monitoring</li>
              </ul>
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
              Record Keeping Requirements
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must maintain comprehensive records to demonstrate
                compliance with the EAA. They must keep:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Technical documentation for at least 5 years after the product
                  has been placed on the market
                </li>
                <li>EU Declaration of Conformity for at least 5 years</li>
                <li>Records of non-conforming products and product recalls</li>
                <li>
                  Information on the economic operators who have supplied them
                  with products and to whom they have supplied products
                </li>
              </ul>
              <p className="mt-4">
                These records must be made available to market surveillance
                authorities upon request.
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
              Cooperation with Authorities
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must cooperate with competent national authorities
                when requested. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Providing all the information and documentation necessary to
                  demonstrate product conformity
                </li>
                <li>
                  Cooperating in any action taken to eliminate non-conformity of
                  products they have placed on the market
                </li>
                <li>
                  Responding to requests from market surveillance authorities in
                  a language that can be easily understood by that authority
                </li>
              </ul>
              <p className="mt-4">
                Manufacturers should designate a person or department
                responsible for communication with authorities and maintain
                clear internal procedures for how to respond to official
                requests.
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
              Exemptions and Limitations
            </h2>
            <div className="space-y-4">
              <p>
                The EAA recognizes that in some cases, compliance with
                accessibility requirements might impose a disproportionate
                burden on manufacturers. The EAA allows for exemptions under the
                following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Disproportionate burden</strong> - When implementing
                  the accessibility requirements would require a significant
                  change to the product or service or impose a disproportionate
                  burden on the manufacturer. This must be properly documented
                  and assessed.
                </li>
                <li>
                  <strong>Fundamental alteration</strong> - When accessibility
                  requirements would require a fundamental alteration in the
                  nature of the product or service.
                </li>
                <li>
                  <strong>Microenterprises</strong> - Microenterprises (fewer
                  than 10 persons and annual turnover/balance sheet not
                  exceeding €2 million) that deal with services are exempt from
                  compliance with the accessibility requirements, but must still
                  notify the relevant Member State authorities.
                </li>
              </ul>
              <div className="bg-muted p-4 rounded-md mt-4">
                <h3 className="font-semibold mb-2">
                  Important considerations:
                </h3>
                <p>
                  When claiming an exemption based on disproportionate burden,
                  manufacturers must:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li>Conduct and document an assessment</li>
                  <li>
                    Consider the relationship between the costs of compliance
                    and the manufacturer's resources
                  </li>
                  <li>
                    Estimate costs and benefits for the manufacturer in relation
                    to the estimated benefit for persons with disabilities
                  </li>
                  <li>
                    Re-evaluate the assessment at least every 5 years or when
                    the product changes
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation
              </h2>
              <Button asChild>
                <Link
                  href={OBLIGATIONS_LINKS.IMPORTERS.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Importers' Obligations</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Button>
            </nav>
          </footer>
        </div>
      </div>
    </section>
  )
}
