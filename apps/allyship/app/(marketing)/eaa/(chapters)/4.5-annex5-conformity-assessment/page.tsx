import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { ANNEXES_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title:
    'Annex V: Conformity Assessment for Products | European Accessibility Act',
  description:
    'Clear explanation of how to check if products meet accessibility requirements under the European Accessibility Act, including step-by-step procedures.',
}

export default function ConformityAssessmentProductsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Annex V: Conformity Assessment for Products.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#internal-production-control"
                  id="internal-production-control-link"
                >
                  Internal Production Control.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#eu-type-examination"
                  id="eu-type-examination-link"
                >
                  EU-Type Examination.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#conformity-to-type"
                  id="conformity-to-type-link"
                >
                  Conformity to Type.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#choosing-procedure"
                  id="choosing-procedure-link"
                >
                  Choosing the Procedure.
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
                  href="#notified-bodies"
                  id="notified-bodies-link"
                >
                  Role of Notified Bodies.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#declaration-and-marking"
                  id="declaration-and-marking-link"
                >
                  Declaration and CE Marking.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#information-retention"
                  id="information-retention-link"
                >
                  Record Keeping.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#relationship-other-annexes"
                  id="relationship-other-annexes-link"
                >
                  Relationship with Other Annexes.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2">
        <div className="space-y-8">
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                Annex V explains how to check if products meet the accessibility
                requirements in the European Accessibility Act (EAA). Companies
                can use two methods to check their products: internal production
                control (Module A) or EU-type examination followed by conformity
                to type (Modules B and C).
              </p>
              <p>
                This checking process is an important step that manufacturers
                must complete before selling products in the EU. It confirms
                that products meet the accessibility requirements in Annex I of
                the EAA. This process is the basis for the EU Declaration of
                Conformity and CE marking.
              </p>
            </div>
          </section>

          <section aria-labelledby="internal-production-control">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="internal-production-control"
              tabIndex={-1}
            >
              Module A: Internal Production Control.
            </h2>
            <div className="space-y-4">
              <p>
                Internal production control (Module A) is the simplest way to
                check conformity. With this method, the manufacturer takes full
                responsibility for making sure their products meet the
                requirements.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Key Elements of Internal Production Control.
              </h3>
              <p>
                Manufacturers must complete these steps when using Module A.
              </p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Technical Documentation.</strong> The manufacturer
                  must create technical documents that show how the product
                  meets the accessibility requirements. These documents must
                  include:
                  <ul className="list-disc pl-6 mt-2">
                    <li>A general description of the product.</li>
                    <li>
                      A list of the standards and technical specifications used.
                    </li>
                    <li>
                      Explanations that help understand how the product works
                      and its accessibility features.
                    </li>
                    <li>
                      Design and manufacturing drawings of components,
                      sub-assemblies, and circuits.
                    </li>
                    <li>Results of design calculations and tests.</li>
                    <li>Test reports related to accessibility features.</li>
                  </ul>
                </li>
                <li>
                  <strong>Manufacturing Process Controls.</strong> The
                  manufacturer must take all needed steps to ensure that the
                  manufacturing process produces products that comply with:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      The technical documentation created in the previous step.
                    </li>
                    <li>The accessibility requirements in Annex I.</li>
                  </ul>
                </li>
                <li>
                  <strong>Conformity Marking and Declaration.</strong> The
                  manufacturer must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Put the CE marking on each product that meets the
                      requirements.
                    </li>
                    <li>
                      Write an EU Declaration of Conformity for each product
                      model.
                    </li>
                    <li>
                      Keep the technical documentation and EU Declaration of
                      Conformity for five years after putting the product on the
                      market.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Authorized Representative.</strong> The manufacturer
                  can assign an authorized representative to fulfill these
                  tasks, but this must be specified in writing.
                </li>
              </ol>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                When to Use Internal Production Control.
              </h3>
              <p>Internal production control works best when:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The product design is simple regarding accessibility features.
                </li>
                <li>
                  The manufacturer has good knowledge about accessibility and
                  conformity assessment.
                </li>
                <li>
                  The accessibility requirements for the product are clear and
                  can be checked through internal testing.
                </li>
                <li>
                  There are established standards that cover all the
                  accessibility requirements for the product.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="eu-type-examination">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="eu-type-examination"
              tabIndex={-1}
            >
              Module B: EU-Type Examination.
            </h2>
            <div className="space-y-4">
              <p>
                EU-type examination (Module B) is a method where an official
                testing body (called a notified body) checks the design of a
                product and confirms that it meets the accessibility
                requirements.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Process for EU-Type Examination.
              </h3>
              <p>This process includes these steps:</p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Application to Notified Body.</strong> The
                  manufacturer must submit an application to one notified body
                  of their choice. The application must include:
                  <ul className="list-disc pl-6 mt-2">
                    <li>The name and address of the manufacturer.</li>
                    <li>
                      A written statement that they have not applied to any
                      other notified body.
                    </li>
                    <li>
                      The technical documentation as described in Module A.
                    </li>
                    <li>
                      Sample products that represent what will be produced.
                    </li>
                    <li>
                      Evidence that shows the technical design solution is
                      adequate.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Assessment by Notified Body.</strong> The notified
                  body will:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Review the technical documentation to check if the product
                      design meets the accessibility requirements.
                    </li>
                    <li>
                      Verify that the samples were made according to the
                      technical documentation.
                    </li>
                    <li>
                      Perform tests to check if the product meets the
                      accessibility requirements.
                    </li>
                    <li>
                      Agree with the manufacturer on where the tests will take
                      place.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Evaluation Report and Certificate.</strong> The
                  notified body will:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Create a report that records all activities and results.
                    </li>
                    <li>
                      Issue an EU-type examination certificate if the product
                      meets the accessibility requirements.
                    </li>
                    <li>
                      Refuse to issue a certificate if the product does not meet
                      the requirements, and explain why.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Ongoing Obligations.</strong> After the certificate is
                  issued:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      The notified body must stay informed about changes in
                      technology that might affect compliance.
                    </li>
                    <li>
                      The manufacturer must tell the notified body about any
                      changes to the approved product that might affect
                      conformity.
                    </li>
                    <li>
                      The notified body must review changes and decide if
                      further testing is needed.
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="conformity-to-type">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="conformity-to-type"
              tabIndex={-1}
            >
              Module C: Conformity to Type Based on Internal Production Control.
            </h2>
            <div className="space-y-4">
              <p>
                This module follows Module B and focuses on making sure
                manufactured products match the approved EU-type examination
                certificate. The manufacturer is responsible for ensuring this
                conformity through internal production controls.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Key Requirements for Conformity to Type.
              </h3>
              <p>Under Module C, the manufacturer must:</p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Manufacturing Controls.</strong> Take all necessary
                  steps to ensure that the manufacturing process produces
                  products that match the approved type described in the EU-type
                  examination certificate and comply with the accessibility
                  requirements.
                </li>
                <li>
                  <strong>CE Marking and Declaration.</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Put the CE marking on each product that matches the
                      approved type and meets the requirements.
                    </li>
                    <li>
                      Write an EU Declaration of Conformity for each product
                      model.
                    </li>
                    <li>
                      Keep a copy of the EU Declaration of Conformity available
                      for national authorities for five years after the product
                      has been sold.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Authorized Representative.</strong> The manufacturer
                  can assign an authorized representative to fulfill these
                  obligations, but this must be specified in writing.
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="choosing-procedure">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="choosing-procedure"
              tabIndex={-1}
            >
              Choosing the Right Assessment Procedure.
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers can choose which assessment procedure to use based
                on their specific situation.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Factors to Consider.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Product Complexity.</strong> More complex products
                  with many accessibility features may benefit from the detailed
                  review provided by EU-type examination.
                </li>
                <li>
                  <strong>Market Risk.</strong> Products where accessibility
                  failures could significantly impact users might need external
                  verification through Modules B and C.
                </li>
                <li>
                  <strong>Manufacturer Experience.</strong> Companies with
                  limited accessibility experience might gain confidence by
                  using external notified bodies.
                </li>
                <li>
                  <strong>Available Standards.</strong> Where established
                  standards fully cover the product, internal production control
                  may be enough; where gaps exist, external verification
                  provides added assurance.
                </li>
                <li>
                  <strong>Business Considerations.</strong> While Module A
                  (internal production control) is typically faster and less
                  costly, Modules B and C may provide market advantages through
                  third-party verification.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Decision Guide.
              </h3>
              <p>In general, manufacturers should consider using:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Module A (Internal Production Control) when:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>The product has simple accessibility features.</li>
                    <li>
                      The company has strong internal accessibility expertise.
                    </li>
                    <li>
                      Standards completely cover all applicable requirements.
                    </li>
                    <li>
                      The product represents low risk in terms of accessibility
                      impact.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>
                    Modules B and C (EU-Type Examination and Conformity to Type)
                    when:
                  </strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>The product has complex accessibility features.</li>
                    <li>The company has limited accessibility expertise.</li>
                    <li>Few standards exist for the product type.</li>
                    <li>
                      Third-party verification would strengthen market position.
                    </li>
                    <li>
                      The product would significantly impact users if
                      accessibility features fail.
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="technical-documentation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="technical-documentation"
              tabIndex={-1}
            >
              Technical Documentation Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                No matter which module you choose, you need good technical
                documentation for conformity assessment. The technical
                documentation must include:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Required Documentation Components.
              </h3>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>General Product Description.</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Overview of what the product does and who will use it.
                    </li>
                    <li>List of components, parts, and subassemblies.</li>
                    <li>
                      Description of user interfaces and how people interact
                      with the product.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Accessibility Features Documentation.</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Detailed description of how the product meets each
                      accessibility requirement.
                    </li>
                    <li>
                      Screenshots, diagrams, and examples of accessibility
                      features.
                    </li>
                    <li>
                      Explanations of design choices made to support
                      accessibility.
                    </li>
                    <li>
                      User documentation related to accessibility features.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Standards and Specifications.</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>List of standards applied fully or partly.</li>
                    <li>
                      Descriptions of solutions used to meet requirements where
                      standards haven't been applied.
                    </li>
                    <li>References to technical specifications used.</li>
                  </ul>
                </li>
                <li>
                  <strong>Design and Manufacturing Information.</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Drawings, diagrams, and specifications of components
                      related to accessibility.
                    </li>
                    <li>
                      Manufacturing processes that ensure consistent
                      implementation of accessibility features.
                    </li>
                    <li>
                      Quality control procedures for accessibility features.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Test Results and Assessments.</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Results of accessibility tests performed.</li>
                    <li>Test methods and validation procedures.</li>
                    <li>
                      User testing with persons with disabilities (if
                      conducted).
                    </li>
                    <li>
                      Analysis of test results and corrective actions taken.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Risk Assessment.</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      List of accessibility-related risks and potential failure
                      points.
                    </li>
                    <li>Steps taken to address identified risks.</li>
                    <li>
                      Analysis of remaining risks and reasons for accepting
                      them.
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="notified-bodies">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="notified-bodies"
              tabIndex={-1}
            >
              Role of Notified Bodies.
            </h2>
            <div className="space-y-4">
              <p>
                Notified bodies play an important role in the conformity
                assessment procedures, especially for Module B (EU-type
                examination).
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Key Responsibilities of Notified Bodies.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Technical Assessment.</strong> Evaluating whether a
                  product's design meets the accessibility requirements in the
                  EAA.
                </li>
                <li>
                  <strong>Testing and Verification.</strong> Conducting tests to
                  verify compliance with accessibility requirements.
                </li>
                <li>
                  <strong>Certificate Issuance.</strong> Issuing EU-type
                  examination certificates for compliant products.
                </li>
                <li>
                  <strong>Ongoing Monitoring.</strong> Staying informed about
                  changes in standards that might affect compliance.
                </li>
                <li>
                  <strong>Change Assessment.</strong> Evaluating product changes
                  to determine if they affect compliance.
                </li>
                <li>
                  <strong>Documentation.</strong> Keeping records of assessments
                  and decisions.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Selecting a Notified Body.
              </h3>
              <p>
                When choosing a notified body for conformity assessment,
                manufacturers should consider:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Scope of Authorization.</strong> Make sure the body is
                  authorized to assess your specific product category.
                </li>
                <li>
                  <strong>Accessibility Expertise.</strong> Check the body's
                  specific expertise in accessibility assessment.
                </li>
                <li>
                  <strong>Assessment Approach.</strong> Understand their methods
                  and requirements.
                </li>
                <li>
                  <strong>Reputation and Experience.</strong> Consider their
                  track record with similar products.
                </li>
                <li>
                  <strong>Timing and Cost.</strong> Compare their process
                  timeframes and fees.
                </li>
                <li>
                  <strong>Support Services.</strong> Determine what guidance
                  they provide during the assessment process.
                </li>
              </ul>
              <p>
                Each EU country publishes a list of notified bodies designated
                for conformity assessment under the EAA, along with their
                identification numbers and specific tasks.
              </p>
            </div>
          </section>

          <section aria-labelledby="declaration-and-marking">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="declaration-and-marking"
              tabIndex={-1}
            >
              EU Declaration of Conformity and CE Marking.
            </h2>
            <div className="space-y-4">
              <p>
                After completing the conformity assessment procedure,
                manufacturers must create two important items: the EU
                Declaration of Conformity and CE marking.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                EU Declaration of Conformity.
              </h3>
              <p>
                The EU Declaration of Conformity is a document where the
                manufacturer states that the product meets all accessibility
                requirements. It must contain:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Product identification (model, type, batch, or serial number).
                </li>
                <li>
                  Name and address of the manufacturer or authorized
                  representative.
                </li>
                <li>
                  A statement that the declaration is issued under the sole
                  responsibility of the manufacturer.
                </li>
                <li>Information that allows the product to be traced.</li>
                <li>Reference to the EAA and other relevant EU laws.</li>
                <li>
                  References to relevant standards or specifications used.
                </li>
                <li>
                  Where applicable, the name and number of the notified body and
                  reference to the EU-type examination certificate.
                </li>
                <li>Signature, date, and place of issue.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">CE Marking.</h3>
              <p>The CE marking:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Must be visible, readable, and permanent on the product.
                </li>
                <li>
                  Must appear on the product packaging if it cannot be put on
                  the product itself.
                </li>
                <li>
                  Must be applied before the product is sold in the market.
                </li>
                <li>
                  May be followed by the identification number of the notified
                  body if one was involved.
                </li>
                <li>
                  Shows that the product complies with all applicable EU laws,
                  including the EAA.
                </li>
              </ul>
              <p>
                By applying the CE marking, the manufacturer takes full
                responsibility for the product's conformity with all applicable
                EU law requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="information-retention">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="information-retention"
              tabIndex={-1}
            >
              Record Keeping Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must keep certain documents related to conformity
                assessment for a specific time period:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Technical Documentation.</strong> Must be kept for
                  five years after the product has been placed on the market.
                </li>
                <li>
                  <strong>EU Declaration of Conformity.</strong> Must be kept
                  for five years after the last product has been made available.
                </li>
                <li>
                  <strong>EU-Type Examination Certificate and Annexes.</strong>{' '}
                  Must be kept as part of the technical documentation.
                </li>
                <li>
                  <strong>Changes to Approved Type.</strong> Documentation of
                  modifications and additional approvals must be kept.
                </li>
                <li>
                  <strong>Correspondence with Notified Bodies.</strong> Should
                  be kept as part of the conformity documentation.
                </li>
              </ul>
              <p>
                These records must be made available to market surveillance
                authorities upon request and serve as evidence of the product's
                compliance with accessibility requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="relationship-other-annexes">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="relationship-other-annexes"
              tabIndex={-1}
            >
              Relationship with Other Annexes.
            </h2>
            <div className="space-y-4">
              <p>Annex V works together with other parts of the EAA:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Annex I (Accessibility Requirements).</strong> Defines
                  the accessibility requirements that must be checked during
                  conformity procedures.
                </li>
                <li>
                  <strong>Annex II (Examples of Implementation).</strong>{' '}
                  Provides examples that can guide implementation and
                  assessment.
                </li>
                <li>
                  <strong>
                    Annex IV (Disproportionate Burden Assessment).
                  </strong>{' '}
                  May be relevant if a manufacturer claims certain requirements
                  would be too burdensome.
                </li>
                <li>
                  <strong>Annex VI (Assessment Criteria).</strong> Provides more
                  detailed criteria for assessing disproportionate burden claims
                  that might affect the scope of conformity assessment.
                </li>
              </ul>
              <p>
                Understanding these relationships is important for manufacturers
                to correctly apply the conformity assessment procedures in the
                context of the EAA as a whole.
              </p>
            </div>
          </section>

          <section aria-labelledby="references">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="references"
              tabIndex={-1}
            >
              References.
            </h2>
            <div className="space-y-4">
              <p>
                The conformity assessment procedures for products discussed on
                this page are detailed in Annex IV of the European Accessibility
                Act.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Directive (EU) 2019/882 - Annex IV.</strong>{' '}
                  Conformity Assessment Procedure - Products. This annex
                  explains the Internal Production Control (Module A) procedure
                  manufacturers must follow.
                </li>
                <li>
                  <strong>Directive (EU) 2019/882 - Article 7(2).</strong>{' '}
                  Requires manufacturers to create technical documentation
                  according to Annex IV and carry out the conformity assessment
                  procedure.
                </li>
                <li>
                  <strong>Directive (EU) 2019/882 - Article 16.</strong>{' '}
                  Specifies the requirements for the EU Declaration of
                  Conformity, which is prepared after successful conformity
                  assessment.
                </li>
              </ul>
              <p>
                For the full legal text and detailed procedure, please refer to
                the official{' '}
                <a
                  href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  aria-labelledby="official-directive-link-4-5"
                >
                  <span id="official-directive-link-4-5" className="sr-only">
                    Directive (EU) 2019/882 (opens in new window).
                  </span>
                  Directive (EU) 2019/882
                  <ExternalLink
                    aria-hidden="true"
                    className="inline-block w-4 h-4 ml-1"
                  />
                </a>
                .
              </p>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation.
              </h2>
              <Button asChild id="next-chapter-button">
                <Link
                  href={ANNEXES_LINKS.ASSESSMENT_CRITERIA.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex VI: Assessment Criteria for Disproportionate Burden.
                  </span>
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
