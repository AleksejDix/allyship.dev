import React from 'react'
import { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'
import { EXTERNAL_LINKS } from '../../constants/links'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Accessibility Requirements | European Accessibility Act',
  description:
    'Comprehensive guide to accessibility requirements for products and services under the European Accessibility Act (EAA).',
}

export default function AccessibilityRequirementsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Accessibility Requirements.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#general-principles"
                  id="general-principles-link"
                >
                  General Principles.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#product-requirements"
                  id="product-requirements-link"
                >
                  Product Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#service-requirements"
                  id="service-requirements-link"
                >
                  Service Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#sector-requirements"
                  id="sector-requirements-link"
                >
                  Sector-Specific Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#functional-performance"
                  id="functional-performance-link"
                >
                  Functional Performance Criteria.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#implementation"
                  id="implementation-link"
                >
                  Implementation and Conformity.
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
          <section aria-labelledby="general-principles">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="general-principles"
              tabIndex={-1}
            >
              General Principles.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act establishes requirements to
                ensure products and services are designed and delivered in ways
                that maximize their usability by persons with disabilities.
                These requirements follow four key principles from the{' '}
                <a
                  href={EXTERNAL_LINKS.W3C_WCAG}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  Web Content Accessibility Guidelines (WCAG)
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
                :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Perceivable:</strong> Information and user interface
                  components must be presentable to users in ways they can
                  perceive through different senses.
                </li>
                <li>
                  <strong>Operable:</strong> User interface components and
                  navigation must be operable by all users, regardless of
                  ability or method of interaction.
                </li>
                <li>
                  <strong>Understandable:</strong> Information and the operation
                  of user interface must be understandable, with clear
                  instructions and intuitive design.
                </li>
                <li>
                  <strong>Robust:</strong> Content must be robust enough to be
                  reliably interpreted by a wide variety of user agents,
                  including assistive technologies.
                </li>
              </ul>
              <p>
                These principles ensure that accessibility is addressed
                comprehensively, making products and services usable by people
                with various disabilities, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Visual impairments (blindness, low vision, color blindness)
                </li>
                <li>Hearing impairments (deafness, hard of hearing)</li>
                <li>
                  Motor disabilities (limited dexterity, strength, or range of
                  motion)
                </li>
                <li>
                  Cognitive disabilities (learning differences, memory issues)
                </li>
                <li>Speech disabilities</li>
                <li>Photosensitivity</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="product-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="product-requirements"
              tabIndex={-1}
            >
              Product Requirements.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-2">
                General Product Requirements.
              </h3>
              <p>
                Products covered by the EAA must be designed with accessibility
                in mind. Key requirements include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Accessible Information:</strong> Product information
                  (instructions, warnings, labels) must be:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Available through more than one sensory channel (e.g.,
                      both visual and tactile)
                    </li>
                    <li>Presented in comprehensible ways</li>
                    <li>
                      Provided in text formats that can be used to generate
                      alternative formats
                    </li>
                    <li>Presented with adequate contrast and font size</li>
                  </ul>
                </li>
                <li>
                  <strong>Accessible User Interface:</strong> Product interfaces
                  must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Be perceivable through more than one sense</li>
                    <li>Provide alternatives to speech-based interaction</li>
                    <li>Allow for flexible magnification and contrast</li>
                    <li>
                      Provide alternatives when color is used to convey
                      information
                    </li>
                    <li>
                      Avoid triggering seizures and allow adequate time for
                      interaction
                    </li>
                    <li>
                      Accommodate different motor skills and physical
                      capabilities
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Compatibility:</strong> Products must be compatible
                  with assistive technologies such as:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Screen readers and alternative input devices</li>
                    <li>Hearing aids and cochlear implants</li>
                    <li>Assistive listening devices</li>
                  </ul>
                </li>
                <li>
                  <strong>Support Services:</strong> Help desks, call centers,
                  and technical support must provide information about product
                  accessibility in accessible formats.
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">
                Specific Product Categories.
              </h3>
              <p>
                Additional requirements exist for specific product categories:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Self-Service Terminals:</strong> ATMs, ticketing
                  machines, and check-in kiosks must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Support text-to-speech functionality</li>
                    <li>Allow use of personal headsets</li>
                    <li>Provide alternatives to timed responses</li>
                    <li>
                      Be physically accessible to people with different
                      abilities
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Computing Hardware and Operating Systems:</strong>{' '}
                  Must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Support text-to-speech conversion</li>
                    <li>
                      Provide reliable connection to assistive technologies
                    </li>
                    <li>Enable keyboard control of all functions</li>
                    <li>Allow for alternative input methods</li>
                  </ul>
                </li>
                <li>
                  <strong>E-readers:</strong> Must:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Support text-to-speech technology</li>
                    <li>
                      Ensure accessibility features aren't blocked by copy
                      protection
                    </li>
                    <li>Include metadata about accessibility features</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="service-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="service-requirements"
              tabIndex={-1}
            >
              Service Requirements.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-2">
                General Service Requirements.
              </h3>
              <p>Services covered by the EAA must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Provide Information:</strong> About how the service
                  works and its accessibility features in accessible formats.
                </li>
                <li>
                  <strong>Make Digital Interfaces Accessible:</strong> Including
                  websites and mobile applications by following these
                  principles:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Making content perceivable and operable for users</li>
                    <li>Ensuring content is understandable and robust</li>
                    <li>Providing text alternatives for non-text content</li>
                    <li>
                      Supporting various input methods beyond standard keyboards
                      and pointing devices
                    </li>
                    <li>Giving users enough time to read and use content</li>
                    <li>
                      Not designing content that could cause seizures or
                      physical reactions
                    </li>
                    <li>Helping users navigate and find content</li>
                    <li>Making text readable and understandable</li>
                    <li>
                      Making functionality appear and operate in predictable
                      ways
                    </li>
                    <li>Helping users avoid and correct mistakes</li>
                    <li>Ensuring compatibility with assistive technologies</li>
                  </ul>
                </li>
                <li>
                  <strong>Design Accessible Policies:</strong> Have practices,
                  policies, and procedures addressing the accessibility needs of
                  persons with disabilities.
                </li>
                <li>
                  <strong>Ensure Support Functions are Accessible:</strong>{' '}
                  Including electronic identification, security, and payment
                  systems.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="sector-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="sector-requirements"
              tabIndex={-1}
            >
              Sector-Specific Requirements.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-2">
                Electronic Communications.
              </h3>
              <p>Electronic communication services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide real-time text capability alongside voice
                  communication
                </li>
                <li>
                  Support total conversation services (audio, video, and
                  real-time text)
                </li>
                <li>
                  Ensure that emergency communications using voice, text, and
                  video can function simultaneously
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">
                Audiovisual Media Services.
              </h3>
              <p>These services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Make electronic program guides perceivable, operable,
                  understandable, and robust
                </li>
                <li>
                  Ensure accessibility components (subtitles, audio
                  descriptions, etc.) are fully transmitted
                </li>
                <li>
                  Make sure all parts of the service, including apps, are
                  accessible
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">E-Books.</h3>
              <p>E-book services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Support compatibility with assistive technology</li>
                <li>
                  Ensure digital rights management doesn't block accessibility
                  features
                </li>
                <li>Include metadata about accessibility features</li>
                <li>
                  Make text content and formatting accessible to assistive
                  technology
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">E-Commerce.</h3>
              <p>E-commerce services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide information about product accessibility</li>
                <li>Make all aspects of the shopping process accessible</li>
                <li>
                  Ensure checkout, payment, and account systems are accessible
                </li>
                <li>Provide accessible identification and security methods</li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">
                Banking Services.
              </h3>
              <p>Banking services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Make consumer banking websites and apps accessible</li>
                <li>Provide accessible identification methods</li>
                <li>
                  Ensure banking machines (ATMs) can be used by people with
                  disabilities
                </li>
                <li>Make documents and banking information understandable</li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">
                Transport Services.
              </h3>
              <p>Transport services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide accessible information about service accessibility
                </li>
                <li>
                  Make self-service terminals like ticketing kiosks accessible
                </li>
                <li>
                  Ensure check-in systems and boarding passes are accessible
                </li>
                <li>
                  Provide accessible information about schedules, routes, and
                  service disruptions
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="functional-performance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="functional-performance"
              tabIndex={-1}
            >
              Functional Performance Criteria.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA includes functional performance criteria to ensure
                products and services are usable by people with various
                disabilities. These criteria serve as a framework when specific
                technical requirements don't fully address all features.
                Products and services must be usable by people:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Without vision</li>
                <li>With limited vision</li>
                <li>Who cannot perceive color</li>
                <li>Without hearing</li>
                <li>With limited hearing</li>
                <li>Without vocal capability</li>
                <li>With limited manipulation or strength</li>
                <li>With limited reach</li>
                <li>With photosensitive seizure disorders</li>
                <li>With cognitive limitations</li>
                <li>With privacy concerns related to their disability</li>
              </ul>
              <p>
                These criteria ensure that regardless of specific disability,
                all users can effectively interact with products and services
                through at least one accessible method for each function.
              </p>
            </div>
          </section>

          <section aria-labelledby="implementation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="implementation"
              tabIndex={-1}
            >
              Implementation and Conformity.
            </h2>
            <div className="space-y-4">
              <p>
                The accessibility requirements established in the EAA must be
                implemented by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Manufacturers:</strong> When designing and producing
                  products
                </li>
                <li>
                  <strong>Service Providers:</strong> When developing and
                  delivering services
                </li>
                <li>
                  <strong>Importers and Distributors:</strong> When bringing
                  products to market
                </li>
              </ul>
              <p>To demonstrate conformity with these requirements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>For Products:</strong> Manufacturers must prepare
                  technical documentation showing how the product meets
                  accessibility requirements and apply the CE marking.
                </li>
                <li>
                  <strong>For Services:</strong> Service providers must
                  establish and document how their services comply with the
                  accessibility requirements.
                </li>
              </ul>
              <p>
                The EAA includes detailed procedures for conformity assessment
                through internal production control and market surveillance by
                national authorities. In cases where requirements would cause a
                disproportionate burden, exemptions may apply if properly
                documented and justified.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="2.0-scope-and-requirements" />
          </footer>
        </div>
      </div>
    </section>
  )
}
