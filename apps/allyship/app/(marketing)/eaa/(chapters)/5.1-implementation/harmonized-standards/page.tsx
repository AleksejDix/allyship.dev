import type { Metadata } from 'next'
import { Shell } from '@/components/shells/shell'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export const metadata: Metadata = {
  title:
    'Harmonized Standards and Technical Specifications | European Accessibility Act',
  description:
    'Comprehensive guide to harmonized standards and technical specifications under the European Accessibility Act (EAA).',
}

export default function HarmonizedStandardsPage() {
  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Harmonized Standards and Technical Specifications
          </h1>
          <p className="text-muted-foreground">
            Understanding the role of harmonized standards and technical
            specifications in achieving EAA compliance.
          </p>
        </div>
        <Separator />

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
            <p className="mt-2 leading-7">
              Harmonized standards and technical specifications provide a
              crucial framework for implementing the European Accessibility Act
              (EAA). These standards offer a presumption of conformity with the
              accessibility requirements outlined in the EAA, helping
              organizations achieve compliance through standardized approaches.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              Role of Harmonized Standards
            </h2>
            <p className="mt-2 leading-7">
              Harmonized standards are European standards developed by
              recognized European standardization organizations (CEN, CENELEC,
              ETSI) at the request of the European Commission. When followed,
              they provide a presumption of conformity with the EAA
              requirements.
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Presumption of Conformity:</strong> Products and
                services that comply with harmonized standards are presumed to
                conform with the EAA requirements covered by those standards.
              </li>
              <li>
                <strong>Voluntary Application:</strong> While the use of
                harmonized standards is voluntary, they offer a reliable path to
                compliance.
              </li>
              <li>
                <strong>Published References:</strong> Only harmonized standards
                whose references are published in the Official Journal of the
                European Union provide this presumption of conformity.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              Key Harmonized Standards for Accessibility
            </h2>
            <p className="mt-2 leading-7">
              The following are significant harmonized standards relevant to the
              EAA:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>EN 301 549:</strong> "Accessibility requirements for ICT
                products and services" - This comprehensive standard covers
                requirements for various ICT products and services, including
                websites, software, electronic documents, and
                telecommunications.
              </li>
              <li>
                <strong>EN 17161:</strong> "Design for All - Accessibility
                following a Design for All approach in products, goods and
                services - Extending the range of users" - Provides a framework
                for organizations to implement accessible design principles.
              </li>
              <li>
                <strong>EN 17210:</strong> "Accessibility and usability of the
                built environment - Functional requirements" - Addresses
                accessibility requirements for the built environment.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              Technical Specifications
            </h2>
            <p className="mt-2 leading-7">
              In the absence of harmonized standards, the European Commission
              can adopt technical specifications through implementing acts.
              These provide an alternative path to establishing a presumption of
              conformity with the EAA requirements.
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Implementing Acts:</strong> Technical specifications are
                adopted when harmonized standards are unavailable or
                insufficient.
              </li>
              <li>
                <strong>Market Consultation:</strong> Development involves
                consultation with relevant stakeholders including organizations
                representing persons with disabilities.
              </li>
              <li>
                <strong>Transitional Role:</strong> Technical specifications
                serve until suitable harmonized standards are developed and
                published.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              Application in Compliance Strategies
            </h2>
            <p className="mt-2 leading-7">
              Organizations should consider these approaches when applying
              standards and specifications:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Gap Analysis:</strong> Conduct an assessment of current
                products/services against relevant harmonized standards to
                identify compliance gaps.
              </li>
              <li>
                <strong>Inclusive Prioritization:</strong> Prioritize
                implementation of standards that address the most significant
                barriers faced by persons with disabilities.
              </li>
              <li>
                <strong>Documentation:</strong> Maintain detailed documentation
                of how harmonized standards have been applied, including testing
                methodologies and results.
              </li>
              <li>
                <strong>Monitoring Updates:</strong> Regularly monitor for
                updates to harmonized standards and technical specifications to
                ensure continued compliance.
              </li>
              <li>
                <strong>Complementary Approaches:</strong> Recognize that
                standards may need to be supplemented with additional measures
                to ensure full accessibility.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              Monitoring Standards Development
            </h2>
            <p className="mt-2 leading-7">
              Organizations should actively monitor the development and
              publication of harmonized standards:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Official Journal:</strong> Regularly check the Official
                Journal of the European Union for newly published harmonized
                standards.
              </li>
              <li>
                <strong>Standardization Bodies:</strong> Follow the work
                programs of European standardization organizations (CEN,
                CENELEC, ETSI).
              </li>
              <li>
                <strong>Industry Associations:</strong> Participate in industry
                associations and working groups focused on accessibility
                standards.
              </li>
              <li>
                <strong>Public Consultations:</strong> Engage in public
                consultations related to the development of new standards and
                technical specifications.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              Relationship with International Standards
            </h2>
            <p className="mt-2 leading-7">
              European harmonized standards often align with international
              standards:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>W3C Guidelines:</strong> Many web accessibility
                requirements in EN 301 549 align with the Web Content
                Accessibility Guidelines (WCAG).
              </li>
              <li>
                <strong>ISO Standards:</strong> Harmonized standards may
                incorporate or align with ISO standards such as ISO 21542 on
                accessibility in the built environment.
              </li>
              <li>
                <strong>Global Alignment:</strong> Understanding the
                relationship between European and international standards can
                help organizations with global operations streamline compliance
                efforts.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              Implementation Challenges
            </h2>
            <p className="mt-2 leading-7">
              Organizations may face these challenges when implementing
              harmonized standards:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Technical Complexity:</strong> Standards can be
                technically complex and require specialized expertise to
                implement correctly.
              </li>
              <li>
                <strong>Interpretation Issues:</strong> Some requirements may be
                open to interpretation, requiring careful analysis and
                potentially legal advice.
              </li>
              <li>
                <strong>Testing Methodologies:</strong> Determining appropriate
                testing methodologies to verify compliance with standards can be
                challenging.
              </li>
              <li>
                <strong>Evolving Standards:</strong> Standards evolve over time,
                requiring organizations to adapt their compliance strategies
                accordingly.
              </li>
              <li>
                <strong>Integration with Development:</strong> Integrating
                standards compliance into existing development and procurement
                processes can require significant organizational change.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              Practical Next Steps
            </h2>
            <p className="mt-2 leading-7">
              To effectively leverage harmonized standards and technical
              specifications:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Standards Inventory:</strong> Compile an inventory of
                relevant harmonized standards and technical specifications for
                your products and services.
              </li>
              <li>
                <strong>Compliance Plan:</strong> Develop a structured
                compliance plan that incorporates appropriate standards into
                design, development, and testing processes.
              </li>
              <li>
                <strong>Team Training:</strong> Ensure that relevant team
                members are trained on applicable standards and their
                implementation requirements.
              </li>
              <li>
                <strong>Testing Framework:</strong> Establish a comprehensive
                testing framework that validates compliance with relevant
                standards.
              </li>
              <li>
                <strong>Documentation System:</strong> Implement a system for
                documenting compliance with standards as part of your overall
                EAA compliance documentation.
              </li>
              <li>
                <strong>Consultation:</strong> Consider consulting with
                accessibility experts who specialize in the application of
                harmonized standards.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              Resources and References
            </h2>
            <p className="mt-2 leading-7">
              Further information on harmonized standards and technical
              specifications can be found at:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <Link
                  href="https://ec.europa.eu/growth/single-market/european-standards/harmonised-standards_en"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  European Commission - Harmonized Standards
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.cencenelec.eu/"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  CEN-CENELEC - European Standardization Organizations
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.etsi.org/"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  ETSI - European Telecommunications Standards Institute
                </Link>
              </li>
              <li>
                <Link
                  href="https://eur-lex.europa.eu/oj/direct-access.html"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Official Journal of the European Union
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.etsi.org/deliver/etsi_en/301500_301599/301549/"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  EN 301 549 - "Accessibility requirements for ICT products and
                  services"
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
