import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { OBLIGATIONS_LINKS } from '../../constants/links'

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
              <li>
                <a
                  className="underline"
                  href="#exemptions"
                  id="exemptions-link"
                >
                  Exemptions.
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
                <li>Assessing and documenting when exemptions apply.</li>
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
                <li>
                  Documentation of any exemptions claimed (such as
                  disproportionate burden).
                </li>
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
                If a service provider claims an exemption for part of their
                service, they must explain which aspects are not fully
                accessible and why.
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

          <section
            aria-labelledby="exemptions-heading"
            id="exemptions"
            className="scroll-mt-6"
          >
            <h2
              id="exemptions-heading"
              className="text-2xl font-semibold mb-4"
              tabIndex={-1}
            >
              Exemptions.
            </h2>
            <div className="space-y-4">
              <p>
                In some cases, service providers can be exempt from meeting
                certain accessibility requirements. This is possible if they can
                prove:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Meeting the requirements would require a "fundamental
                  alteration" that would completely change the basic nature of
                  the service.
                </li>
                <li>
                  Meeting the requirements would create a "disproportionate
                  burden" on the service provider.
                </li>
              </ul>
              <p className="mt-4">
                To claim an exemption, service providers must:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Perform an assessment using the criteria in Annex VI of the
                  EAA.
                </li>
                <li>
                  Consider the relationship between costs and benefits for
                  people with disabilities.
                </li>
                <li>
                  Document their assessment showing why an exemption is
                  justified.
                </li>
                <li>
                  Keep this documentation for at least 5 years after the service
                  was last offered.
                </li>
                <li>Provide this documentation to authorities upon request.</li>
              </ul>
              <div className="bg-muted p-4 rounded-md mt-6">
                <h3 className="font-medium mb-2">Important Note.</h3>
                <p className="text-sm">
                  Even if an exemption applies to certain aspects of a service,
                  all other accessibility requirements must still be met.
                  Exemptions must be evaluated and justified separately for each
                  accessibility requirement.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Detailed Service Provider Obligations.
            </h2>
            <p>
              These obligations are based on Article 13 of the European
              Accessibility Act (Directive (EU) 2019/882).
            </p>
            <div className="mt-6">
              <Link
                href={OBLIGATIONS_LINKS.DISTRIBUTORS.fullPath}
                className="text-blue-600 hover:underline inline-flex items-center mr-6"
              >
                <ArrowRight
                  className="mr-2 rotate-180"
                  size={16}
                  aria-hidden="true"
                />
                Previous: Distributor Obligations
              </Link>
              <Link
                href={OBLIGATIONS_LINKS.OVERVIEW.fullPath}
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                Back to Obligations Overview
                <ArrowRight className="ml-2" size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
