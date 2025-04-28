import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Obligations for Service Providers | European Accessibility Act',
  description:
    'Specific obligations for service providers under the European Accessibility Act (EAA).',
}

export default function ServiceProviderObligationsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations for Service Providers.
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
                  Definition.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#key-responsibilities"
                  id="key-responsibilities-link"
                >
                  Key Responsibilities.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#service-accessibility"
                  id="service-accessibility-link"
                >
                  Service Accessibility.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#documentation"
                  id="documentation-link"
                >
                  Documentation.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#information-provision"
                  id="information-provision-link"
                >
                  Information Provision.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#non-conformity"
                  id="non-conformity-link"
                >
                  Non-conformity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#cooperation"
                  id="cooperation-link"
                >
                  Cooperation.
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
          <section
            aria-labelledby="definition-heading"
            id="definition"
            className="scroll-mt-6"
          >
            <h2
              id="definition-heading"
              className="text-2xl font-semibold mb-4 mt-0"
              tabIndex={-1}
            >
              Definition of a Service Provider under the EAA.
            </h2>
            <div className="space-y-4">
              <p>
                According to the European Accessibility Act, a service provider
                is any person or organization that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provides a service in the EU market.</li>
                <li>
                  Is established within an EU country or provides services to
                  consumers within the EU.
                </li>
              </ul>
              <p className="mt-4">
                Service providers cover many sectors that fall under the scope
                of the European Accessibility Act, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>E-commerce services and websites.</li>
                <li>Banking and financial services.</li>
                <li>Electronic communications services.</li>
                <li>Transport services.</li>
                <li>Audiovisual media services.</li>
                <li>E-book services.</li>
              </ul>
            </div>
          </section>

          <section
            aria-labelledby="key-responsibilities-heading"
            id="key-responsibilities"
            className="scroll-mt-6"
          >
            <h2
              id="key-responsibilities-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Key Responsibilities.
            </h2>
            <div className="space-y-4">
              <p>
                Service providers have specific responsibilities to ensure their
                services are accessible to people with disabilities. Their main
                duties include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Designing and providing services that meet the accessibility
                  requirements.
                </li>
                <li>
                  Preparing documentation explaining how their services meet the
                  requirements.
                </li>
                <li>
                  Providing information about how their services meet
                  accessibility requirements.
                </li>
                <li>
                  Taking corrective measures when services don't meet the
                  requirements.
                </li>
                <li>
                  Cooperating with authorities responsible for checking
                  compliance.
                </li>
              </ul>
            </div>
          </section>

          <section
            aria-labelledby="service-accessibility-heading"
            id="service-accessibility"
            className="scroll-mt-6"
          >
            <h2
              id="service-accessibility-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Ensuring Service Accessibility.
            </h2>
            <div className="space-y-4">
              <p>
                Service providers must design and deliver their services to meet
                the accessibility requirements in Section III of Annex I of the
                EAA. These requirements include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Providing information about how the service works that is
                  accessible through more than one sensory channel.
                </li>
                <li>
                  Presenting website content in ways that users can perceive,
                  operate, understand, and that work with assistive
                  technologies.
                </li>
                <li>
                  Making mobile applications accessible to people with
                  disabilities.
                </li>
                <li>
                  Ensuring electronic identification, security, and payment
                  methods are understandable, perceivable, and operable for
                  people with disabilities.
                </li>
                <li>Including accessibility practices in service policies.</li>
              </ul>
              <p className="mt-4">
                Different types of services have additional specific
                requirements, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Electronic communications services must support real-time text
                  and total conversation services.
                </li>
                <li>
                  Audiovisual media services must provide accessible program
                  information and ensure accessibility features reach the end
                  user.
                </li>
                <li>
                  E-books must support text-to-speech and proper navigation
                  features.
                </li>
                <li>
                  E-commerce services must provide accessibility information
                  about products being sold.
                </li>
              </ul>
            </div>
          </section>

          <section
            aria-labelledby="documentation-heading"
            id="documentation"
            className="scroll-mt-6"
          >
            <h2
              id="documentation-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Documentation Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                Service providers must prepare and maintain documentation
                showing how their services meet the accessibility requirements.
                This documentation should include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>A general description of the service.</li>
                <li>
                  Information about which accessibility requirements apply to
                  the service.
                </li>
                <li>
                  An explanation of how the service meets these requirements.
                </li>
                <li>Evidence of accessibility testing or evaluations.</li>
              </ul>
              <p className="mt-4">
                This documentation must be kept for at least 5 years after the
                service was last provided. It must be available to authorities
                upon request.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="information-provision-heading"
            id="information-provision"
            className="scroll-mt-6"
          >
            <h2
              id="information-provision-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Information Provision.
            </h2>
            <div className="space-y-4">
              <p>
                Service providers must inform the public about the accessibility
                of their services. This means:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Explaining which accessibility features are included in the
                  service.
                </li>
                <li>
                  Describing how people with different disabilities can use the
                  service.
                </li>
                <li>
                  Providing this information in multiple accessible formats.
                </li>
                <li>
                  Making the information available to the public on the service
                  provider's website and in other appropriate locations.
                </li>
              </ul>
              <p className="mt-4">
                This information helps users understand what to expect from the
                service and how they can best use its accessibility features.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="non-conformity-heading"
            id="non-conformity"
            className="scroll-mt-6"
          >
            <h2
              id="non-conformity-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Handling Non-conformity.
            </h2>
            <div className="space-y-4">
              <p>
                If a service provider discovers their service doesn't meet
                accessibility requirements, they must:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Take immediate corrective measures to make the service comply
                  with requirements.
                </li>
                <li>
                  If the service presents an accessibility risk, inform the
                  relevant national authorities.
                </li>
                <li>
                  Provide details about the non-compliance and any corrective
                  actions taken.
                </li>
                <li>
                  Work with authorities to bring the service into compliance.
                </li>
              </ul>
              <p className="mt-4">
                Service providers should also maintain records of customer
                complaints about accessibility issues and document how these
                issues were addressed.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="cooperation-heading"
            id="cooperation"
            className="scroll-mt-6"
          >
            <h2
              id="cooperation-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Cooperation with Authorities.
            </h2>
            <div className="space-y-4">
              <p>
                Service providers must cooperate with national authorities
                responsible for monitoring service accessibility. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Providing all information and documentation necessary to prove
                  service compliance.
                </li>
                <li>
                  Explaining what steps have been taken to meet accessibility
                  requirements.
                </li>
                <li>
                  Implementing any corrective measures requested by authorities.
                </li>
                <li>
                  Allowing authorities to evaluate the service, if requested.
                </li>
                <li>
                  Responding to inquiries in the language of the authority.
                </li>
              </ul>
              <p className="mt-4">
                This cooperation helps ensure that services throughout the EU
                maintain appropriate levels of accessibility for people with
                disabilities.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="4.4-obligations-service-providers" />
          </footer>
        </div>
      </div>
    </section>
  )
}
