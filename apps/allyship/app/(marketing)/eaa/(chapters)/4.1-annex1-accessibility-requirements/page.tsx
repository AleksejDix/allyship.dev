import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { INTRODUCTION_LINKS, ANNEXES_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title: 'Annex I: Accessibility Requirements | European Accessibility Act',
  description:
    'Plain language guide to accessibility requirements for products and services under the European Accessibility Act (EAA).',
}

export default function AccessibilityRequirementsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Annex I: Accessibility Requirements.
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
                  href="#general-requirements-products"
                  id="general-requirements-products-link"
                >
                  General Requirements for Products.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#specific-requirements-products"
                  id="specific-requirements-products-link"
                >
                  Specific Requirements for Products.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#general-requirements-services"
                  id="general-requirements-services-link"
                >
                  General Requirements for Services.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#specific-requirements-services"
                  id="specific-requirements-services-link"
                >
                  Specific Requirements for Services.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#compliance-criteria"
                  id="compliance-criteria-link"
                >
                  Criteria for Functional Performance.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#implementation"
                  id="implementation-link"
                >
                  Implementation and Monitoring.
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
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                Annex I of the European Accessibility Act lists all the
                accessibility requirements for products and services. These
                rules make sure people with disabilities can use products and
                services just like everyone else.
              </p>
              <p>
                The requirements are divided into different sections for
                products and services. Some rules apply to all products and
                services, while others are just for specific types.
              </p>
            </div>
          </section>

          <section aria-labelledby="general-requirements-products">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="general-requirements-products"
              tabIndex={-1}
            >
              Section I: General Accessibility Requirements for Products.
            </h2>
            <div className="space-y-4">
              <p>
                These requirements apply to all products covered by the EAA,
                such as electronic devices, self-service terminals, and
                e-readers.
              </p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Information Provision.</strong> Products must provide
                  information (instructions, packaging, etc.) in accessible
                  formats that:
                  <ul>
                    <li>
                      Can be accessed through more than one sense (sight,
                      hearing, touch).
                    </li>
                    <li>Are easy to understand.</li>
                    <li>Are presented in ways users can perceive.</li>
                    <li>Use good text size, shape, contrast, and spacing.</li>
                    <li>Include non-text formats when needed.</li>
                  </ul>
                </li>
                <li>
                  <strong>User Interface and Functionality.</strong> The product
                  interface, including controls and feedback, must be accessible
                  by:
                  <ul>
                    <li>Providing information through more than one sense.</li>
                    <li>
                      Offering alternatives to speech for communication and
                      operation.
                    </li>
                    <li>
                      Allowing users to adjust magnification, contrast, and
                      brightness.
                    </li>
                    <li>Providing alternative color controls.</li>
                    <li>
                      Avoiding content that could cause seizures and giving
                      enough time for interactions.
                    </li>
                    <li>
                      Providing alternatives to actions that require fine motor
                      control.
                    </li>
                    <li>
                      Avoiding designs that require extensive reach or strength.
                    </li>
                    <li>
                      Considering light sensitivity and reducing things that
                      might trigger allergies.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Support Services.</strong> Support services
                  (helpdesks, call centers, etc.) must provide information about
                  accessibility in formats that are accessible.
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="specific-requirements-products">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="specific-requirements-products"
              tabIndex={-1}
            >
              Section II: Specific Requirements for Products.
            </h2>
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold mb-2"
                id="packaging-instructions"
              >
                Product Packaging and Instructions.
              </h3>
              <p>
                Packaging and instructions must be accessible to people with
                disabilities and should:
              </p>
              <ul>
                <li>
                  Make packaging information (what the product is, how to open
                  it, etc.) accessible.
                </li>
                <li>
                  Provide instructions for installation, maintenance, storage,
                  and disposal in accessible formats.
                </li>
                <li>
                  Present safety information in multiple accessible formats.
                </li>
              </ul>

              <h3
                className="text-xl font-semibold mt-6 mb-2"
                id="self-service-terminals"
              >
                Self-Service Terminals.
              </h3>
              <p>
                Self-service terminals, like ATMs, ticket machines, and check-in
                machines, must:
              </p>
              <ul>
                <li>
                  Include text-to-speech when the terminal has text input or
                  output.
                </li>
                <li>
                  Allow use of personal headsets when the terminal has audio
                  output.
                </li>
                <li>
                  Support voice or touch interaction when timed responses are
                  needed.
                </li>
                <li>Provide visual links to audio and video content.</li>
                <li>Prevent visual flashing that could trigger seizures.</li>
                <li>Allow people to use assistive technologies when needed.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="e-readers">
                E-Readers.
              </h3>
              <p>E-book readers must include:</p>
              <ul>
                <li>Text-to-speech technology.</li>
                <li>Features that work with assistive technology.</li>
                <li>Easy navigation to content, layout, and functions.</li>
                <li>Options to adjust and reformat text display.</li>
              </ul>

              <h3
                className="text-xl font-semibold mt-6 mb-2"
                id="consumer-terminals"
              >
                Consumer Terminal Equipment.
              </h3>
              <p>
                Terminal equipment used for accessing media services must make
                the parts needed for access available to people with
                disabilities.
              </p>
            </div>
          </section>

          <section aria-labelledby="general-requirements-services">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="general-requirements-services"
              tabIndex={-1}
            >
              Section III: General Accessibility Requirements for Services.
            </h2>
            <div className="space-y-4">
              <p>
                Services covered by the EAA must be provided in ways that people
                with disabilities can use them by:
              </p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Information about Service Function.</strong>
                  <ul>
                    <li>
                      Providing information in accessible text and non-text
                      formats.
                    </li>
                    <li>
                      Presenting information in an easy to understand way.
                    </li>
                    <li>Presenting information in ways users can perceive.</li>
                  </ul>
                </li>
                <li>
                  <strong>Website and Application Accessibility.</strong>
                  <ul>
                    <li>
                      Making websites that can be perceived, operated,
                      understood, and work with assistive technologies.
                    </li>
                    <li>
                      Including a statement about accessibility compliance.
                    </li>
                    <li>Making mobile applications accessible.</li>
                  </ul>
                </li>
                <li>
                  <strong>Support Services.</strong>
                  <ul>
                    <li>
                      Providing information about the service's accessibility
                      and how it works with assistive technologies.
                    </li>
                    <li>
                      Providing accessible information about service support and
                      alternative accessible solutions.
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="specific-requirements-services">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="specific-requirements-services"
              tabIndex={-1}
            >
              Section IV: Specific Requirements for Services.
            </h2>
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold mb-2"
                id="electronic-communications"
              >
                Electronic Communications Services.
              </h3>
              <p>These services must:</p>
              <ul>
                <li>Provide real-time text along with voice communication.</li>
                <li>
                  Support total conversation services when providing video with
                  voice.
                </li>
                <li>
                  Make emergency communications accessible to people with
                  disabilities.
                </li>
              </ul>

              <h3
                className="text-xl font-semibold mt-6 mb-2"
                id="audiovisual-media"
              >
                Audiovisual Media Services.
              </h3>
              <p>These services must:</p>
              <ul>
                <li>Provide program guides that are accessible.</li>
                <li>Make sure accessibility features are fully transmitted.</li>
                <li>
                  Include accessibility features like subtitles, audio
                  descriptions, spoken subtitles, and sign language.
                </li>
              </ul>

              <h3
                className="text-xl font-semibold mt-6 mb-2"
                id="transportation"
              >
                Transportation Services.
              </h3>
              <p>
                Websites and mobile services for passenger transportation must:
              </p>
              <ul>
                <li>
                  Provide accessible information about the service, including
                  accessibility features.
                </li>
                <li>
                  Make identification, security, and payment systems accessible.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="banking">
                Banking Services.
              </h3>
              <p>These services must:</p>
              <ul>
                <li>
                  Provide accessible ways to identify yourself, sign documents,
                  and use security features.
                </li>
                <li>
                  Make sure information is easy to understand (not higher than
                  upper intermediate reading level).
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="e-books">
                E-Books.
              </h3>
              <p>E-books must:</p>
              <ul>
                <li>
                  Have digital files that allow proper formatting, navigation,
                  and access.
                </li>
                <li>Include information about their accessibility features.</li>
                <li>
                  Make sure copy protection systems don't block accessibility
                  features.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="e-commerce">
                E-Commerce Services.
              </h3>
              <p>Online stores and marketplaces must:</p>
              <ul>
                <li>
                  Provide accessible ways to identify yourself, pay, and use
                  security features.
                </li>
                <li>
                  Tell customers about the accessibility features of products
                  and services being sold.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="compliance-criteria">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="compliance-criteria"
              tabIndex={-1}
            >
              Criteria for Functional Performance.
            </h2>
            <div className="space-y-4">
              <p>
                Annex I also includes performance criteria to guide design when
                specific technical requirements don't address certain features.
                These criteria ensure products and services must be usable by
                people:
              </p>
              <ul>
                <li>Without vision.</li>
                <li>With limited vision.</li>
                <li>Who cannot perceive colors.</li>
                <li>Without hearing.</li>
                <li>With limited hearing.</li>
                <li>Who cannot speak.</li>
                <li>With limited hand control or strength.</li>
                <li>With limited reach.</li>
                <li>Who have photosensitive seizures.</li>
                <li>With limited cognitive ability.</li>
                <li>With privacy concerns related to their disability.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="implementation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="implementation"
              tabIndex={-1}
            >
              Implementation and Monitoring.
            </h2>
            <div className="space-y-4">
              <p>
                The accessibility requirements in Annex I must be followed by:
              </p>
              <ul>
                <li>
                  <strong>Manufacturers.</strong> When designing and making
                  products.
                </li>
                <li>
                  <strong>Service Providers.</strong> When developing and
                  providing services.
                </li>
                <li>
                  <strong>Importers and Distributors.</strong> When choosing
                  products to sell.
                </li>
              </ul>
              <p>
                For products, manufacturers must create documents showing how
                the product meets the accessibility requirements. For services,
                service providers must show how they comply with the rules.
              </p>
              <p>
                Government authorities in EU countries check if products and
                services follow these accessibility requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="references">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="references"
              tabIndex={-1}
            >
              References.
            </h2>
            <div className="space-y-4">
              <p>
                The accessibility requirements on this page come from Annex I of
                the European Accessibility Act.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Directive (EU) 2019/882 - Annex I.</strong>{' '}
                  Accessibility Requirements for Products and Services. This
                  annex provides the detailed technical specifications that
                  products and services must meet.
                </li>
              </ul>
              <p>
                For the full legal text and specific requirements, please refer
                to the official{' '}
                <a
                  href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  aria-labelledby="official-directive-link-4-1"
                >
                  <span id="official-directive-link-4-1" className="sr-only">
                    Directive (EU) 2019/882 (opens in new window).
                  </span>
                  Directive (EU) 2019/882
                  <ExternalLink
                    aria-hidden="true"
                    className="inline-block w-4 h-4 ml-1"
                  />
                </a>
                .
              </p>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation.
              </h2>
              <Button asChild id="next-chapter-button">
                <Link
                  href={ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex II: Implementation Examples.
                  </span>
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
