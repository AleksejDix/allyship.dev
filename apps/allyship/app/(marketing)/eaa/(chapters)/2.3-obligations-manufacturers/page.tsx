import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { List } from 'lucide-react'
import {
  INTRODUCTION_LINKS,
  REQUIREMENTS_LINKS,
  EXTERNAL_LINKS,
  OBLIGATIONS_LINKS,
} from '../../constants/links'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { buttonVariants } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'EAA: Obligations for Manufacturers',
  description:
    'Specific obligations for manufacturers under the European Accessibility Act (EAA).',
}

export default function ManufacturerObligationsPage() {
  return (
    <div className="container relative mt-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link
            href="/eaa"
            className="hover:text-foreground hover:underline focus-visible:underline"
          >
            European Accessibility Act
          </Link>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
          <Link
            href="/eaa/obligations-overview"
            className="hover:text-foreground hover:underline focus-visible:underline"
          >
            Obligations Overview
          </Link>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
          <p>Manufacturers</p>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold" id="top">
            Obligations for Manufacturers Under the EAA
          </h1>
          <p className="text-xl text-muted-foreground">
            Detailed guidance on the specific obligations that manufacturers
            must meet under the European Accessibility Act.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-3/4 space-y-8">
            <nav
              className="sticky top-20 z-10 bg-background pt-4 pb-2 border-b"
              aria-label="Page navigation"
            >
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <li>
                  <a
                    href="#definition"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="definition"
                  >
                    Definition
                  </a>
                </li>
                <li>
                  <a
                    href="#key-responsibilities"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="key-responsibilities"
                  >
                    Key Responsibilities
                  </a>
                </li>
                <li>
                  <a
                    href="#accessibility-requirements"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="accessibility-requirements"
                  >
                    Accessibility Requirements
                  </a>
                </li>
                <li>
                  <a
                    href="#conformity-procedures"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="conformity-procedures"
                  >
                    Conformity Procedures
                  </a>
                </li>
                <li>
                  <a
                    href="#technical-documentation"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="technical-documentation"
                  >
                    Technical Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#declaration-of-conformity"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="declaration-of-conformity"
                  >
                    Declaration of Conformity
                  </a>
                </li>
                <li>
                  <a
                    href="#product-marking"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="product-marking"
                  >
                    Product Marking
                  </a>
                </li>
                <li>
                  <a
                    href="#non-conformity"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="non-conformity"
                  >
                    Non-conformity
                  </a>
                </li>
                <li>
                  <a
                    href="#records-keeping"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="records-keeping"
                  >
                    Record Keeping
                  </a>
                </li>
                <li>
                  <a
                    href="#cooperation"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="cooperation"
                  >
                    Cooperation
                  </a>
                </li>
                <li>
                  <a
                    href="#exemptions"
                    className="hover:text-foreground hover:underline text-muted-foreground"
                    data-scroll-margin-target="exemptions"
                  >
                    Exemptions
                  </a>
                </li>
              </ul>
            </nav>

            <section
              id="definition"
              className="scroll-mt-20"
              aria-labelledby="definition-heading"
            >
              <h2 id="definition-heading" className="text-2xl font-bold mb-4">
                Definition of a Manufacturer under the EAA
              </h2>
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
            </section>

            <section
              id="key-responsibilities"
              className="scroll-mt-20"
              aria-labelledby="key-responsibilities-heading"
            >
              <h2
                id="key-responsibilities-heading"
                className="text-2xl font-bold mb-4"
              >
                Key Responsibilities
              </h2>
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
            </section>

            <section
              id="accessibility-requirements"
              className="scroll-mt-20"
              aria-labelledby="accessibility-requirements-heading"
            >
              <h2
                id="accessibility-requirements-heading"
                className="text-2xl font-bold mb-4"
              >
                Meeting Accessibility Requirements
              </h2>
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
              <div className="bg-muted p-4 rounded-md mt-4">
                <h3 className="font-semibold mb-2">Practical Approach:</h3>
                <p>To meet accessibility requirements, manufacturers should:</p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
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
            </section>

            <section
              id="conformity-procedures"
              className="scroll-mt-20"
              aria-labelledby="conformity-procedures-heading"
            >
              <h2
                id="conformity-procedures-heading"
                className="text-2xl font-bold mb-4"
              >
                Conformity Assessment Procedures
              </h2>
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
            </section>

            <section
              id="technical-documentation"
              className="scroll-mt-20"
              aria-labelledby="technical-documentation-heading"
            >
              <h2
                id="technical-documentation-heading"
                className="text-2xl font-bold mb-4"
              >
                Technical Documentation
              </h2>
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
            </section>

            <section
              id="declaration-of-conformity"
              className="scroll-mt-20"
              aria-labelledby="declaration-of-conformity-heading"
            >
              <h2
                id="declaration-of-conformity-heading"
                className="text-2xl font-bold mb-4"
              >
                EU Declaration of Conformity
              </h2>
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
              <div className="bg-muted p-4 rounded-md mt-4">
                <p>
                  <Link
                    href="/eaa/3.3-eu-declaration"
                    className="text-primary hover:underline"
                  >
                    Learn more about the EU Declaration of Conformity
                    requirements &rarr;
                  </Link>
                </p>
              </div>
            </section>

            <section
              id="product-marking"
              className="scroll-mt-20"
              aria-labelledby="product-marking-heading"
            >
              <h2
                id="product-marking-heading"
                className="text-2xl font-bold mb-4"
              >
                CE Marking and Product Identification
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-grow">
                  <p>
                    Manufacturers must affix the CE marking to products that
                    comply with the accessibility requirements of the EAA. The
                    CE marking must be:
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
                    In addition to the CE marking, manufacturers must ensure
                    that their products bear:
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
              <div className="bg-muted p-4 rounded-md mt-4">
                <p>
                  <Link
                    href="/eaa/3.4-ce-marking"
                    className="text-primary hover:underline"
                  >
                    Learn more about CE marking requirements and procedures
                    &rarr;
                  </Link>
                </p>
              </div>
            </section>

            <section
              id="non-conformity"
              className="scroll-mt-20"
              aria-labelledby="non-conformity-heading"
            >
              <h2
                id="non-conformity-heading"
                className="text-2xl font-bold mb-4"
              >
                Handling Non-Conformity
              </h2>
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
            </section>

            <section
              id="records-keeping"
              className="scroll-mt-20"
              aria-labelledby="records-keeping-heading"
            >
              <h2
                id="records-keeping-heading"
                className="text-2xl font-bold mb-4"
              >
                Record Keeping Requirements
              </h2>
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
            </section>

            <section
              id="cooperation"
              className="scroll-mt-20"
              aria-labelledby="cooperation-heading"
            >
              <h2 id="cooperation-heading" className="text-2xl font-bold mb-4">
                Cooperation with Authorities
              </h2>
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
            </section>

            <section
              id="exemptions"
              className="scroll-mt-20"
              aria-labelledby="exemptions-heading"
            >
              <h2 id="exemptions-heading" className="text-2xl font-bold mb-4">
                Exemptions and Limitations
              </h2>
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
            </section>

            <div className="flex justify-end mt-8">
              <Link
                href="#top"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'gap-1'
                )}
              >
                Back to top
              </Link>
            </div>
          </div>

          <div className="lg:w-1/4">
            <div className="sticky top-20">
              <ScrollArea className="h-[calc(100vh-100px)] pr-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">In this chapter</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          href="/eaa/2.2-obligations-overview"
                          className="text-muted-foreground hover:text-foreground hover:underline"
                        >
                          2.2 Obligations Overview
                        </Link>
                      </li>
                      <li>
                        <span className="text-foreground font-medium">
                          2.3 Obligations for Manufacturers
                        </span>
                      </li>
                      <li>
                        <Link
                          href="/eaa/2.4-importers"
                          className="text-muted-foreground hover:text-foreground hover:underline"
                        >
                          2.4 Obligations for Importers
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/eaa/2.5-distributors"
                          className="text-muted-foreground hover:text-foreground hover:underline"
                        >
                          2.5 Obligations for Distributors
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/eaa/2.6-service-providers"
                          className="text-muted-foreground hover:text-foreground hover:underline"
                        >
                          2.6 Obligations for Service Providers
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Next chapter</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          href="/eaa/3.1-conformity-assessment"
                          className="text-muted-foreground hover:text-foreground hover:underline"
                        >
                          3.1 Conformity Assessment Procedures
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-md p-4 space-y-4">
                    <h3 className="font-semibold">More resources</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          href="/resources/eaa-checklist-manufacturers"
                          className="text-primary hover:underline flex items-center"
                        >
                          Manufacturer compliance checklist
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/resources/eaa-documentation-templates"
                          className="text-primary hover:underline flex items-center"
                        >
                          Documentation templates
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/blog/eaa-case-studies-manufacturers"
                          className="text-primary hover:underline flex items-center"
                        >
                          Case studies: Manufacturers
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/resources/eaa-training-manufacturers"
                          className="text-primary hover:underline flex items-center"
                        >
                          Training for manufacturers
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
