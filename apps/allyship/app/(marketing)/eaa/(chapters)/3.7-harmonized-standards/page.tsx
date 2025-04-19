import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  COMPLIANCE_LINKS,
  REQUIREMENTS_LINKS,
  EXCEPTIONS_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Harmonized Standards | European Accessibility Act',
  description:
    'Information about harmonized standards and technical specifications under the European Accessibility Act (EAA) and how they relate to presumption of conformity.',
}

export default function HarmonizedStandardsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Harmonized Standards and Technical Specifications
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview and Purpose
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#harmonized-standards"
                  id="harmonized-standards-link"
                >
                  Harmonized Standards
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#technical-specifications"
                  id="technical-specifications-link"
                >
                  Technical Specifications
                </a>
              </li>
              <li>
                <a className="underline" href="#benefits" id="benefits-link">
                  Benefits of Using Standards
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#partial-conformity"
                  id="partial-conformity-link"
                >
                  Partial Conformity
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#finding-standards"
                  id="finding-standards-link"
                >
                  Finding and Using Standards
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#future-developments"
                  id="future-developments-link"
                >
                  Future Developments
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
              Overview and Purpose
            </h2>
            <div className="space-y-4">
              <p>
                Harmonized standards play a crucial role in the implementation
                of the European Accessibility Act (EAA). They provide technical
                means to meet the accessibility requirements and create a
                presumption of conformity, making it easier for economic
                operators to demonstrate compliance with the directive.
              </p>
              <p>
                Article 15 of the EAA establishes the framework for using
                harmonized standards and technical specifications to assess the
                conformity of products and services with the accessibility
                requirements set forth in the directive.
              </p>
            </div>
          </section>

          <section aria-labelledby="harmonized-standards">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="harmonized-standards"
              tabIndex={-1}
            >
              Harmonized Standards
            </h2>
            <div className="space-y-4">
              <p>
                Harmonized standards are European standards that have been
                developed by recognized European Standards Organizations (ESOs)
                such as CEN, CENELEC, or ETSI, following a standardization
                request from the European Commission.
              </p>
              <p>
                Under the EAA, products and services that comply with harmonized
                standards (or parts thereof), whose references have been
                published in the Official Journal of the European Union, benefit
                from a presumption of conformity with the accessibility
                requirements covered by those standards.
              </p>
              <p>
                This means that when a manufacturer or service provider applies
                a harmonized standard correctly, authorities must presume that
                the product or service complies with the accessibility
                requirements covered by that standard.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-2">
                Key Harmonized Standards for Accessibility
              </h3>
              <p>
                Some important harmonized standards related to accessibility
                include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>EN 301 549:</strong> "Accessibility requirements
                  suitable for public procurement of ICT products and services"
                  - This standard covers a wide range of digital accessibility
                  requirements and is frequently referenced for EAA compliance
                </li>
                <li>
                  <strong>EN 17161:</strong> "Design for All - Accessibility
                  following a Design for All approach in products, goods and
                  services - Extending the range of users"
                </li>
                <li>
                  <strong>EN 17210:</strong> "Accessibility and usability of the
                  built environment - Functional requirements"
                </li>
                <li>
                  <strong>EN 82079-1:</strong> "Preparation of instructions for
                  use - Structuring, content and presentation"
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="technical-specifications">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="technical-specifications"
              tabIndex={-1}
            >
              Technical Specifications
            </h2>
            <div className="space-y-4">
              <p>
                In the absence of published harmonized standards, the EAA allows
                for the use of technical specifications to assess conformity
                with the accessibility requirements.
              </p>
              <p>
                According to Article 15 of the EAA, the Commission may adopt
                implementing acts establishing technical specifications that
                meet the accessibility requirements of the directive. These
                implementing acts are adopted in accordance with the examination
                procedure referred to in Article 27(2) of the EAA.
              </p>
              <p>
                Products and services that conform with these technical
                specifications, or parts thereof, are presumed to conform with
                the accessibility requirements of the EAA covered by those
                technical specifications.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-2">
                Development of Technical Specifications
              </h3>
              <p>Technical specifications are developed when:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  There is an undue delay in the standardization procedure
                </li>
                <li>
                  No request to develop a harmonized standard has been made
                </li>
                <li>
                  The Commission observes shortcomings in harmonized standards
                </li>
              </ul>
              <p>
                Before adopting technical specifications, the Commission
                conducts consultations with relevant stakeholders, including
                organizations representing persons with disabilities.
              </p>
            </div>
          </section>

          <section aria-labelledby="benefits">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="benefits"
              tabIndex={-1}
            >
              Benefits of Using Harmonized Standards
            </h2>
            <div className="space-y-4">
              <p>
                Utilizing harmonized standards and technical specifications
                offers several benefits to economic operators:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Presumption of Conformity:</strong> The most
                  significant benefit is the legal presumption of conformity
                  with the EAA requirements
                </li>
                <li>
                  <strong>Reduced Compliance Burden:</strong> Standards provide
                  clear technical guidance, reducing the need for extensive
                  interpretation of legal requirements
                </li>
                <li>
                  <strong>Market Recognition:</strong> Using recognized
                  standards can enhance market acceptance of products and
                  services
                </li>
                <li>
                  <strong>Consistency:</strong> Standards promote a consistent
                  approach to accessibility across different products and
                  services
                </li>
                <li>
                  <strong>Risk Reduction:</strong> Following standards reduces
                  the risk of non-compliance findings by market surveillance
                  authorities
                </li>
              </ul>
              <p>
                For more information about conformity assessment, see the
                <Link
                  href={COMPLIANCE_LINKS.CONFORMITY.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Conformity Assessment
                </Link>{' '}
                page.
              </p>
            </div>
          </section>

          <section aria-labelledby="partial-conformity">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="partial-conformity"
              tabIndex={-1}
            >
              Partial Conformity with Standards
            </h2>
            <div className="space-y-4">
              <p>
                The EAA recognizes that harmonized standards may not always
                cover all aspects of the accessibility requirements. In such
                cases:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The presumption of conformity applies only to those aspects
                  covered by the harmonized standard
                </li>
                <li>
                  For remaining aspects, economic operators must demonstrate
                  compliance through other means
                </li>
                <li>
                  A standard may be cited in the Official Journal with
                  restrictions if it does not fully address all requirements
                </li>
              </ul>
              <p>
                This allows for flexibility while still promoting the use of
                standards where they are available and appropriate.
              </p>
            </div>
          </section>

          <section aria-labelledby="finding-standards">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="finding-standards"
              tabIndex={-1}
            >
              Finding and Using Relevant Standards
            </h2>
            <div className="space-y-4">
              <p>
                To effectively use harmonized standards for compliance with the
                EAA:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Identify Relevant Standards:</strong> Check the
                  Official Journal of the European Union for published
                  references to harmonized standards under the EAA
                </li>
                <li>
                  <strong>Assess Applicability:</strong> Determine which
                  standards apply to your specific product or service
                </li>
                <li>
                  <strong>Obtain Standards:</strong> Purchase or access the
                  standards from the relevant standardization organizations
                  (CEN, CENELEC, ETSI)
                </li>
                <li>
                  <strong>Apply Standards Correctly:</strong> Ensure proper
                  application of the standards during design, development, and
                  testing
                </li>
                <li>
                  <strong>Document Compliance:</strong> Maintain documentation
                  showing how the standards have been applied
                </li>
                <li>
                  <strong>Monitor Updates:</strong> Stay informed about updates
                  or revisions to standards that may affect compliance
                </li>
              </ol>
              <p>
                It's important to note that the list of harmonized standards
                under the EAA will evolve over time as new standards are
                developed and existing ones are revised.
              </p>
            </div>
          </section>

          <section aria-labelledby="future-developments">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="future-developments"
              tabIndex={-1}
            >
              Future Development of Standards
            </h2>
            <div className="space-y-4">
              <p>
                The European standardization process is ongoing, with new
                standards continuously being developed to address emerging
                technologies and refine existing requirements. For the EAA:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The European Commission works with European standardization
                  organizations to identify gaps in standards coverage
                </li>
                <li>
                  Standardization requests (mandates) are issued to develop new
                  harmonized standards where needed
                </li>
                <li>
                  Stakeholders, including organizations representing persons
                  with disabilities, are involved in the standards development
                  process
                </li>
                <li>
                  Technical specifications may be developed as interim measures
                  while standardization work is in progress
                </li>
              </ul>
              <p>
                Economic operators should regularly check for updates to ensure
                they are using the most current standards for compliance.
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
                  href={EXCEPTIONS_LINKS.FUNDAMENTAL_ALTERATION.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Fundamental Alteration</span>
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
