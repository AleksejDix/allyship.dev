import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title:
    'Exceptions to Accessibility Requirements | European Accessibility Act',
  description:
    'Comprehensive guide to exceptions and exemptions under the European Accessibility Act (EAA), including disproportionate burden, fundamental alteration, and transitional provisions.',
}

export default function ExceptionsOverviewPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Exceptions to Accessibility Requirements.
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
                  href="#disproportionate-burden"
                  id="disproportionate-burden-link"
                >
                  Disproportionate Burden.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#fundamental-alteration"
                  id="fundamental-alteration-link"
                >
                  Fundamental Alteration.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#microenterprises"
                  id="microenterprises-link"
                >
                  Microenterprises.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#transitional-measures"
                  id="transitional-measures-link"
                >
                  Transitional Measures.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#documentation"
                  id="documentation-link"
                >
                  Documentation Requirements.
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
                While the European Accessibility Act (EAA) establishes
                comprehensive accessibility requirements, it recognizes that
                certain exemptions and exceptions may be necessary. These
                exceptions ensure that the implementation of accessibility
                requirements remains practical, proportionate, and economically
                viable for businesses while still advancing overall
                accessibility.
              </p>
              <p>
                The EAA provides for several specific exceptions to its
                accessibility requirements, each with specific criteria and
                documentation requirements to prevent misuse:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Disproportionate burden exception</li>
                <li>Fundamental alteration exception</li>
                <li>Exemptions for microenterprises providing services</li>
                <li>Transitional periods for certain products and services</li>
              </ul>
              <p>
                It's important to note that these exceptions are not blanket
                exemptions from all accessibility requirements. Each exception
                has specific conditions, applies to particular aspects of
                compliance, and requires proper assessment and documentation.
              </p>
            </div>
          </section>

          <section aria-labelledby="disproportionate-burden">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="disproportionate-burden"
              tabIndex={-1}
            >
              Disproportionate Burden.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA recognizes that some accessibility requirements might
                impose a disproportionate burden on economic operators. In such
                cases, operators can be exempted from meeting specific
                requirements, but only to the extent that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The burden would be <strong>disproportionate</strong> to the
                  benefits for persons with disabilities
                </li>
                <li>
                  The exemption applies only to the{' '}
                  <strong>specific requirements</strong> creating the
                  disproportionate burden, not all accessibility requirements
                </li>
                <li>
                  A documented assessment has been conducted to demonstrate the
                  disproportionate burden
                </li>
              </ul>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Assessment Criteria.
              </h3>
              <p>
                When assessing whether compliance would impose a
                disproportionate burden, economic operators should consider:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cost-benefit ratio</strong>: The costs of compliance
                  compared to the estimated benefit for persons with
                  disabilities, considering the frequency and duration of use
                </li>
                <li>
                  <strong>Organizational size and resources</strong>: The size,
                  resources, and nature of the economic operator
                </li>
                <li>
                  <strong>Economic impact</strong>: The estimated impact on the
                  economic operator versus the estimated benefit for persons
                  with disabilities
                </li>
                <li>
                  <strong>Lifecycle considerations</strong>: For products with a
                  long lifecycle, costs should be calculated over the
                  operational lifetime
                </li>
              </ul>
              <p>
                Detailed assessment criteria are outlined in Annex VI of the
                European Accessibility Act.
              </p>
            </div>
          </section>

          <section aria-labelledby="fundamental-alteration">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="fundamental-alteration"
              tabIndex={-1}
            >
              Fundamental Alteration.
            </h2>
            <div className="space-y-4">
              <p>
                Accessibility requirements do not apply when they would require
                a fundamental alteration in the nature of a product or service.
                This exception recognizes that some accessibility features could
                fundamentally change a product's or service's basic character or
                purpose.
              </p>
              <h3 className="text-xl font-medium mb-2 mt-6">
                What Constitutes a Fundamental Alteration?
              </h3>
              <p>
                A fundamental alteration occurs when an accessibility
                requirement would:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Significantly change the basic nature or purpose of the
                  product or service
                </li>
                <li>
                  Remove essential functionality that defines the product or
                  service
                </li>
                <li>
                  Create an entirely different product or service than what was
                  intended
                </li>
              </ul>
              <p>
                This exception must be applied narrowly and only to the specific
                requirements that would cause the fundamental alteration.
                Economic operators must still comply with all other applicable
                accessibility requirements.
              </p>
              <p>
                Example: A visual art installation designed specifically as a
                visual experience might claim a fundamental alteration exception
                regarding making the core visual experience accessible to people
                who are blind. However, any digital information about the
                installation, ticketing systems, or physical space would still
                need to meet accessibility requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="microenterprises">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="microenterprises"
              tabIndex={-1}
            >
              Microenterprises.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA provides specific exemptions for microenterprises that
                provide services. Microenterprises providing products are not
                exempted and must comply with the product accessibility
                requirements.
              </p>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Definition of a Microenterprise.
              </h3>
              <p>A microenterprise is defined as an enterprise that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Employs fewer than 10 persons</li>
                <li>
                  Has an annual turnover not exceeding €2 million or an annual
                  balance sheet total not exceeding €2 million
                </li>
              </ul>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Scope of Exemption.
              </h3>
              <p>
                Microenterprises that provide services are exempted from
                complying with the accessibility requirements of the EAA and
                from any obligations related to compliance with those
                requirements.
              </p>
              <p>However, Member States are required to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide guidelines and tools to microenterprises to facilitate
                  the application of national measures transposing the EAA
                </li>
                <li>
                  Encourage microenterprises to implement accessibility
                  measures, even though they are exempt from the legal
                  requirements
                </li>
              </ul>
              <p>
                It's important to note that microenterprises dealing with
                products (manufacturers, importers, distributors) must still
                comply with all EAA requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="transitional-measures">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="transitional-measures"
              tabIndex={-1}
            >
              Transitional Measures.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA includes several transitional provisions that allow
                economic operators additional time to adapt to the accessibility
                requirements:
              </p>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Service Contracts.
              </h3>
              <p>
                Service contracts concluded before June 28, 2025, may continue
                without alteration until they expire, but for no longer than 5
                years from that date.
              </p>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Self-Service Terminals.
              </h3>
              <p>
                Self-service terminals lawfully used by service providers before
                June 28, 2025, may continue to be used until the end of their
                economically useful life, but for no longer than 20 years after
                their entry into use.
              </p>
              <h3 className="text-xl font-medium mb-2 mt-6">
                Extended Compliance Period.
              </h3>
              <p>
                Member States may provide that self-service terminals lawfully
                used by service providers before June 28, 2025, may continue to
                be used until the end of their economically useful life, but for
                no longer than 20 years after their entry into use.
              </p>
            </div>
          </section>

          <section aria-labelledby="documentation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="documentation"
              tabIndex={-1}
            >
              Documentation Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                For any exception claimed, economic operators must maintain
                proper documentation to justify their decision:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Disproportionate burden</strong>: The assessment used
                  to evaluate whether compliance would impose a disproportionate
                  burden must be documented and retained for a period of 5 years
                  after the last product or service is offered
                </li>
                <li>
                  <strong>Fundamental alteration</strong>: Documentation must
                  explain why specific accessibility requirements would
                  fundamentally alter the nature of the product or service
                </li>
                <li>
                  <strong>Microenterprises</strong>: Service providers claiming
                  the microenterprise exemption should maintain documentation
                  proving they meet the definition of a microenterprise
                </li>
              </ul>
              <p>
                When requested by market surveillance authorities or other
                competent national authorities, economic operators must provide
                this documentation to justify any exceptions claimed.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="3.0-exceptions" />
          </footer>
        </div>
      </div>
    </section>
  )
}
