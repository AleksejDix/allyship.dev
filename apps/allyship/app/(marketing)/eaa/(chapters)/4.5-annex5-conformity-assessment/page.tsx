import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { ANNEXES_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title:
    'Annex V: Conformity Assessment for Products | European Accessibility Act',
  description:
    'Detailed procedures for assessing product conformity with accessibility requirements under the European Accessibility Act, including internal production control and EU-type examination.',
}

export default function ConformityAssessmentProductsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <div className="py-2">
            <Button asChild variant="secondary">
              <Link
                className="no-underline"
                href={ANNEXES_LINKS.OVERVIEW.fullPath}
                aria-labelledby="toc-button-label"
                id="toc-button"
              >
                <List size={16} aria-hidden="true" />
                <span id="toc-button-label">Annexes Overview</span>
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-bold mb-[23px]">
            Annex V: Conformity Assessment for Products
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#internal-production-control"
                  id="internal-production-control-link"
                >
                  Internal Production Control
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#eu-type-examination"
                  id="eu-type-examination-link"
                >
                  EU-Type Examination
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#conformity-to-type"
                  id="conformity-to-type-link"
                >
                  Conformity to Type
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#choosing-procedure"
                  id="choosing-procedure-link"
                >
                  Choosing the Procedure
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
                  href="#notified-bodies"
                  id="notified-bodies-link"
                >
                  Role of Notified Bodies
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#declaration-and-marking"
                  id="declaration-and-marking-link"
                >
                  Declaration and CE Marking
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#information-retention"
                  id="information-retention-link"
                >
                  Record Keeping
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#relationship-other-annexes"
                  id="relationship-other-annexes-link"
                >
                  Relationship with Other Annexes
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert py-4">
        <div className="space-y-8">
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview
            </h2>
            <div className="space-y-4">
              <p>
                Annex V of the European Accessibility Act (EAA) establishes the
                procedures for assessing whether products comply with the
                applicable accessibility requirements. This annex outlines two
                conformity assessment modules that manufacturers can use:
                internal production control (Module A) and EU-type examination
                followed by conformity to type (Modules B and C).
              </p>
              <p>
                The conformity assessment process is a critical step that
                manufacturers must complete before placing products on the EU
                market. It ensures that products meet the accessibility
                requirements specified in Annex I of the EAA and serves as the
                basis for the EU Declaration of Conformity and CE marking.
              </p>
            </div>
          </section>

          <section aria-labelledby="internal-production-control">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="internal-production-control"
              tabIndex={-1}
            >
              Module A: Internal Production Control
            </h2>
            <div className="space-y-4">
              <p>
                Internal production control (Module A) is the simplest
                conformity assessment procedure, where the manufacturer takes
                full responsibility for ensuring and declaring that the products
                concerned satisfy the applicable requirements.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Key Elements of Internal Production Control
              </h3>
              <p>
                This module consists of the following elements that
                manufacturers must implement:
              </p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Technical Documentation:</strong> The manufacturer
                  must establish technical documentation that enables assessment
                  of the product's conformity with the relevant accessibility
                  requirements. The documentation must specify:
                  <ul className="list-disc pl-6 mt-2">
                    <li>A general description of the product</li>
                    <li>
                      A list of the harmonized standards and technical
                      specifications applied
                    </li>
                    <li>
                      Descriptions and explanations necessary for understanding
                      the product's operation and its accessibility features
                    </li>
                    <li>
                      Design and manufacturing drawings and schemes of
                      components, sub-assemblies, and circuits
                    </li>
                    <li>
                      Results of design calculations and examinations carried
                      out
                    </li>
                    <li>Test reports related to accessibility features</li>
                  </ul>
                </li>
                <li>
                  <strong>Manufacturing Process Controls:</strong> The
                  manufacturer must take all measures necessary to ensure that
                  the manufacturing process and its monitoring ensure compliance
                  of the manufactured products with:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      The technical documentation prepared in the previous step
                    </li>
                    <li>
                      The applicable accessibility requirements in Annex I
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Conformity Marking and Declaration:</strong> The
                  manufacturer must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Affix the CE marking to each individual product that
                      satisfies the applicable requirements
                    </li>
                    <li>
                      Draw up a written EU Declaration of Conformity for each
                      product model
                    </li>
                    <li>
                      Keep the technical documentation and EU Declaration of
                      Conformity for five years after the product has been
                      placed on the market
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Authorized Representative:</strong> The manufacturer's
                  obligations may be fulfilled by an authorized representative,
                  on behalf and under the responsibility of the manufacturer,
                  provided they are specified in the mandate.
                </li>
              </ol>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                When to Use Internal Production Control
              </h3>
              <p>Internal production control is most appropriate when:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The product design is relatively straightforward with respect
                  to accessibility features
                </li>
                <li>
                  The manufacturer has strong in-house expertise in
                  accessibility and conformity assessment
                </li>
                <li>
                  The accessibility requirements applicable to the product are
                  well understood and can be reliably verified through internal
                  testing
                </li>
                <li>
                  Harmonized standards exist that cover all the applicable
                  accessibility requirements for the product
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
              Module B: EU-Type Examination
            </h2>
            <div className="space-y-4">
              <p>
                EU-type examination (Module B) is the part of a conformity
                assessment procedure in which a notified body examines the
                technical design of a product and verifies and attests that it
                meets the applicable accessibility requirements.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Process for EU-Type Examination
              </h3>
              <p>This module involves the following steps:</p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Application to Notified Body:</strong> The
                  manufacturer must lodge an application for EU-type examination
                  with a single notified body of their choice. The application
                  must include:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Name and address of the manufacturer</li>
                    <li>
                      A written declaration that the same application has not
                      been lodged with any other notified body
                    </li>
                    <li>
                      The technical documentation as described in Module A
                    </li>
                    <li>Representative samples of the production envisaged</li>
                    <li>
                      Supporting evidence for the adequacy of the technical
                      design solution, including any standards applied
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Assessment by Notified Body:</strong> The notified
                  body will:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Examine the technical documentation to assess the adequacy
                      of the technical design of the product in relation to the
                      applicable accessibility requirements
                    </li>
                    <li>
                      Verify that the samples have been manufactured in
                      conformity with the technical documentation
                    </li>
                    <li>
                      Carry out appropriate examinations and tests, or have them
                      carried out, to check whether the product complies with
                      the applicable accessibility requirements
                    </li>
                    <li>
                      Agree with the manufacturer on the location where the
                      examinations and tests will be carried out
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Evaluation Report and Certificate:</strong> The
                  notified body will:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Draw up an evaluation report recording the activities
                      undertaken and their outcomes
                    </li>
                    <li>
                      Issue an EU-type examination certificate if the product
                      type complies with the applicable accessibility
                      requirements
                    </li>
                    <li>
                      Refuse to issue a certificate if the product does not meet
                      the accessibility requirements, informing the applicant
                      and providing detailed reasons
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Ongoing Obligations:</strong> After certificate
                  issuance:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      The notified body must stay informed of changes in the
                      generally acknowledged state of the art that might affect
                      compliance
                    </li>
                    <li>
                      The manufacturer must inform the notified body of any
                      modifications to the approved type that may affect
                      conformity
                    </li>
                    <li>
                      The notified body must review changes and determine if
                      further examination is required
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
              Module C: Conformity to Type Based on Internal Production Control
            </h2>
            <div className="space-y-4">
              <p>
                This module follows Module B and focuses on ensuring that
                manufactured products conform to the approved EU-type
                examination certificate. It is the manufacturer's responsibility
                to ensure this conformity through internal production controls.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Key Requirements for Conformity to Type
              </h3>
              <p>Under Module C, the manufacturer must:</p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Manufacturing Controls:</strong> Take all measures
                  necessary to ensure that the manufacturing process and its
                  monitoring ensure that the manufactured products conform to
                  the approved type described in the EU-type examination
                  certificate and comply with the applicable accessibility
                  requirements.
                </li>
                <li>
                  <strong>CE Marking and Declaration:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Affix the CE marking to each individual product that
                      conforms to the approved type and satisfies the applicable
                      requirements
                    </li>
                    <li>
                      Draw up a written EU Declaration of Conformity for each
                      product model
                    </li>
                    <li>
                      Maintain a copy of the EU Declaration of Conformity
                      available for national authorities for five years after
                      the product has been placed on the market
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Authorized Representative:</strong> The manufacturer's
                  obligations may be fulfilled by an authorized representative,
                  provided they are specified in the mandate.
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
              Choosing the Appropriate Conformity Assessment Procedure
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers have flexibility in choosing which conformity
                assessment procedure to follow based on specific circumstances:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Factors to Consider
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Product Complexity:</strong> More complex products
                  with numerous accessibility features may benefit from the
                  greater scrutiny provided by EU-type examination.
                </li>
                <li>
                  <strong>Market Risk:</strong> Products where accessibility
                  failures could significantly impact users or lead to higher
                  liability might warrant external verification through Modules
                  B and C.
                </li>
                <li>
                  <strong>Manufacturer Experience:</strong> Companies with
                  limited experience in accessibility implementation might gain
                  confidence and reduce risk by using external notified bodies.
                </li>
                <li>
                  <strong>Available Standards:</strong> Where harmonized
                  standards fully cover the product, internal production control
                  may be sufficient; where gaps exist, external verification
                  provides additional assurance.
                </li>
                <li>
                  <strong>Business Considerations:</strong> While Module A
                  (internal production control) is typically faster and less
                  costly, Modules B and C may provide market advantages through
                  third-party verification.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Decision Guide
              </h3>
              <p>In general, manufacturers should consider using:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Module A (Internal Production Control) when:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      The product has straightforward accessibility features
                    </li>
                    <li>
                      The organization has strong internal accessibility
                      expertise
                    </li>
                    <li>
                      Harmonized standards completely cover all applicable
                      requirements
                    </li>
                    <li>
                      The product represents low risk in terms of accessibility
                      impact
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>
                    Modules B and C (EU-Type Examination and Conformity to Type)
                    when:
                  </strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>The product has complex accessibility features</li>
                    <li>
                      The organization has limited accessibility expertise
                    </li>
                    <li>Few harmonized standards exist for the product type</li>
                    <li>
                      Third-party verification would strengthen market position
                    </li>
                    <li>
                      The product would significantly impact users if
                      accessibility features fail
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
              Technical Documentation Requirements
            </h2>
            <div className="space-y-4">
              <p>
                Regardless of which module is chosen, robust technical
                documentation is essential for conformity assessment. The
                technical documentation must include:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Comprehensive Documentation Components
              </h3>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>General Product Description:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Overview of the product's purpose, functionality, and
                      target users
                    </li>
                    <li>
                      Identification of components, parts, and subassemblies
                    </li>
                    <li>
                      Description of user interfaces and interaction methods
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Accessibility Features Documentation:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Detailed description of how each applicable accessibility
                      requirement is met
                    </li>
                    <li>
                      Screenshots, diagrams, and examples of accessibility
                      implementations
                    </li>
                    <li>
                      Explanations of design choices made to support
                      accessibility
                    </li>
                    <li>
                      User documentation related to accessibility features
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Standards and Specifications:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      List of harmonized standards applied in full or in part
                    </li>
                    <li>
                      Descriptions of solutions adopted to meet requirements
                      where harmonized standards haven't been applied
                    </li>
                    <li>References to technical specifications used</li>
                  </ul>
                </li>
                <li>
                  <strong>Design and Manufacturing Information:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Drawings, diagrams, and specifications of components
                      related to accessibility
                    </li>
                    <li>
                      Manufacturing processes that ensure consistent
                      implementation of accessibility features
                    </li>
                    <li>
                      Quality control procedures for accessibility features
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Test Results and Assessments:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Results of accessibility tests performed</li>
                    <li>Test methodologies and validation procedures</li>
                    <li>
                      User testing with persons with disabilities (if conducted)
                    </li>
                    <li>
                      Analysis of test results and corrective actions taken
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Risk Assessment:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Identification of accessibility-related risks and
                      potential failure points
                    </li>
                    <li>Mitigations implemented to address identified risks</li>
                    <li>
                      Analysis of residual risks and justifications for
                      accepting them
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
              Role of Notified Bodies
            </h2>
            <div className="space-y-4">
              <p>
                Notified bodies play a crucial role in the conformity assessment
                procedures, particularly for Module B (EU-type examination).
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Key Responsibilities of Notified Bodies
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Technical Assessment:</strong> Evaluating whether a
                  product's technical design meets the accessibility
                  requirements specified in the EAA
                </li>
                <li>
                  <strong>Testing and Verification:</strong> Conducting or
                  supervising tests to verify compliance with accessibility
                  requirements
                </li>
                <li>
                  <strong>Certificate Issuance:</strong> Issuing EU-type
                  examination certificates for compliant products
                </li>
                <li>
                  <strong>Ongoing Monitoring:</strong> Staying informed about
                  changes in standards and state of the art that might affect
                  compliance
                </li>
                <li>
                  <strong>Change Assessment:</strong> Evaluating
                  manufacturer-notified changes to determine if they affect
                  compliance
                </li>
                <li>
                  <strong>Documentation:</strong> Maintaining records of
                  assessments and decisions
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Selecting a Notified Body
              </h3>
              <p>
                When choosing a notified body for conformity assessment,
                manufacturers should consider:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Scope of Designation:</strong> Ensure the body is
                  authorized to assess the specific product category
                </li>
                <li>
                  <strong>Accessibility Expertise:</strong> Evaluate the body's
                  specific expertise in accessibility assessment
                </li>
                <li>
                  <strong>Assessment Approach:</strong> Understand their
                  methodology and requirements
                </li>
                <li>
                  <strong>Reputation and Experience:</strong> Consider their
                  track record with similar products
                </li>
                <li>
                  <strong>Timing and Cost:</strong> Compare their process
                  timeframes and fee structures
                </li>
                <li>
                  <strong>Support Services:</strong> Determine what guidance
                  they provide during the assessment process
                </li>
              </ul>
              <p>
                Each EU Member State publishes a list of notified bodies
                designated for conformity assessment under the EAA, along with
                their identification numbers and the specific tasks for which
                they have been designated.
              </p>
            </div>
          </section>

          <section aria-labelledby="declaration-and-marking">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="declaration-and-marking"
              tabIndex={-1}
            >
              EU Declaration of Conformity and CE Marking
            </h2>
            <div className="space-y-4">
              <p>
                The conclusion of the conformity assessment procedure leads to
                two important elements: the EU Declaration of Conformity and CE
                marking.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                EU Declaration of Conformity
              </h3>
              <p>
                The EU Declaration of Conformity is a document in which the
                manufacturer states that the product meets all applicable
                accessibility requirements. It must contain:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Product identification (model, type, batch, or serial number)
                </li>
                <li>
                  Name and address of the manufacturer or authorized
                  representative
                </li>
                <li>
                  A statement that the declaration is issued under the sole
                  responsibility of the manufacturer
                </li>
                <li>Identification of the product allowing traceability</li>
                <li>Reference to the EAA and other relevant EU legislation</li>
                <li>
                  References to relevant harmonized standards or specifications
                  used
                </li>
                <li>
                  Where applicable, the name and number of the notified body and
                  reference to the EU-type examination certificate
                </li>
                <li>Signature, date, and place of issue</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">CE Marking</h3>
              <p>The CE marking:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Must be affixed visibly, legibly, and indelibly to the product
                </li>
                <li>
                  Must appear on the product packaging if it cannot be placed on
                  the product itself
                </li>
                <li>
                  Must be applied before the product is placed on the market
                </li>
                <li>
                  May be followed by the identification number of the notified
                  body if one was involved in the production control phase
                </li>
                <li>
                  Signifies that the product conforms with all applicable EU
                  legislation, including the EAA
                </li>
              </ul>
              <p>
                By applying the CE marking, the manufacturer takes full
                responsibility for the product's conformity with all applicable
                requirements of relevant EU legislation.
              </p>
            </div>
          </section>

          <section aria-labelledby="information-retention">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="information-retention"
              tabIndex={-1}
            >
              Record Keeping Requirements
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers must maintain certain documentation related to
                conformity assessment for a specified period:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Technical Documentation:</strong> Must be kept for
                  five years after the product has been placed on the market
                </li>
                <li>
                  <strong>EU Declaration of Conformity:</strong> Must be
                  retained for five years after the last product has been made
                  available
                </li>
                <li>
                  <strong>EU-Type Examination Certificate and Annexes:</strong>{' '}
                  Must be kept as part of the technical documentation
                </li>
                <li>
                  <strong>Changes to Approved Type:</strong> Documentation of
                  modifications and additional approvals must be maintained
                </li>
                <li>
                  <strong>Correspondence with Notified Bodies:</strong> Should
                  be retained as part of the conformity documentation
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
              Relationship with Other Annexes
            </h2>
            <div className="space-y-4">
              <p>Annex V works in conjunction with other parts of the EAA:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Annex I (Accessibility Requirements):</strong> Defines
                  the accessibility requirements that must be assessed during
                  conformity procedures
                </li>
                <li>
                  <strong>Annex II (Examples of Implementation):</strong>{' '}
                  Provides non-binding examples that can guide implementation
                  and assessment
                </li>
                <li>
                  <strong>
                    Annex IV (Disproportionate Burden Assessment):
                  </strong>{' '}
                  May be relevant if a manufacturer claims certain requirements
                  would impose a disproportionate burden
                </li>
                <li>
                  <strong>Annex VI (Assessment Criteria):</strong> Provides more
                  detailed criteria for assessing disproportionate burden claims
                  that might affect the scope of conformity assessment
                </li>
              </ul>
              <p>
                Understanding these relationships is important for manufacturers
                to correctly apply the conformity assessment procedures in the
                context of the EAA as a whole.
              </p>
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
              <Button asChild id="next-chapter-button">
                <Link
                  href={ANNEXES_LINKS.ASSESSMENT_CRITERIA.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex VI: Assessment Criteria for Disproportionate Burden
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
