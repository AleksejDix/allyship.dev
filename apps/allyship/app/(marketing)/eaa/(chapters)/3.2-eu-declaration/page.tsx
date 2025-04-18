import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EU Declaration of Conformity | European Accessibility Act',
  description:
    'Learn about the EU Declaration of Conformity requirements under the European Accessibility Act (EAA).',
}

export default function EuDeclarationPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">EU Declaration of Conformity</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview and Purpose
          </h2>
          <div className="space-y-4">
            <p>
              The EU Declaration of Conformity (DoC) is a formal document that
              manufacturers must create to declare that their products meet all
              the applicable accessibility requirements of the European
              Accessibility Act. By drawing up this declaration, the
              manufacturer assumes full responsibility for the compliance of the
              product.
            </p>
            <p>
              This document is a critical part of the conformity assessment
              process, serving as the manufacturer's official statement that
              their product complies with the legal requirements. It enables
              authorities, distributors, and end-users to verify that the
              product has undergone the necessary assessment procedures.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="structure-content">
            Structure and Content
          </h2>
          <div className="space-y-4">
            <p>
              According to Article 16 of the EAA, the EU Declaration of
              Conformity:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Must follow the model structure set out in Annex III to Decision
                No 768/2008/EC
              </li>
              <li>
                Must contain all the elements specified in Annex IV of the EAA
              </li>
              <li>
                Must be continuously updated if any changes are made to the
                product
              </li>
              <li>
                Must be translated into the language(s) required by the Member
                State where the product is placed or made available
              </li>
            </ul>
            <p>
              The declaration must identify the product for which it has been
              drawn up, typically including information such as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Product name, type, batch or serial number</li>
              <li>
                Name and address of the manufacturer and, where applicable,
                their authorized representative
              </li>
              <li>
                References to the relevant harmonized standards or technical
                specifications applied
              </li>
              <li>Date of issue of the declaration</li>
              <li>Signature of the person responsible</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="exceptions">
            Exceptions and Special Provisions
          </h2>
          <div className="space-y-4">
            <p>
              When manufacturers use the exception for fundamental alteration or
              disproportionate burden under Article 14 of the EAA, the
              declaration must explicitly state which accessibility requirements
              are subject to that exception.
            </p>
            <p>
              The EAA specifies that the requirements for technical
              documentation should avoid imposing any undue burden for
              microenterprises and SMEs, while still ensuring sufficient detail
              to demonstrate compliance.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="single-declaration">
            Single EU Declaration of Conformity
          </h2>
          <div className="space-y-4">
            <p>
              Where a product is subject to more than one Union act requiring an
              EU Declaration of Conformity, manufacturers may create a single
              declaration that covers all applicable Union acts. This approach:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reduces administrative burden on economic operators</li>
              <li>
                Ensures effective access to information for market surveillance
                purposes
              </li>
              <li>
                Must contain the identification of all the relevant acts,
                including their publication references
              </li>
            </ul>
            <p>
              This provision allows manufacturers to include all relevant
              individual declarations of conformity in a single document, which
              is particularly useful for products that must comply with multiple
              directives or regulations.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="retention-availability"
          >
            Retention and Availability
          </h2>
          <div className="space-y-4">
            <p>
              Manufacturers and importers have specific obligations regarding
              the EU Declaration of Conformity:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Manufacturers must keep the declaration for five years after the
                product has been placed on the market
              </li>
              <li>
                Importers must keep a copy of the declaration for five years at
                the disposal of market surveillance authorities
              </li>
              <li>
                A copy of the declaration must be made available to relevant
                authorities upon request
              </li>
              <li>
                Distributors must verify that the product is accompanied by the
                required documentation, including the declaration when
                applicable
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="relationship-ce-marking"
          >
            Relationship with CE Marking
          </h2>
          <div className="space-y-4">
            <p>
              The EU Declaration of Conformity is closely linked to the CE
              marking:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The CE marking is the visible indication that a product complies
                with EU legislation
              </li>
              <li>
                The EU Declaration of Conformity is the document that
                substantiates this compliance
              </li>
              <li>
                A manufacturer must draw up the EU Declaration of Conformity
                before affixing the CE marking to a product
              </li>
              <li>
                Together, they form a complete conformity assessment process
                that enables free movement of products in the European market
              </li>
            </ul>
            <p>
              By affixing the CE marking, the manufacturer declares that the
              product is in conformity with all applicable accessibility
              requirements and that they take full responsibility for this
              conformity.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/harmonized-standards"
            className="text-blue-600 hover:underline"
          >
            ← Harmonized Standards
          </Link>
          <Link
            href="/eaa/ce-marking"
            className="text-blue-600 hover:underline"
          >
            CE Marking →
          </Link>
        </nav>
      </div>
    </>
  )
}
