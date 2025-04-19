import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { INTRODUCTION_LINKS, ANNEXES_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title: 'Annex I: Accessibility Requirements | European Accessibility Act',
  description:
    'Detailed accessibility requirements for products and services under the European Accessibility Act (EAA), including sector-specific requirements.',
}

export default function AccessibilityRequirementsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Annex I: Accessibility Requirements
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#general-requirements-products"
                  id="general-requirements-products-link"
                >
                  General Requirements for Products
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#specific-requirements-products"
                  id="specific-requirements-products-link"
                >
                  Specific Requirements for Products
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#general-requirements-services"
                  id="general-requirements-services-link"
                >
                  General Requirements for Services
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#specific-requirements-services"
                  id="specific-requirements-services-link"
                >
                  Specific Requirements for Services
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#compliance-criteria"
                  id="compliance-criteria-link"
                >
                  Criteria for Functional Performance
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#implementation"
                  id="implementation-link"
                >
                  Implementation and Monitoring
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
              Overview
            </h2>
            <div className="space-y-4">
              <p>
                Annex I of the European Accessibility Act sets out detailed
                accessibility requirements for products and services covered by
                the directive. These requirements aim to ensure that persons
                with disabilities can access and use products and services on an
                equal basis with others.
              </p>
              <p>
                The requirements are organized into sections for different types
                of products and services, with both general requirements
                applicable to all products and services and specific
                requirements for particular sectors.
              </p>
            </div>
          </section>

          <section aria-labelledby="general-requirements-products">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="general-requirements-products"
              tabIndex={-1}
            >
              Section I: General Accessibility Requirements for Products
            </h2>
            <div className="space-y-4">
              <p>
                These requirements apply to all products covered by the EAA,
                including consumer electronic devices, self-service terminals,
                e-readers, and more:
              </p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Information Provision:</strong> Products must provide
                  information on their use (instructions, packaging, etc.) in
                  accessible formats that:
                  <ul>
                    <li>
                      Are perceivable through more than one sensory channel
                    </li>
                    <li>Are presented in an understandable way</li>
                    <li>Are presented to users in ways they can perceive</li>
                    <li>
                      Use adequate size, shape, contrast, spacing, etc. of text
                    </li>
                    <li>Complement text with non-text formats when needed</li>
                  </ul>
                </li>
                <li>
                  <strong>User Interface and Functionality:</strong> The product
                  interface, including operation, controls, and feedback, must
                  be made accessible by:
                  <ul>
                    <li>
                      Providing communication through more than one sensory
                      channel
                    </li>
                    <li>
                      Providing alternatives to speech for communication and
                      operation
                    </li>
                    <li>
                      Allowing flexible magnification, contrast, and brightness
                    </li>
                    <li>Providing alternative color controls</li>
                    <li>
                      Avoiding triggering seizures and allowing adequate time
                      for interactions
                    </li>
                    <li>
                      Providing alternatives to fine motor control and
                      simultaneous actions
                    </li>
                    <li>
                      Avoiding operation modes requiring extensive reach and
                      strength
                    </li>
                    <li>
                      Accounting for light sensitivity and minimizing triggering
                      of allergic reactions
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Support Services:</strong> Support services
                  (helpdesks, call centers, etc.) must provide information about
                  the product's accessibility in accessible modes of
                  communication.
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
              Section II: Specific Requirements for Products
            </h2>
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold mb-2"
                id="packaging-instructions"
              >
                Product Packaging and Instructions
              </h3>
              <p>
                Packaging and instructions must be accessible to persons with
                disabilities and should:
              </p>
              <ul>
                <li>
                  Make packaging information (product identification, opening
                  instructions, etc.) accessible
                </li>
                <li>
                  Provide instructions for installation, maintenance, storage,
                  and disposal in accessible formats
                </li>
                <li>
                  Present safety information in accessible multiple formats
                </li>
              </ul>

              <h3
                className="text-xl font-semibold mt-6 mb-2"
                id="self-service-terminals"
              >
                Self-Service Terminals
              </h3>
              <p>
                Self-service terminals, including ATMs, ticket machines, and
                check-in machines, must:
              </p>
              <ul>
                <li>
                  Include text-to-speech functionality when the terminal has
                  text input/output
                </li>
                <li>
                  Allow use of personal headsets/earphones when the terminal
                  delivers audio output
                </li>
                <li>
                  Support user interaction through voice or touch when requiring
                  timed responses
                </li>
                <li>Provide visual links to audio/video content</li>
                <li>Prevent visual flashing that could trigger seizures</li>
                <li>Allow use of assistive technologies where needed</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="e-readers">
                E-Readers
              </h3>
              <p>E-book readers must include:</p>
              <ul>
                <li>Text-to-speech technology</li>
                <li>Capabilities that allow assistive technology access</li>
                <li>Navigation to content, layout, and functionality</li>
                <li>
                  Dynamic reformatting and flexible settings for text
                  presentation
                </li>
              </ul>

              <h3
                className="text-xl font-semibold mt-6 mb-2"
                id="consumer-terminals"
              >
                Consumer Terminal Equipment
              </h3>
              <p>
                Terminal equipment with interactive computing capability used
                for accessing audiovisual media services must make those
                components needed for access available to persons with
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
              Section III: General Accessibility Requirements for Services
            </h2>
            <div className="space-y-4">
              <p>
                Services covered by the EAA must be provided in a way that
                maximizes their use by persons with disabilities by:
              </p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Information about Service Function:</strong>
                  <ul>
                    <li>
                      Providing information in accessible text and non-text
                      formats
                    </li>
                    <li>Presenting information in an understandable way</li>
                    <li>
                      Presenting information to users in ways they can perceive
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Website and Application Accessibility:</strong>
                  <ul>
                    <li>
                      Making websites perceivable, operable, understandable, and
                      robust
                    </li>
                    <li>
                      Including a statement about accessibility compliance
                    </li>
                    <li>
                      Making mobile applications (including mobile services)
                      accessible
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Support Services:</strong>
                  <ul>
                    <li>
                      Providing information about the service's accessibility
                      and compatibility with assistive technologies
                    </li>
                    <li>
                      Providing accessible information about service support and
                      alternative accessible solutions
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
              Section IV: Specific Requirements for Services
            </h2>
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold mb-2"
                id="electronic-communications"
              >
                Electronic Communications Services
              </h3>
              <p>These services must:</p>
              <ul>
                <li>
                  Provide real-time text in addition to voice communication
                </li>
                <li>
                  Support total conversation services when providing video
                  alongside voice
                </li>
                <li>
                  Ensure emergency communications are accessible to persons with
                  disabilities
                </li>
              </ul>

              <h3
                className="text-xl font-semibold mt-6 mb-2"
                id="audiovisual-media"
              >
                Audiovisual Media Services
              </h3>
              <p>These services must:</p>
              <ul>
                <li>
                  Provide electronic program guides that are perceivable,
                  operable, understandable, and robust
                </li>
                <li>
                  Ensure accessibility components (accessibility services) are
                  fully transmitted
                </li>
                <li>
                  Design for accessibility features like subtitles, audio
                  description, spoken subtitles, and sign language
                  interpretation
                </li>
              </ul>

              <h3
                className="text-xl font-semibold mt-6 mb-2"
                id="transportation"
              >
                Transportation Services
              </h3>
              <p>
                Websites and mobile services related to passenger transportation
                services must:
              </p>
              <ul>
                <li>
                  Provide accessible information about the service, including
                  accessibility features, in line with international guidelines
                </li>
                <li>
                  Make electronic identification, security and payment systems
                  accessible
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="banking">
                Banking Services
              </h3>
              <p>These services must:</p>
              <ul>
                <li>
                  Provide identification methods, electronic signatures, and
                  security features in accessible formats
                </li>
                <li>
                  Ensure information is understandable with a complexity level
                  not exceeding level B2 (upper intermediate) of the Council of
                  Europe's Common European Framework
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="e-books">
                E-Books
              </h3>
              <p>E-books must:</p>
              <ul>
                <li>
                  Ensure that digital files allow proper formatting, navigation,
                  and access
                </li>
                <li>Include metadata about accessibility features</li>
                <li>
                  Ensure technical protection measures don't block accessibility
                  features
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="e-commerce">
                E-Commerce Services
              </h3>
              <p>Online stores and marketplaces must:</p>
              <ul>
                <li>
                  Provide identification, security, and payment methods in
                  accessible formats
                </li>
                <li>
                  Identify accessibility features of products and services being
                  sold
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
              Criteria for Functional Performance
            </h2>
            <div className="space-y-4">
              <p>
                Annex I also establishes functional performance criteria to
                serve as guidelines when the technical requirements don't
                address specific features or functions. These criteria ensure
                that products and services must be usable by persons:
              </p>
              <ul>
                <li>Without vision</li>
                <li>With limited vision</li>
                <li>Without perception of color</li>
                <li>Without hearing</li>
                <li>With limited hearing</li>
                <li>Without vocal capability</li>
                <li>With limited manipulation or strength</li>
                <li>With limited reach</li>
                <li>With photosensitive seizures</li>
                <li>With limited cognition</li>
                <li>With privacy concerns related to their disability</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="implementation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="implementation"
              tabIndex={-1}
            >
              Implementation and Monitoring
            </h2>
            <div className="space-y-4">
              <p>
                The accessibility requirements outlined in Annex I must be
                systematically implemented by:
              </p>
              <ul>
                <li>
                  <strong>Manufacturers:</strong> When designing and producing
                  products
                </li>
                <li>
                  <strong>Service Providers:</strong> When developing and
                  providing services
                </li>
                <li>
                  <strong>Importers and Distributors:</strong> When selecting
                  products to place on the market
                </li>
              </ul>
              <p>
                For products, manufacturers must prepare technical documentation
                demonstrating how the product meets the accessibility
                requirements. For services, service providers must demonstrate
                compliance in their service provision.
              </p>
              <p>
                National authorities in EU Member States are responsible for
                monitoring compliance with the accessibility requirements and
                can perform checks to verify conformity.
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
                  href={ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex II: Implementation Examples
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
