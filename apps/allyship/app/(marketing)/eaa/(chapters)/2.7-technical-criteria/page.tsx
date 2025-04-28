import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Technical Criteria | European Accessibility Act',
  description:
    'Understanding the technical criteria and standards for accessibility compliance under the European Accessibility Act.',
}

export default function TechnicalCriteriaPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Technical Criteria for Accessibility.
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
                <a className="underline" href="#standards" id="standards-link">
                  Harmonized Standards.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#technical-specifications"
                  id="technical-specifications-link"
                >
                  Technical Specifications.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#measurement-methodologies"
                  id="measurement-methodologies-link"
                >
                  Measurement Methodologies.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#selection-criteria"
                  id="selection-criteria-link"
                >
                  Selection Criteria.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#key-standards"
                  id="key-standards-link"
                >
                  Key Standards.
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
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview of Technical Criteria.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act requires products and services to
                meet specific accessibility requirements. To help businesses
                understand how to implement these requirements correctly, the
                EAA relies on technical criteria in the form of harmonized
                standards and technical specifications.
              </p>
              <p>
                These technical criteria provide detailed, measurable
                specifications that can guide the design, production, and
                assessment of products and services. When a product or service
                complies with these technical criteria, it is presumed to be in
                conformity with the EAA requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="standards">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="standards"
              tabIndex={-1}
            >
              Harmonized Standards.
            </h2>
            <div className="space-y-4">
              <p>
                Harmonized standards are European standards developed by
                recognized European Standards Organizations (ESOs) such as CEN,
                CENELEC, and ETSI. They provide a crucial role in the EAA
                compliance framework:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  When a product or service complies with harmonized standards,
                  it is presumed to comply with the EAA requirements covered by
                  those standards
                </li>
                <li>
                  Compliance with these standards is voluntary, but they provide
                  a straightforward path to demonstrating conformity
                </li>
                <li>
                  The European Commission periodically publishes references to
                  harmonized standards in the Official Journal of the European
                  Union
                </li>
                <li>
                  Harmonized standards translate the general requirements of the
                  EAA into detailed technical specifications
                </li>
              </ul>
              <p>
                Using harmonized standards simplifies the conformity assessment
                process and provides a common approach across the EU market.
              </p>
            </div>
          </section>

          <section aria-labelledby="technical-specifications">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="technical-specifications"
              tabIndex={-1}
            >
              Technical Specifications.
            </h2>
            <div className="space-y-4">
              <p>
                When harmonized standards don't exist or aren't sufficient, the
                European Commission can adopt technical specifications:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Technical specifications provide detailed requirements where
                  harmonized standards are not available
                </li>
                <li>
                  Like harmonized standards, products and services that comply
                  with these specifications are presumed to conform with the EAA
                </li>
                <li>
                  They are published as implementing acts by the European
                  Commission
                </li>
                <li>
                  Technical specifications may be developed more quickly than
                  full harmonized standards
                </li>
              </ul>
              <p>
                The availability of both harmonized standards and technical
                specifications ensures that businesses have access to technical
                criteria for all products and services covered by the EAA.
              </p>
            </div>
          </section>

          <section aria-labelledby="measurement-methodologies">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="measurement-methodologies"
              tabIndex={-1}
            >
              Measurement Methodologies.
            </h2>
            <div className="space-y-4">
              <p>
                Technical criteria include specific methodologies for measuring
                accessibility:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Test procedures</strong> to verify that products and
                  services meet accessibility requirements
                </li>
                <li>
                  <strong>Measurable parameters</strong> such as font sizes,
                  contrast ratios, and force requirements
                </li>
                <li>
                  <strong>Assessment methodologies</strong> for evaluating both
                  objective and subjective accessibility features
                </li>
                <li>
                  <strong>Validation methods</strong> to ensure that digital
                  interfaces comply with accessibility requirements
                </li>
              </ul>
              <p>
                These methodologies help ensure consistent assessment and
                implementation of accessibility features across different
                products and services.
              </p>
            </div>
          </section>

          <section aria-labelledby="selection-criteria">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="selection-criteria"
              tabIndex={-1}
            >
              Selection Criteria for Standards.
            </h2>
            <div className="space-y-4">
              <p>
                When choosing standards to follow, organizations should
                consider:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Official status</strong> - Prioritize harmonized
                  standards officially recognized by the European Commission
                </li>
                <li>
                  <strong>Scope alignment</strong> - Select standards that
                  specifically cover your product or service category
                </li>
                <li>
                  <strong>Date of publication</strong> - Use the most recent
                  versions of standards
                </li>
                <li>
                  <strong>International recognition</strong> - Consider
                  internationally recognized standards when harmonized standards
                  are not available
                </li>
                <li>
                  <strong>Industry consensus</strong> - Choose standards that
                  are widely accepted in your industry
                </li>
              </ul>
              <p>
                Organizations should regularly check the Official Journal of the
                European Union for updates to the list of harmonized standards
                relevant to the EAA.
              </p>
            </div>
          </section>

          <section aria-labelledby="key-standards">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="key-standards"
              tabIndex={-1}
            >
              Key Standards for EAA Compliance.
            </h2>
            <div className="space-y-4">
              <p>
                While the complete list of harmonized standards is published in
                the Official Journal, these are some of the key standards likely
                to be relevant:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>EN 301 549</strong> - Accessibility requirements for
                  ICT products and services
                </li>
                <li>
                  <strong>WCAG 2.1</strong> (Web Content Accessibility
                  Guidelines) - For web interfaces and applications
                </li>
                <li>
                  <strong>EN 17161</strong> - Design for All accessibility
                  framework
                </li>
                <li>
                  <strong>EN 17210</strong> - Accessibility and usability of the
                  built environment
                </li>
                <li>
                  <strong>EN 17260</strong> - Accessibility and usability of the
                  built environment
                </li>
                <li>
                  <strong>EN 60268-16</strong> - Sound system equipment,
                  measurement of speech intelligibility
                </li>
                <li>
                  <strong>EN 300 743</strong> - Digital Video Broadcasting
                  (DVB), subtitling systems
                </li>
              </ul>
              <p>
                These standards cover different aspects of accessibility, from
                digital interfaces to physical features, and provide detailed
                technical specifications to guide implementation.
              </p>
            </div>
          </section>

          <aside aria-labelledby="references">
            <h2
              id="references"
              className="text-xl font-semibold mb-4 scroll-mt-6"
              tabIndex={-1}
            >
              Source References.
            </h2>
            <p className="text-sm text-muted-foreground">
              This page references these sections of Directive (EU) 2019/882:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mt-2">
              <li>Article 15. Presumption of conformity.</li>
              <li>Article 16. Common technical specifications.</li>
              <li>
                Annex I. Accessibility requirements related to products and
                services.
              </li>
              <li>
                Recitals 74-76. Context on harmonized standards and technical
                specifications.
              </li>
            </ul>
          </aside>

          <footer>
            <ChapterNavigation currentPageId="2.7-technical-criteria" />
          </footer>
        </div>
      </div>
    </section>
  )
}
