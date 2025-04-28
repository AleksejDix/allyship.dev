import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Microenterprises Exemptions | European Accessibility Act',
  description:
    'Understanding exemptions for microenterprises providing services under the European Accessibility Act (EAA) and their requirements and limitations.',
}

export default function MicroenterprisesPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Microenterprises Exemptions.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#definition"
                  id="definition-link"
                >
                  Definition of Microenterprises.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#scope-of-exemption"
                  id="scope-of-exemption-link"
                >
                  Scope of Exemption.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#key-limitations"
                  id="key-limitations-link"
                >
                  Key Limitations.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#verification"
                  id="verification-link"
                >
                  Verification Process.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#practical-implications"
                  id="practical-implications-link"
                >
                  Practical Implications.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#best-practices"
                  id="best-practices-link"
                >
                  Best Practices.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert py-4 pt-2"
        id="eaa-content"
        aria-labelledby="page-title"
      >
        <div className="space-y-8">
          <section aria-labelledby="definition-heading">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="definition"
              tabIndex={-1}
            >
              Definition of Microenterprises.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act (EAA) provides specific
                exemptions for microenterprises that provide services. Under EU
                law, a microenterprise is defined as an enterprise that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Employs fewer than 10 persons</li>
                <li>
                  Has an annual turnover not exceeding €2 million OR an annual
                  balance sheet total not exceeding €2 million
                </li>
              </ul>
              <p>
                These criteria are based on the Commission Recommendation
                2003/361/EC concerning the definition of micro, small and
                medium-sized enterprises.
              </p>
            </div>
          </section>

          <section aria-labelledby="scope-of-exemption-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="scope-of-exemption"
              tabIndex={-1}
            >
              Scope of Exemption.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA exempts microenterprises providing services from the
                accessibility requirements of the Act. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service-specific exemption:</strong> Only
                  microenterprises that provide services are exempt from
                  complying with the accessibility requirements.
                </li>
                <li>
                  <strong>No exemption for products:</strong> Microenterprises
                  that manufacture, import, or distribute products covered by
                  the EAA must still comply with all applicable requirements.
                </li>
                <li>
                  <strong>Only applies to accessibility requirements:</strong>{' '}
                  Microenterprises are still subject to other provisions of the
                  EAA, such as market surveillance.
                </li>
              </ul>
              <p>
                This exemption recognizes the potential disproportionate burden
                that accessibility requirements might place on very small
                service providers with limited resources.
              </p>
            </div>
          </section>

          <section aria-labelledby="key-limitations-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="key-limitations"
              tabIndex={-1}
            >
              Key Limitations.
            </h2>
            <div className="space-y-4">
              <p>
                Although microenterprises providing services are exempt, there
                are important limitations to this exemption:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Member State discretion:</strong> EU Member States may
                  still choose to require microenterprises to comply with some
                  or all accessibility requirements through national
                  legislation.
                </li>
                <li>
                  <strong>Only applies to general requirements:</strong>{' '}
                  Microenterprises may still be subject to specific contractual
                  requirements (e.g., when providing services to public
                  entities).
                </li>
                <li>
                  <strong>Growth considerations:</strong> Microenterprises that
                  exceed the definition thresholds must begin complying with the
                  accessibility requirements.
                </li>
                <li>
                  <strong>Mandatory information:</strong> Market surveillance
                  authorities may request information from microenterprises to
                  verify their status.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="verification-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="verification"
              tabIndex={-1}
            >
              Verification Process.
            </h2>
            <div className="space-y-4">
              <p>
                Microenterprises claiming the exemption may be required to
                verify their status:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Self-declaration:</strong> Microenterprises can
                  self-declare their status based on the employee count and
                  financial thresholds.
                </li>
                <li>
                  <strong>Documentation:</strong> They should maintain
                  documentation that confirms their status, including:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Official employee records</li>
                    <li>
                      Financial statements showing annual turnover or balance
                      sheet totals
                    </li>
                    <li>Business registration documents</li>
                  </ul>
                </li>
                <li>
                  <strong>Authority verification:</strong> Market surveillance
                  authorities may request verification of microenterprise
                  status, particularly if there is reason to doubt a service
                  provider's claim.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="practical-implications-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="practical-implications"
              tabIndex={-1}
            >
              Practical Implications.
            </h2>
            <div className="space-y-4">
              <p>
                For microenterprises, this exemption has several practical
                implications:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Resource allocation:</strong> Limited resources can be
                  focused on core business operations rather than extensive
                  accessibility implementations.
                </li>
                <li>
                  <strong>Competitive considerations:</strong> While exempt,
                  microenterprises should consider that accessibility can
                  provide competitive advantages and access to wider markets.
                </li>
                <li>
                  <strong>Growth planning:</strong> Microenterprises approaching
                  the size thresholds should plan for eventually implementing
                  accessibility requirements.
                </li>
                <li>
                  <strong>Business relationships:</strong> When working with
                  larger enterprises or public sector clients, contractual
                  accessibility requirements may still apply regardless of
                  exemption status.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="best-practices-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="best-practices"
              tabIndex={-1}
            >
              Best Practices.
            </h2>
            <div className="space-y-4">
              <p>
                Even though microenterprises providing services are exempt,
                considering accessibility is still recommended:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Gradual implementation:</strong> Implement basic
                  accessibility features that are low-cost but high-impact.
                </li>
                <li>
                  <strong>Digital accessibility:</strong> Start with simple
                  measures for websites and apps, such as adequate color
                  contrast, text alternatives for images, and keyboard
                  navigation.
                </li>
                <li>
                  <strong>Staff awareness:</strong> Train staff on the basics of
                  accessibility and how to assist people with disabilities.
                </li>
                <li>
                  <strong>Document status:</strong> Maintain proper
                  documentation of microenterprise status, including employee
                  counts and financial information.
                </li>
                <li>
                  <strong>Monitor growth:</strong> Track business metrics
                  against the microenterprise thresholds to anticipate when
                  compliance might become mandatory.
                </li>
              </ul>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="3.3-microenterprises" />
          </footer>
        </div>
      </div>
    </section>
  )
}
