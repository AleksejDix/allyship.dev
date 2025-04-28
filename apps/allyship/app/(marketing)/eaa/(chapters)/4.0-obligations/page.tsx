import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Obligations of Economic Operators | European Accessibility Act',
  description:
    'Overview of the obligations of different economic operators under the European Accessibility Act (EAA), including manufacturers, importers, distributors, and service providers.',
}

export default function ObligationsOverviewPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Obligations of Economic Operators.
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
                  href="#why-obligations"
                  id="why-obligations-link"
                >
                  Why Obligations Matter.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#who-is-responsible"
                  id="who-is-responsible-link"
                >
                  Who Is Responsible.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#shared-responsibility"
                  id="shared-responsibility-link"
                >
                  Shared Responsibility.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#enforcement"
                  id="enforcement-link"
                >
                  Enforcement.
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
          <section aria-labelledby="overview-heading">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act (EAA) creates rules to make
                products and services more accessible to people with
                disabilities. To make this happen, the law assigns specific
                responsibilities to different businesses involved in bringing
                products and services to consumers.
              </p>
              <p>
                These responsibilities are called "obligations" - they are legal
                requirements that businesses must follow. Different types of
                businesses have different obligations based on their role in the
                market.
              </p>
              <p>
                The EAA identifies four main types of businesses (called
                "economic operators"):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Manufacturers</strong> - Those who make products or
                  have products made for them to sell under their name
                </li>
                <li>
                  <strong>Importers</strong> - Those who bring products from
                  outside the EU into the EU market
                </li>
                <li>
                  <strong>Distributors</strong> - Those who sell products to
                  consumers but didn't make or import them
                </li>
                <li>
                  <strong>Service providers</strong> - Those who provide
                  services covered by the EAA
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="why-obligations-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="why-obligations"
              tabIndex={-1}
            >
              Why Obligations Matter.
            </h2>
            <div className="space-y-4">
              <p>These obligations are important for several reasons:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Ensuring accessibility</strong> - They make sure that
                  products and services can be used by everyone, including
                  people with disabilities
                </li>
                <li>
                  <strong>Creating clarity</strong> - They clearly define who is
                  responsible for which aspects of accessibility
                </li>
                <li>
                  <strong>Protecting consumers</strong> - They help ensure that
                  products and services are safe and work as expected
                </li>
                <li>
                  <strong>Creating a level playing field</strong> - They make
                  sure all businesses follow the same rules
                </li>
                <li>
                  <strong>Building a more inclusive market</strong> - They help
                  create an environment where accessibility becomes standard
                  practice
                </li>
              </ul>
              <p>
                Without these obligations, it would be unclear who should make
                products and services accessible, potentially leaving gaps in
                responsibility that would result in inaccessible experiences for
                many people.
              </p>
            </div>
          </section>

          <section aria-labelledby="who-is-responsible-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="who-is-responsible"
              tabIndex={-1}
            >
              Who Is Responsible for What.
            </h2>
            <div className="space-y-4">
              <p>Each type of business has different responsibilities:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Manufacturers</strong> have the most responsibility
                  because they design and make the products. They need to build
                  accessibility into their products from the start.
                </li>
                <li>
                  <strong>Importers</strong> serve as a checkpoint - they need
                  to verify that products from outside the EU meet the
                  accessibility requirements before bringing them into the EU
                  market.
                </li>
                <li>
                  <strong>Distributors</strong> need to make sure they only sell
                  products that comply with the accessibility requirements, and
                  they need to handle products carefully so they stay
                  accessible.
                </li>
                <li>
                  <strong>Service providers</strong> need to design and deliver
                  their services in an accessible way and maintain that
                  accessibility over time.
                </li>
              </ul>
              <p>
                The EAA assigns different levels of responsibility based on how
                much control each business has over the product or service.
                Those who create products or services have more obligations than
                those who just distribute them.
              </p>
            </div>
          </section>

          <section aria-labelledby="shared-responsibility-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="shared-responsibility"
              tabIndex={-1}
            >
              Shared Responsibility.
            </h2>
            <div className="space-y-4">
              <p>
                While each type of business has specific obligations, there are
                also responsibilities that everyone shares:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Responding to problems</strong> - All businesses must
                  take action if they find out a product or service doesn't meet
                  accessibility requirements
                </li>
                <li>
                  <strong>Working with authorities</strong> - Everyone must
                  cooperate with government officials who are checking for
                  compliance
                </li>
                <li>
                  <strong>Keeping records</strong> - All businesses need to
                  track which products they've received and sold to help trace
                  problems if they arise
                </li>
                <li>
                  <strong>Being honest about accessibility</strong> - No one
                  should make false claims about the accessibility of their
                  products or services
                </li>
              </ul>
              <p>
                This shared responsibility helps create a system where everyone
                in the supply chain plays a part in ensuring accessibility. If
                one business fails to meet their obligations, others may catch
                and correct the issue before it affects consumers.
              </p>
            </div>
          </section>

          <section aria-labelledby="enforcement-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="enforcement"
              tabIndex={-1}
            >
              Enforcement.
            </h2>
            <div className="space-y-4">
              <p>
                For the EAA to be effective, there needs to be a way to check
                that businesses are following their obligations. This is handled
                through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Market surveillance</strong> - Government authorities
                  monitor products and services in the market to make sure they
                  meet accessibility requirements
                </li>
                <li>
                  <strong>Documentation checks</strong> - Authorities can
                  request documentation that proves products and services meet
                  the requirements
                </li>
                <li>
                  <strong>Penalties</strong> - If businesses don't follow their
                  obligations, they may face consequences determined by each EU
                  country
                </li>
                <li>
                  <strong>Corrective actions</strong> - Businesses that don't
                  comply may be required to fix their products or services, or
                  in some cases, remove them from the market
                </li>
              </ul>
              <p>
                This enforcement system helps ensure that the obligations aren't
                just suggestions but requirements that businesses take
                seriously. It helps turn the EAA from words on paper into real
                improvements in accessibility.
              </p>
            </div>
          </section>

          <section aria-labelledby="learn-more-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="learn-more"
              tabIndex={-1}
            >
              Learn More.
            </h2>
            <div className="space-y-4">
              <p>
                The sections below provide detailed information about the
                specific obligations for each type of economic operator. These
                pages explain exactly what each business needs to do to comply
                with the EAA:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Manufacturer Obligations - What companies that create products
                  must do
                </li>
                <li>
                  Importer Obligations - Requirements for businesses bringing
                  products into the EU
                </li>
                <li>
                  Distributor Obligations - Responsibilities for businesses
                  selling products to consumers
                </li>
                <li>
                  Service Provider Obligations - What companies offering
                  services need to do
                </li>
              </ul>
              <p>
                By understanding these obligations, businesses can ensure
                they're complying with the EAA and contributing to a more
                accessible digital world.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="4.0-obligations" />
          </footer>
        </div>
      </div>
    </section>
  )
}
