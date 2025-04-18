import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EU Declaration of Conformity | European Accessibility Act',
  description:
    'Understanding the EU Declaration of Conformity requirements under the European Accessibility Act, including content, format, and responsibilities.',
}

export default function EUDeclarationPage() {
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

      <h1 className="text-4xl font-bold mb-8">EU Declaration of Conformity</h1>

      <div className="space-y-8">
        <section aria-labelledby="purpose" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="purpose">
            Purpose and Significance
          </h2>
          <div className="space-y-4">
            <p>
              The EU Declaration of Conformity (DoC) is a legally binding
              document that officially states that a product meets all
              accessibility requirements of the European Accessibility Act (EAA)
              and other relevant EU legislation. This document represents the
              formal statement of responsibility by the manufacturer or service
              provider.
            </p>
            <p>Key functions of the Declaration of Conformity include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Providing a legal commitment that the product complies with all
                relevant requirements
              </li>
              <li>
                Enabling free movement of goods within the European Single
                Market
              </li>
              <li>
                Facilitating market surveillance and enforcement activities
              </li>
              <li>Creating a chain of accountability in the supply chain</li>
              <li>
                Informing downstream economic operators about compliance status
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="responsibility" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="responsibility">
            Responsibility for the Declaration
          </h2>
          <div className="space-y-4">
            <p>
              The responsibility for drawing up the EU Declaration of Conformity
              lies with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Manufacturers:</strong> For products they produce,
                including any imported products they rebrand as their own
              </li>
              <li>
                <strong>Authorized representatives:</strong> When explicitly
                mandated by manufacturers to create and sign the declaration on
                their behalf
              </li>
            </ul>
            <p>
              By drawing up the EU Declaration of Conformity, economic operators
              assume full responsibility for the compliance of their products
              with the EAA requirements. This includes legal liability in case
              of non-compliance.
            </p>
            <p>
              Note that service providers are required to provide information
              about how the services meet the accessibility requirements but are
              not required to issue a formal EU Declaration of Conformity as
              defined in the EAA.
            </p>
          </div>
        </section>

        <section aria-labelledby="required-content" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="required-content">
            Required Content
          </h2>
          <div className="space-y-4">
            <p>
              According to the EAA, the EU Declaration of Conformity must
              contain at least the following elements:
            </p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>Product identification:</strong> Clear and unambiguous
                product identification with:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Product name, type, model or serial number</li>
                  <li>
                    Sufficient information to trace the product to its
                    declaration
                  </li>
                  <li>Optional product image if helpful for identification</li>
                </ul>
              </li>
              <li>
                <strong>Manufacturer information:</strong> Complete details of
                the manufacturer:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name and full business address</li>
                  <li>Contact information</li>
                  <li>Authorized representative details (if applicable)</li>
                </ul>
              </li>
              <li>
                <strong>Declaration statement:</strong> A clear statement that:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    The declaration is issued under the sole responsibility of
                    the manufacturer
                  </li>
                  <li>
                    The product complies with the European Accessibility Act
                  </li>
                  <li>Reference to Directive (EU) 2019/882</li>
                </ul>
              </li>
              <li>
                <strong>References to standards:</strong> References to:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Harmonized standards applied (with dated references)</li>
                  <li>
                    Technical specifications used in the absence of harmonized
                    standards
                  </li>
                  <li>
                    Indication of which parts of standards or specifications
                    were applied
                  </li>
                </ul>
              </li>
              <li>
                <strong>References to other EU legislation:</strong> If the
                product is subject to other EU legislation requiring a DoC,
                references to:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Other relevant EU directives and regulations</li>
                  <li>
                    Confirmation of compliance with these additional
                    requirements
                  </li>
                </ul>
              </li>
              <li>
                <strong>Notified body reference (if applicable):</strong> If a
                notified body was involved:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name and identification number of the notified body</li>
                  <li>Description of the conformity assessment performed</li>
                  <li>Certificate reference numbers</li>
                </ul>
              </li>
              <li>
                <strong>Signature information:</strong> The declaration must
                include:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Place and date of issue</li>
                  <li>Name and function of the person signing</li>
                  <li>
                    Signature (electronic signature is acceptable in many cases)
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        <section aria-labelledby="format-structure" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="format-structure">
            Format and Structure
          </h2>
          <div className="space-y-4">
            <p>
              While the EAA does not prescribe a specific format for the
              Declaration of Conformity, it should follow these general
              guidelines:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Language requirements:</strong> The declaration must be
                translated into the languages required by the Member States
                where the product is placed on the market
              </li>
              <li>
                <strong>Standard model:</strong> Where possible, follow the
                model structure provided in other EU harmonization legislation
                (such as Annex III to Decision No 768/2008/EC)
              </li>
              <li>
                <strong>Single document:</strong> The declaration should be a
                single document, even if the product falls under multiple EU
                legislations
              </li>
              <li>
                <strong>Document identification:</strong> Include a unique
                identifier or version number to distinguish between different
                versions of the declaration
              </li>
            </ul>
            <p>
              The declaration may be in paper or electronic format, as long as
              it meets all requirements and can be accessed by relevant
              authorities when requested.
            </p>
          </div>
        </section>

        <section aria-labelledby="simplified-doc" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="simplified-doc">
            Simplified Declaration
          </h2>
          <div className="space-y-4">
            <p>
              In some cases, a simplified EU Declaration of Conformity may be
              used under the EAA:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>When allowed:</strong> A simplified declaration can be
                used where the full declaration would be overly complex or would
                need to accompany each individual product
              </li>
              <li>
                <strong>Required content:</strong> The simplified declaration
                must contain:
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    Standard statement of compliance with Directive (EU)
                    2019/882
                  </li>
                  <li>
                    Exact internet address where the full EU Declaration of
                    Conformity can be obtained
                  </li>
                </ul>
              </li>
              <li>
                <strong>Accessibility:</strong> The full declaration must be
                accessible through the provided internet address for the
                duration of the product's availability on the market
              </li>
            </ul>
            <p>
              The simplified declaration is particularly useful for products
              with space constraints for labeling or where including the full
              declaration with each product would be impractical.
            </p>
          </div>
        </section>

        <section aria-labelledby="maintenance" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="maintenance">
            Maintenance and Updates
          </h2>
          <div className="space-y-4">
            <p>
              The EU Declaration of Conformity must be kept up-to-date
              throughout the product's lifecycle:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Regular review:</strong> The declaration should be
                reviewed periodically to ensure it remains accurate
              </li>
              <li>
                <strong>Update triggers:</strong> The declaration must be
                updated when:
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    The product design changes affect accessibility features
                  </li>
                  <li>
                    Referenced standards or technical specifications change
                  </li>
                  <li>
                    Any other information in the declaration becomes outdated
                  </li>
                </ul>
              </li>
              <li>
                <strong>Version control:</strong> Each updated version should be
                clearly identified with a new version number or date
              </li>
              <li>
                <strong>Record-keeping:</strong> Previous versions should be
                retained for reference and auditing purposes
              </li>
            </ul>
            <p>
              Manufacturers must keep the EU Declaration of Conformity available
              for at least 5 years after the last product of that model has been
              placed on the market.
            </p>
          </div>
        </section>

        <section aria-labelledby="availability" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="availability">
            Availability Requirements
          </h2>
          <div className="space-y-4">
            <p>
              The EU Declaration of Conformity must be made available to
              relevant parties according to these requirements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Market surveillance authorities:</strong> The
                declaration must be made available immediately upon request from
                authorities in any EU Member State
              </li>
              <li>
                <strong>Other economic operators:</strong> The declaration
                should be provided to:
                <ul className="list-disc pl-6 mt-2">
                  <li>Importers before they place the product on the market</li>
                  <li>Distributors upon request</li>
                </ul>
              </li>
              <li>
                <strong>Consumers and end-users:</strong> While not typically
                provided directly to consumers, the declaration may be:
                <ul className="list-disc pl-6 mt-2">
                  <li>Made available on the manufacturer's website</li>
                  <li>Included in product documentation</li>
                  <li>Provided upon specific request</li>
                </ul>
              </li>
            </ul>
            <p>
              When using a simplified declaration, manufacturers must ensure
              that the full declaration is continuously available at the
              specified internet address for as long as the product is on the
              market.
            </p>
          </div>
        </section>

        <section aria-labelledby="legal-implications" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4" id="legal-implications">
            Legal Implications
          </h2>
          <div className="space-y-4">
            <p>
              The EU Declaration of Conformity carries significant legal weight:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Legal responsibility:</strong> By signing the
                declaration, the manufacturer takes full legal responsibility
                for the product's compliance
              </li>
              <li>
                <strong>Presumption of compliance:</strong> A properly drawn-up
                declaration creates a presumption of conformity that allows the
                product to freely circulate in the EU market
              </li>
              <li>
                <strong>Penalties for non-compliance:</strong> Providing a false
                or incomplete declaration may result in:
                <ul className="list-disc pl-6 mt-2">
                  <li>Administrative penalties</li>
                  <li>Market withdrawal orders</li>
                  <li>Financial penalties</li>
                  <li>Criminal liability in serious cases</li>
                </ul>
              </li>
            </ul>
            <p>
              Given these implications, economic operators should ensure that
              their products genuinely comply with all requirements before
              issuing a Declaration of Conformity.
            </p>
          </div>
        </section>

        <nav
          className="flex justify-between mt-10 pt-4 border-t"
          aria-label="Chapter navigation"
        >
          <Link
            href="/eaa/3.2-technical-documentation"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            ← Technical Documentation
          </Link>
          <Link
            href="/eaa/3.4-ce-marking"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            CE Marking →
          </Link>
        </nav>
      </div>
    </main>
  )
}
