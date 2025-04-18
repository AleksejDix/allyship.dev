import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technical Standards | European Accessibility Act',
  description:
    'Comprehensive guide to technical standards and specifications that support compliance with the European Accessibility Act, including harmonized standards and implementation guidelines.',
}

export default function TechnicalStandardsPage() {
  return (
    <>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold mb-8">
          Harmonized Standards & Technical Specifications
        </h1>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview
          </h2>
          <div className="prose max-w-none">
            <p>
              Harmonized standards and technical specifications play a crucial
              role in the implementation of the European Accessibility Act
              (EAA). These standards provide concrete, technical solutions that,
              when followed, create a presumption of conformity with the
              accessibility requirements of the Act.
            </p>
            <p>
              While the use of harmonized standards remains voluntary, they
              offer economic operators a reliable path to compliance and reduce
              the complexity of demonstrating that products and services meet
              the EAA's accessibility requirements.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="presumption-conformity"
          >
            Presumption of Conformity
          </h2>
          <div className="prose max-w-none">
            <p>
              When a product or service complies with harmonized standards or
              parts thereof, it is presumed to conform to the accessibility
              requirements of the EAA covered by those standards. This creates a
              significant benefit for economic operators:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Legal certainty:</strong> Following harmonized standards
                provides assurance that products and services meet legal
                requirements
              </li>
              <li>
                <strong>Simplified compliance:</strong> Standards translate
                abstract requirements into concrete technical specifications
              </li>
              <li>
                <strong>Reduced compliance costs:</strong> Organizations can
                follow established methods instead of developing their own
                compliance approaches
              </li>
              <li>
                <strong>Streamlined assessment:</strong> Standards provide clear
                criteria for both internal and external conformity assessment
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="types-standards">
            Types of Standards and Specifications
          </h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mt-6 mb-2">
              Harmonized Standards
            </h3>
            <p>
              Harmonized standards are European standards developed by
              recognized European standardization organizations (CEN, CENELEC,
              ETSI) at the request of the European Commission. Key features
              include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Official status:</strong> References are published in
                the Official Journal of the European Union
              </li>
              <li>
                <strong>Legal effect:</strong> Provide presumption of conformity
                with legal requirements
              </li>
              <li>
                <strong>Multi-stakeholder development:</strong> Created through
                a consensus process involving industry, users, regulators, and
                experts
              </li>
              <li>
                <strong>Regular updates:</strong> Standards evolve to reflect
                technological developments and market needs
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Technical Specifications
            </h3>
            <p>
              In the absence of harmonized standards, the Commission can adopt
              implementing acts establishing technical specifications that
              provide presumption of conformity. These specifications:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Fill standards gaps:</strong> Address areas where
                harmonized standards don't exist or are insufficient
              </li>
              <li>
                <strong>Targeted solutions:</strong> Focus on specific
                accessibility requirements or products/services
              </li>
              <li>
                <strong>Complementary approach:</strong> Coexist with harmonized
                standards in the compliance landscape
              </li>
              <li>
                <strong>Transitional role:</strong> May serve as precursors to
                future harmonized standards
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Supporting Standards and Guidelines
            </h3>
            <p>
              Beyond harmonized standards and technical specifications,
              organizations can benefit from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>International standards:</strong> ISO/IEC standards
                relevant to accessibility
              </li>
              <li>
                <strong>Industry guidelines:</strong> Sector-specific
                accessibility recommendations
              </li>
              <li>
                <strong>Technical reports:</strong> CEN/CENELEC/ETSI technical
                reports providing guidance
              </li>
              <li>
                <strong>Best practice documentation:</strong> Resources
                developed by industry associations and disability organizations
              </li>
            </ul>
            <p>
              While these additional resources don't provide presumption of
              conformity, they can offer valuable guidance for implementing
              accessibility features and understanding technical approaches.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="key-standards">
            Key Standards for EAA Compliance
          </h2>
          <div className="prose max-w-none">
            <p>
              The European standardization organizations are developing
              standards to support EAA implementation. Some key existing and
              upcoming standards include:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Digital Accessibility Standards
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>EN 301 549:</strong> "Accessibility requirements for ICT
                products and services" - Comprehensive standard covering various
                digital accessibility requirements
              </li>
              <li>
                <strong>EN 17161:</strong> "Design for All - Accessibility
                following a Design for All approach in products, goods and
                services"
              </li>
              <li>
                <strong>EN 17210:</strong> "Accessibility and usability of the
                built environment - Functional requirements"
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Sector-Specific Standards
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Banking and financial services:</strong> Standards for
                accessible ATMs, banking terminals, and digital banking
                interfaces
              </li>
              <li>
                <strong>E-commerce:</strong> Standards for accessible online
                shopping and digital marketplaces
              </li>
              <li>
                <strong>Transport:</strong> Standards for accessible transport
                terminals, ticketing services, and travel information
              </li>
              <li>
                <strong>Electronic communications:</strong> Standards for
                accessible telecommunications services and equipment
              </li>
              <li>
                <strong>Audiovisual media:</strong> Standards for accessible
                streaming services, TV interfaces, and content
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="en301549">
            EN 301 549: Core Standard for ICT Accessibility
          </h2>
          <div className="prose max-w-none">
            <p>
              EN 301 549 is the primary European standard for ICT accessibility
              and is expected to be a key harmonized standard for EAA
              compliance. This standard:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Comprehensive scope:</strong> Covers a wide range of ICT
                products and services
              </li>
              <li>
                <strong>WCAG alignment:</strong> Incorporates Web Content
                Accessibility Guidelines (WCAG) requirements for web content and
                applications
              </li>
              <li>
                <strong>Functional performance statements:</strong> Defines how
                ICT should be accessible to people with various disabilities
              </li>
              <li>
                <strong>Hardware requirements:</strong> Specifies accessibility
                features for physical ICT devices
              </li>
              <li>
                <strong>Software requirements:</strong> Outlines accessibility
                features for software applications and operating systems
              </li>
              <li>
                <strong>Documentation and support:</strong> Covers the
                accessibility of documentation and support services
              </li>
            </ul>
            <p>
              EN 301 549 undergoes regular updates to maintain alignment with
              technological developments and evolving accessibility needs. The
              standard was initially developed for public procurement of ICT but
              now serves as a key reference for the private sector as well.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="using-standards">
            Using Standards in Practice
          </h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mt-6 mb-2">
              Selecting Relevant Standards
            </h3>
            <p>When using standards to guide EAA compliance:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Identify applicable requirements:</strong> Determine
                which EAA accessibility requirements apply to your products or
                services
              </li>
              <li>
                <strong>Map to relevant standards:</strong> Find standards that
                address those specific requirements
              </li>
              <li>
                <strong>Check for harmonized status:</strong> Verify if
                standards provide presumption of conformity by checking the
                Official Journal
              </li>
              <li>
                <strong>Consider multiple standards:</strong> Different aspects
                of a product/service may require different standards
              </li>
              <li>
                <strong>Stay current:</strong> Monitor for updates to standards
                and new harmonized standards
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Implementation Process
            </h3>
            <p>Effective standards implementation involves:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Gap analysis:</strong> Assess current products/services
                against standards requirements
              </li>
              <li>
                <strong>Implementation planning:</strong> Develop a roadmap for
                incorporating necessary accessibility features
              </li>
              <li>
                <strong>Testing:</strong> Verify compliance through testing
                against standard requirements
              </li>
              <li>
                <strong>Documentation:</strong> Maintain records of standards
                followed and conformity evidence
              </li>
              <li>
                <strong>Review and update:</strong> Regularly review compliance
                as standards and products evolve
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="partial-compliance">
            Partial Compliance with Standards
          </h2>
          <div className="prose max-w-none">
            <p>
              Organizations can claim presumption of conformity even when
              complying with only part of a harmonized standard:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Modular approach:</strong> Standards often have sections
                that can be applied independently
              </li>
              <li>
                <strong>Selective application:</strong> Only the parts of the
                standard relevant to your product/service need to be applied
              </li>
              <li>
                <strong>Mixed compliance strategy:</strong> Different standards
                may be used for different aspects of accessibility
              </li>
            </ul>
            <p>When taking this approach, organizations should:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Document clearly:</strong> Specify which parts of which
                standards have been applied
              </li>
              <li>
                <strong>Ensure coverage:</strong> Verify that all applicable EAA
                requirements are addressed
              </li>
              <li>
                <strong>Address gaps:</strong> Implement additional measures
                where standards don't fully cover requirements
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="alternative-approaches"
          >
            Alternative Approaches to Conformity
          </h2>
          <div className="prose max-w-none">
            <p>
              Using harmonized standards is not mandatory for EAA compliance.
              Organizations can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Develop custom solutions:</strong> Create proprietary
                approaches that meet accessibility requirements
              </li>
              <li>
                <strong>Use non-harmonized standards:</strong> Apply other
                recognized standards that achieve the same outcomes
              </li>
              <li>
                <strong>Implement technical specifications:</strong> Follow
                technical specifications issued by the Commission
              </li>
              <li>
                <strong>Combined approach:</strong> Use harmonized standards
                where available and alternative methods for other requirements
              </li>
            </ul>
            <p>
              When not using harmonized standards, organizations bear the burden
              of demonstrating compliance with the accessibility requirements.
              This typically requires more extensive conformity assessment and
              documentation.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="finding-standards">
            Finding and Accessing Standards
          </h2>
          <div className="prose max-w-none">
            <p>To locate and access relevant standards:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Official Journal:</strong> Check the Official Journal of
                the EU for lists of harmonized standards
              </li>
              <li>
                <strong>European standardization organizations:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    CEN (European Committee for Standardization):{' '}
                    <a
                      href="https://www.cen.eu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.cen.eu
                    </a>
                  </li>
                  <li>
                    CENELEC (European Committee for Electrotechnical
                    Standardization):{' '}
                    <a
                      href="https://www.cenelec.eu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.cenelec.eu
                    </a>
                  </li>
                  <li>
                    ETSI (European Telecommunications Standards Institute):{' '}
                    <a
                      href="https://www.etsi.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.etsi.org
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <strong>National standardization bodies:</strong> National
                organizations that provide access to European standards
              </li>
              <li>
                <strong>Commission resources:</strong> European Commission
                guidance documents on EAA implementation
              </li>
              <li>
                <strong>Industry associations:</strong> Sector-specific guidance
                on relevant accessibility standards
              </li>
            </ul>
            <p>
              Most standards must be purchased, but some organizations provide
              free access to certain standards (e.g., ETSI makes EN 301 549
              freely available).
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="future-developments">
            Future Developments
          </h2>
          <div className="prose max-w-none">
            <p>
              The landscape of harmonized standards for the EAA is expected to
              evolve:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>New standardization requests:</strong> The Commission
                will issue additional requests for standards development
              </li>
              <li>
                <strong>Technical specifications:</strong> The Commission may
                adopt technical specifications to address gaps
              </li>
              <li>
                <strong>Standards updates:</strong> Existing standards will be
                revised to better align with EAA requirements
              </li>
              <li>
                <strong>Sector-specific standards:</strong> More detailed
                standards for specific sectors and products/services will emerge
              </li>
              <li>
                <strong>International alignment:</strong> Greater harmonization
                with international accessibility standards may occur
              </li>
            </ul>
            <p>
              Organizations should stay informed about standards developments
              and plan for adaptations as new harmonized standards are
              published.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="relationship-annexes">
            Relationship with EAA Annexes
          </h2>
          <div className="prose max-w-none">
            <p>
              Harmonized standards and technical specifications have important
              connections to the EAA annexes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Annex I (Accessibility Requirements):</strong> Standards
                provide technical solutions for meeting the requirements
                specified in Annex I
              </li>
              <li>
                <strong>Annex II (Examples):</strong> Standards often formalize
                and extend the non-binding examples provided in Annex II
              </li>
              <li>
                <strong>Annex III (Built Environment):</strong> Specific
                standards like EN 17210 address the built environment
                requirements
              </li>
              <li>
                <strong>Annex IV (Disproportionate Burden):</strong> Standards
                help establish the baseline for "state of the art" when
                assessing disproportionate burden
              </li>
              <li>
                <strong>Annex V (Conformity Assessment):</strong> Following
                harmonized standards simplifies the conformity assessment
                process
              </li>
            </ul>
          </div>
        </section>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Link
            href="/eaa/implementation-timeline"
            className="text-blue-600 hover:underline"
          >
            ← Implementation Timeline
          </Link>
          <Link
            href="/eaa/fundamental-alteration"
            className="text-blue-600 hover:underline"
          >
            Fundamental Alteration →
          </Link>
        </div>
      </div>
    </>
  )
}
