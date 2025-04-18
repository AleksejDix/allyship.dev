import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'CE Marking | European Accessibility Act',
  description:
    'Understanding CE marking requirements for accessible products under the European Accessibility Act, including placement, format, and documentation.',
}

export default function CEMarkingPage() {
  return (
    <main tabIndex={-1} id="main-content" className="focus:outline-none">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          href="/eaa"
          className="inline-flex items-center text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          ← Back to Table of Contents
        </Link>
      </nav>

      <h1 className="text-4xl font-bold mb-8">CE Marking</h1>

      <div className="space-y-8">
        <section aria-labelledby="purpose" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="purpose">
            Purpose and Significance
          </h2>
          <div className="space-y-4">
            <p>
              The CE marking (Conformité Européenne) is a mandatory conformity
              marking for certain products sold within the European Economic
              Area (EEA). Under the European Accessibility Act (EAA), products
              that must meet accessibility requirements and fall within the
              scope of the EAA generally require CE marking.
            </p>
            <div className="flex justify-center my-6">
              <div className="relative w-32 h-24">
                <Image
                  src="/images/eaa/ce-mark.svg"
                  alt="CE marking logo consisting of the letters C and E"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p>The CE marking on a product indicates:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The product complies with all applicable EU requirements,
                including accessibility requirements under the EAA where
                relevant
              </li>
              <li>
                The manufacturer has fulfilled all applicable conformity
                assessment procedures
              </li>
              <li>
                The product can be freely marketed throughout the EU without
                additional compliance requirements
              </li>
              <li>
                The manufacturer takes full responsibility for the product's
                conformity with EU legislation
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="products-requiring" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="products-requiring">
            Products Requiring CE Marking
          </h2>
          <div className="space-y-4">
            <p>Under the EAA, CE marking is required for products that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fall within the scope of the EAA as defined in Article 2</li>
              <li>Are subject to the accessibility requirements in Annex I</li>
              <li>
                Are already subject to other EU harmonization legislation
                requiring CE marking
              </li>
            </ul>
            <p>
              Examples of products requiring CE marking under the EAA include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Consumer computer hardware systems and operating systems</li>
              <li>
                Self-service terminals (payment terminals, ATMs, ticketing
                machines, check-in machines)
              </li>
              <li>
                Consumer terminal equipment with interactive computing
                capability used for electronic communication services
              </li>
              <li>
                Consumer terminal equipment with interactive computing
                capability used for accessing audiovisual media services
              </li>
              <li>E-readers</li>
            </ul>
            <p>
              Note that services themselves do not require CE marking, but the
              products used to provide the services generally do.
            </p>
          </div>
        </section>

        <section aria-labelledby="responsibility" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="responsibility">
            Responsibility for CE Marking
          </h2>
          <div className="space-y-4">
            <p>The responsibility for affixing the CE marking lies with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Manufacturer:</strong> The primary responsibility
                belongs to the manufacturer, who must ensure the product meets
                all requirements and affix the CE marking before placing it on
                the EU market
              </li>
              <li>
                <strong>Authorized representative:</strong> When explicitly
                mandated by the manufacturer, an authorized representative
                established in the EU may affix the CE marking on behalf of the
                manufacturer
              </li>
              <li>
                <strong>Importer or distributor:</strong> When an importer or
                distributor markets a product under their own name or trademark,
                they assume the responsibilities of the manufacturer, including
                CE marking
              </li>
            </ul>
            <p>
              By affixing the CE marking, the responsible economic operator
              declares that they have verified the product complies with all
              relevant accessibility requirements and have completed all
              necessary conformity assessment procedures.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="conformity-assessment"
          className="scroll-mt-24"
        >
          <h2
            className="text-2xl font-semibold mb-4"
            id="conformity-assessment"
          >
            Conformity Assessment for CE Marking
          </h2>
          <div className="space-y-4">
            <p>Before affixing the CE marking, manufacturers must:</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>Determine applicable requirements:</strong> Identify all
                EU directives and regulations applicable to the product,
                including the EAA
              </li>
              <li>
                <strong>Verify product compliance:</strong> Ensure the product
                meets all identified requirements, including accessibility
                requirements
              </li>
              <li>
                <strong>Perform conformity assessment:</strong> Conduct the
                required conformity assessment procedure, which for the EAA is
                typically internal production control (Module A)
              </li>
              <li>
                <strong>Compile technical documentation:</strong> Create and
                maintain technical documentation demonstrating conformity
              </li>
              <li>
                <strong>Draw up EU Declaration of Conformity:</strong> Prepare
                and sign a declaration stating the product meets all applicable
                requirements
              </li>
              <li>
                <strong>Affix the CE marking:</strong> Apply the marking to the
                product and/or packaging according to the prescribed rules
              </li>
            </ol>
            <p>
              For most products under the EAA, manufacturers can self-declare
              conformity without involvement of a third-party notified body.
              However, they must be prepared to provide evidence of compliance
              upon request from market surveillance authorities.
            </p>
          </div>
        </section>

        <section aria-labelledby="format-placement" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="format-placement">
            Format and Placement Requirements
          </h2>
          <div className="space-y-4">
            <p>
              The CE marking must follow specific format and placement
              requirements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Appearance:</strong> The CE marking must:
                <ul className="list-disc pl-6 mt-2">
                  <li>Consist of the initials "CE" in the standardized form</li>
                  <li>
                    Have a minimum height of 5mm (unless specified otherwise in
                    relevant legislation)
                  </li>
                  <li>Maintain the specified proportions if scaled</li>
                  <li>Appear in a visible, legible, and indelible form</li>
                </ul>
              </li>
              <li>
                <strong>Placement:</strong> The CE marking must be affixed:
                <ul className="list-disc pl-6 mt-2">
                  <li>Visibly, legibly, and indelibly to the product</li>
                  <li>
                    If not possible or warranted on the product itself, on the
                    packaging
                  </li>
                  <li>
                    If not possible on the packaging, in accompanying documents
                  </li>
                </ul>
              </li>
              <li>
                <strong>Timing:</strong> The CE marking must be affixed before
                the product is placed on the EU market
              </li>
              <li>
                <strong>Exclusivity:</strong> No markings that resemble the CE
                marking in meaning or form may be affixed if they might mislead
                third parties
              </li>
            </ul>
            <p>
              The CE marking cannot be combined with specific accessibility
              indications; it is a comprehensive compliance mark covering all
              applicable EU legislation, including accessibility requirements.
            </p>
          </div>
        </section>

        <section aria-labelledby="documentation" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="documentation">
            Documentation Requirements
          </h2>
          <div className="space-y-4">
            <p>
              When affixing the CE marking, manufacturers must maintain
              comprehensive documentation including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>EU Declaration of Conformity:</strong> A legally binding
                document declaring compliance with the EAA and all other
                applicable EU legislation
              </li>
              <li>
                <strong>Technical documentation:</strong> Detailed technical
                information that:
                <ul className="list-disc pl-6 mt-2">
                  <li>Describes the product and its intended use</li>
                  <li>
                    Documents the assessment of accessibility requirements
                  </li>
                  <li>Lists applied standards or technical specifications</li>
                  <li>Includes test reports and assessments</li>
                </ul>
              </li>
              <li>
                <strong>Instructions and safety information:</strong> Clear user
                instructions in the languages of the countries where the product
                is sold
              </li>
              <li>
                <strong>Design and production records:</strong> Documentation of
                the design, manufacturing, and quality assurance processes
              </li>
            </ul>
            <p>
              These documents must be kept for at least 5 years after the last
              product of the model has been placed on the market and must be
              made available to authorities upon request.
            </p>
          </div>
        </section>

        <section aria-labelledby="enforcement" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="enforcement">
            Market Surveillance and Enforcement
          </h2>
          <div className="space-y-4">
            <p>The CE marking is enforced through various mechanisms:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Market surveillance authorities:</strong> National
                authorities in each Member State monitor products on the market
                to ensure CE marked products:
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    Comply with all applicable requirements, including
                    accessibility
                  </li>
                  <li>Have properly affixed CE markings</li>
                  <li>Are supported by correct documentation</li>
                </ul>
              </li>
              <li>
                <strong>Enforcement actions:</strong> When non-compliance is
                found, authorities may:
                <ul className="list-disc pl-6 mt-2">
                  <li>Require corrective action within a specific timeframe</li>
                  <li>Restrict or prohibit the product from the market</li>
                  <li>Order product recalls</li>
                  <li>Impose financial penalties</li>
                </ul>
              </li>
              <li>
                <strong>EU-wide alert systems:</strong> The Rapid Alert System
                for dangerous non-food products (RAPEX) allows quick information
                exchange about non-compliant products across the EU
              </li>
            </ul>
            <p>
              Economic operators should be prepared for potential inspections
              and be able to demonstrate compliance with all relevant
              requirements upon request.
            </p>
          </div>
        </section>

        <section aria-labelledby="misconceptions" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="misconceptions">
            Common Misconceptions
          </h2>
          <div className="space-y-4">
            <p>
              There are several common misconceptions about CE marking in
              relation to accessibility:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>
                  Misconception: CE marking guarantees accessibility.
                </strong>
                <p className="mt-1">
                  <em>Reality:</em> CE marking indicates the manufacturer claims
                  compliance with all applicable requirements, but does not
                  guarantee actual accessibility. Products may still have
                  accessibility issues despite having a CE mark.
                </p>
              </li>
              <li>
                <strong>
                  Misconception: CE marking is only about product safety.
                </strong>
                <p className="mt-1">
                  <em>Reality:</em> While historically focused on safety, CE
                  marking now encompasses many product aspects, including
                  accessibility, environmental performance, and energy
                  efficiency.
                </p>
              </li>
              <li>
                <strong>
                  Misconception: Services require CE marking under the EAA.
                </strong>
                <p className="mt-1">
                  <em>Reality:</em> Services themselves do not require CE
                  marking, but products used to provide those services generally
                  do.
                </p>
              </li>
              <li>
                <strong>
                  Misconception: Third-party certification is always required
                  for CE marking.
                </strong>
                <p className="mt-1">
                  <em>Reality:</em> For most products under the EAA,
                  self-declaration by the manufacturer is sufficient without
                  third-party involvement.
                </p>
              </li>
              <li>
                <strong>
                  Misconception: CE marking can be used as a general quality
                  mark.
                </strong>
                <p className="mt-1">
                  <em>Reality:</em> CE marking is not a quality mark but a
                  regulatory compliance mark. It indicates compliance with
                  minimum requirements, not exceptional quality.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="exemptions" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="exemptions">
            Exemptions and Special Cases
          </h2>
          <div className="space-y-4">
            <p>
              There are several exemptions and special cases regarding CE
              marking under the EAA:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Microenterprises:</strong> Microenterprises (fewer than
                10 persons and annual turnover not exceeding €2 million)
                providing services have simplified documentation requirements
                but must still ensure compliance
              </li>
              <li>
                <strong>Disproportionate burden exemption:</strong> If making a
                product accessible would impose a disproportionate burden,
                manufacturers may be exempt from some requirements, but must
                still:
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    Document the assessment in their technical documentation
                  </li>
                  <li>Notify relevant market surveillance authorities</li>
                  <li>Provide information on request</li>
                </ul>
              </li>
              <li>
                <strong>Fundamental alteration exemption:</strong> When meeting
                accessibility requirements would require a fundamental
                alteration in the nature of the product, exemption may apply but
                must be documented
              </li>
              <li>
                <strong>Transition period:</strong> Products placed on the
                market before June 28, 2025, may continue to be provided until
                June 28, 2030, even if they don't fully comply with EAA
                requirements
              </li>
            </ul>
            <p>
              Even in cases of exemption, manufacturers must document their
              assessment of the situation and maintain evidence to justify the
              exemption.
            </p>
          </div>
        </section>

        <nav
          className="flex justify-between mt-10 pt-4 border-t"
          aria-label="Chapter navigation"
        >
          <Link
            href="/eaa/3.3-eu-declaration"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            ← EU Declaration of Conformity
          </Link>
          <Link
            href="/eaa/3.5-market-surveillance"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Market Surveillance →
          </Link>
        </nav>
      </div>
    </main>
  )
}
