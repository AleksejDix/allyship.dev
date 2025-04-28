import React from 'react'
import { Metadata } from 'next'
import { CEMark } from '../../components/ce-mark'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Conformity of Products | European Accessibility Act',
  description:
    'Understanding conformity requirements and procedures under the European Accessibility Act (EAA).',
}

export default function ConformityPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Conformity Under the European Accessibility Act.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview of Conformity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#presumption"
                  id="presumption-link"
                >
                  Presumption of Conformity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#assessment-procedures"
                  id="assessment-procedures-link"
                >
                  Assessment Procedures.
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
              <li>
                <a
                  className="underline"
                  href="#continued-obligations"
                  id="continued-obligations-link"
                >
                  Continued Obligations.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#exceptions"
                  id="exceptions-link"
                >
                  Exceptions.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#related-topics"
                  id="related-topics-link"
                >
                  Related Topics.
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
              Overview of Conformity Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act creates rules to make sure
                products and services are accessible. The conformity process
                checks that businesses have followed these accessibility rules.
              </p>
              <p>
                Conformity with the EAA covers the whole product or service
                life. This includes design, manufacturing, sale, and ongoing
                checks.
              </p>
            </div>
          </section>

          <section aria-labelledby="presumption">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="presumption"
              tabIndex={-1}
            >
              Presumption of Conformity.
            </h2>
            <div className="space-y-4">
              <p>
                Products and services that follow official EU standards are
                assumed to meet the accessibility requirements. These standards
                are published in the Official Journal of the European Union.
              </p>
              <p>
                When no official standards exist, products that follow technical
                rules created by the Commission are assumed to meet the
                accessibility requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="assessment-procedures">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="assessment-procedures"
              tabIndex={-1}
            >
              Conformity Assessment Procedures.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA has different ways to check conformity based on the type
                of business and product or service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Internal production control.</strong> The manufacturer
                  checks their own products and declares they meet the
                  requirements.
                </li>
                <li>
                  <strong>EU-type examination.</strong> For some products, an
                  official body checks the design and verifies it meets the
                  requirements.
                </li>
                <li>
                  <strong>Service providers.</strong> They must check their
                  services against accessibility requirements following the
                  rules in Annex V of the EAA.
                </li>
              </ul>
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
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-grow">
                  <p>
                    Businesses must keep complete documentation to show
                    conformity:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Technical documentation.</strong> Contains all
                      details about how the product or service meets
                      accessibility requirements.
                    </li>
                    <li>
                      <strong>EU Declaration of Conformity.</strong> A formal
                      statement that the product meets all EAA requirements.
                    </li>
                    <li>
                      <strong>CE marking.</strong> Shows products conform with
                      EU rules and can be sold in the European market.
                    </li>
                    <li>
                      <strong>Records of complaints.</strong> Includes
                      information about non-conforming products, recalls, and
                      communications with distributors.
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <CEMark
                    width={100}
                    height={80}
                    className="text-gray-800 dark:text-gray-200 mt-2"
                  />
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="continued-obligations">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="continued-obligations"
              tabIndex={-1}
            >
              Continued Conformity Obligations.
            </h2>
            <div className="space-y-4">
              <p>
                Businesses have ongoing responsibilities to ensure continued
                conformity:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Market surveillance cooperation.</strong> Providing
                  all needed information to show product conformity.
                </li>
                <li>
                  <strong>Corrective measures.</strong> Taking immediate action
                  when a product or service does not meet requirements.
                </li>
                <li>
                  <strong>Information provision.</strong> Making sure
                  authorities can get all information needed to verify
                  conformity.
                </li>
                <li>
                  <strong>Sample testing.</strong> Testing products in the
                  market when needed.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="exceptions">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="exceptions"
              tabIndex={-1}
            >
              Exceptions and Special Provisions.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA allows some exceptions to the conformity requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Disproportionate burden.</strong> If meeting
                  requirements would cost too much, businesses may be exempt
                  from specific rules.
                </li>
                <li>
                  <strong>Fundamental alteration.</strong> If meeting
                  requirements would change the basic nature of the product or
                  service.
                </li>
                <li>
                  <strong>Microenterprises.</strong> Very small service
                  providers are exempt from some requirements but must notify
                  authorities if using this exemption.
                </li>
              </ul>
            </div>
          </section>

          {/* Add References Section Here */}
          <section aria-labelledby="references" className="mt-12 pt-6 border-t">
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
              <li>
                Article 7. Manufacturer obligations related to conformity,
                documents, CE mark.
              </li>
              <li>
                Article 13. Service provider obligations related to conformity.
              </li>
              <li>Article 14. Exemptions.</li>
              <li>Article 15. Presumption of conformity.</li>
              <li>Article 16. EU Declaration of Conformity.</li>
              <li>Articles 17, 18. CE marking.</li>
              <li>Annex IV. Conformity assessment procedure for Products.</li>
              <li>
                Annex V. Information on services meeting accessibility
                requirements.
              </li>
              <li>
                Recitals 54, 79, 81, 82, 83. Context on conformity framework.
              </li>
            </ul>
          </section>

          <footer>
            <ChapterNavigation currentPageId="5.1-product-conformity" />
          </footer>
        </div>
      </div>
    </section>
  )
}
